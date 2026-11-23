import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, licenses } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const email = body?.email;
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();

  // Check if customer exists with active license
  const custRows = await db.select().from(customers).where(eq(customers.email, normalized)).limit(1);
  if (custRows.length === 0) {
    // Return generic success to avoid email enumeration
    return NextResponse.json({ success: true, message: "If an account exists, recovery instructions have been sent." });
  }

  const licRows = await db.select().from(licenses).where(eq(licenses.customerId, custRows[0].id));
  const activeLicense = licRows.find((l) => l.status === "active");
  if (!activeLicense) {
    return NextResponse.json({ success: true, message: "If an account exists, recovery instructions have been sent." });
  }

  // In production, send recovery email via Resend here
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = (await import("resend")).Resend;
      const rs = new resend(resendKey);
      await rs.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "EasyBillKit <noreply@easybillkit.online>",
        to: normalized,
        subject: "EasyBillKit Pro License Key Recovery",
        html: `
          <p>Hello,</p>
          <p>You requested recovery for your EasyBillKit Pro license key.</p>
          <p>If you need assistance, please contact hello@easybillkit.online with your purchase details.</p>
        `,
      });
    } catch (e) {
      console.error("Resend recovery email failed", e);
    }
  }

  return NextResponse.json({ success: true, message: "If an account exists, recovery instructions have been sent." });
}