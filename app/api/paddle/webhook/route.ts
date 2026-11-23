import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, transactions, licenses, activations, webhookEvents } from "@/lib/db/schema";
import { verifyPaddleSignature, PRO_PRICE_ID, isProPrice } from "@/lib/server/paddle";
import { normalizeEmail, sha256, randomToken } from "@/lib/server/crypto";

export const runtime = "nodejs";

const PADDLE_API_BASE = process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
  ? "https://sandbox-api.paddle.com"
  : "https://api.paddle.com";

function generateLicenseKey(): string {
  // EBK-XXXX-XXXX-XXXX-XXXX format
  const parts = Array.from({ length: 4 }, () => randomToken(2).toUpperCase());
  return `EBK-${parts.join("-")}`;
}

async function fetchCustomerEmail(customerId: string): Promise<string | null> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey || !customerId) return null;
  try {
    const res = await fetch(`${PADDLE_API_BASE}/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.email ?? null;
  } catch {
    return null;
  }
}

async function sendLicenseKeyEmail(email: string, licenseKey: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "EasyBillKit <noreply@easybillkit.online>";
  if (!resendKey) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }
  try {
    const resend = (await import("resend")).Resend;
    const rs = new resend(resendKey);
    await rs.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your EasyBillKit Pro License Key",
      html: `
        <p>Hello,</p>
        <p>Thank you for purchasing EasyBillKit Pro!</p>
        <p>Your license key is:</p>
        <p style="font-size:20px;font-weight:bold;letter-spacing:2px;background:#f0f0f0;padding:12px;border-radius:6px">${licenseKey}</p>
        <p>Go to <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://easybillkit.online"}/activate">activate your Pro license</a>.</p>
        <p>If you did not make this purchase, please contact hello@easybillkit.online.</p>
      `,
    });
    return true;
  } catch (e) {
    console.error("Resend send failed", e);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paddle-signature");
  const verification = verifyPaddleSignature(rawBody, sigHeader, secret);
  if (!verification.valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId = event?.event_id;
  const eventType = event?.event_type;
  if (!eventId || !eventType) {
    return NextResponse.json({ error: "Missing event_id or event_type" }, { status: 400 });
  }

  // Idempotency: check if already processed
  const existing = await db.select().from(webhookEvents).where(eq(webhookEvents.paddleEventId, eventId)).limit(1);
  if (existing.length > 0 && existing[0].processedAt) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }
  if (existing.length > 0 && !existing[0].processedAt) {
    try { await db.delete(webhookEvents).where(eq(webhookEvents.paddleEventId, eventId)); } catch {}
  }

  try {
    await db.insert(webhookEvents).values({
      paddleEventId: eventId,
      eventType,
      processedAt: null,
    });
  } catch {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  try {
    if (eventType === "transaction.completed") {
      const tx = event.data;
      if (tx?.status !== "completed") {
        await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
        return NextResponse.json({ received: true }, { status: 200 });
      }
      const items = tx?.items ?? [];
      const priceId = items?.[0]?.price?.id ?? items?.[0]?.price_id;
      const quantity = items?.[0]?.quantity ?? 1;
      if (!isProPrice(priceId)) {
        await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
        return NextResponse.json({ received: true, ignored: "wrong_price" }, { status: 200 });
      }
      if (quantity !== 1) {
        await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
        return NextResponse.json({ received: true, ignored: "wrong_quantity" }, { status: 200 });
      }

      const customerIdPaddle = tx?.customer_id;
      let email = tx?.customer?.email ?? tx?.billing_details?.email ?? tx?.checkout?.email ?? null;
      if (!email && customerIdPaddle) {
        email = await fetchCustomerEmail(customerIdPaddle);
      }
      if (!email) {
        await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
        return NextResponse.json({ error: "Customer email not found" }, { status: 400 });
      }
      const normalized = normalizeEmail(email);
      const amount = tx?.details?.totals?.total ?? tx?.details?.totals?.subtotal ?? 0;
      const currency = tx?.currency_code ?? "USD";
      const purchasedAt = tx?.completed_at ? new Date(tx.completed_at) : new Date();

      // DB transaction: upsert customer, insert transaction, create license with key
      let licenseKey: string | null = null;
      let licenseKeyHash: string | null = null;
      await db.transaction(async (trx) => {
        // upsert customer
        let customer = await trx.select().from(customers).where(eq(customers.email, normalized)).limit(1);
        let customerId: string;
        if (customer.length === 0) {
          const inserted = await trx.insert(customers).values({
            email: normalized,
            paddleCustomerId: customerIdPaddle ?? null,
          }).returning();
          customerId = inserted[0].id;
        } else {
          customerId = customer[0].id;
          if (customerIdPaddle && !customer[0].paddleCustomerId) {
            await trx.update(customers).set({ paddleCustomerId: customerIdPaddle, updatedAt: new Date() }).where(eq(customers.id, customerId));
          }
        }

        // insert transaction (idempotent by paddle_transaction_id)
        const existingTx = await trx.select().from(transactions).where(eq(transactions.paddleTransactionId, tx.id)).limit(1);
        let transactionId: string;
        if (existingTx.length > 0) {
          transactionId = existingTx[0].id;
          await trx.update(transactions).set({ status: "completed", updatedAt: new Date() }).where(eq(transactions.id, transactionId));
        } else {
          const insertedTx = await trx.insert(transactions).values({
            paddleTransactionId: tx.id,
            customerId,
            paddlePriceId: priceId,
            amount: Number(amount),
            currency,
            status: "completed",
            purchasedAt,
          }).returning();
          transactionId = insertedTx[0].id;
        }

        // create license if not exists
        const existingLicense = await trx.select().from(licenses).where(eq(licenses.transactionId, transactionId)).limit(1);
        if (existingLicense.length === 0) {
          licenseKey = generateLicenseKey();
          licenseKeyHash = sha256(licenseKey);
          await trx.insert(licenses).values({
            customerId,
            transactionId,
            licenseKeyHash,
            plan: "lifetime_pro",
            status: "active",
          });
        } else if (existingLicense[0].status !== "active") {
          await trx.update(licenses).set({ status: "active", updatedAt: new Date() }).where(eq(licenses.id, existingLicense[0].id));
          licenseKeyHash = existingLicense[0].licenseKeyHash ?? null;
        }
      });

      // Send license key email outside the transaction
      if (licenseKey) {
        await sendLicenseKeyEmail(normalized, licenseKey);
      }

      await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
      return NextResponse.json({ received: true, licenseKey: licenseKey ?? licenseKeyHash ? "generated" : "existing" }, { status: 200 });
    }

    if (eventType === "transaction.refunded" || eventType === "adjustment.created") {
      const tx = event.data;
      let paddleTransactionId: string | null = null;
      if (eventType === "transaction.refunded") {
        paddleTransactionId = tx?.id ?? null;
      } else {
        paddleTransactionId = tx?.transaction_id ?? tx?.data?.transaction_id ?? null;
        const adjustmentType = tx?.action ?? tx?.type ?? "";
        if (adjustmentType && !String(adjustmentType).toLowerCase().includes("refund") && !String(adjustmentType).toLowerCase().includes("chargeback")) {
          await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
          return NextResponse.json({ received: true, ignored: "non_refund_adjustment" }, { status: 200 });
        }
      }

      if (paddleTransactionId) {
        const txRows = await db.select().from(transactions).where(eq(transactions.paddleTransactionId, paddleTransactionId)).limit(1);
        if (txRows.length > 0) {
          const transactionId = txRows[0].id;
          await db.update(transactions).set({ status: "refunded", updatedAt: new Date() }).where(eq(transactions.id, transactionId));
          const licRows = await db.select().from(licenses).where(eq(licenses.transactionId, transactionId)).limit(1);
          if (licRows.length > 0) {
            const licenseId = licRows[0].id;
            await db.update(licenses).set({ status: "revoked", updatedAt: new Date() }).where(eq(licenses.id, licenseId));
            await db.update(activations).set({ expiresAt: new Date() }).where(eq(activations.licenseId, licenseId));
          }
        }
      }
      await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.paddleEventId, eventId));
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error", err);
    try { await db.delete(webhookEvents).where(eq(webhookEvents.paddleEventId, eventId)); } catch {}
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}