import { NextRequest, NextResponse } from "next/server";
import { eq, and, gt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, licenses, otpChallenges } from "@/lib/db/schema";
import { normalizeEmail, randomOtp, sha256 } from "@/lib/server/crypto";
import { Resend } from "resend";

export const runtime = "nodejs";

const OTP_EXPIRY_MINUTES = 10;
const MAX_REQUESTS_PER_HOUR = 5;

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const emailRaw = body?.email;
  if (typeof emailRaw !== "string" || !emailRaw.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const email = normalizeEmail(emailRaw);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Rate limit: count recent challenges for this email
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db.select().from(otpChallenges)
    .where(and(eq(otpChallenges.email, email), gt(otpChallenges.createdAt, oneHourAgo)));
  if (recent.length >= MAX_REQUESTS_PER_HOUR) {
    // generic response
    return NextResponse.json({ message: "If a licence exists, a code has been sent." }, { status: 200 });
  }

  // Check eligible license exists
  const custRows = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  let hasActiveLicense = false;
  if (custRows.length > 0) {
    const licRows = await db.select().from(licenses).where(eq(licenses.customerId, custRows[0].id));
    hasActiveLicense = licRows.some((l) => l.status === "active");
  }

  // Always return generic response; only send email if license exists
  if (hasActiveLicense) {
    const otp = randomOtp();
    const otpHash = sha256(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await db.insert(otpChallenges).values({
      email,
      otpHash,
      expiresAt,
      attempts: 0,
    });

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "EasyBillKit <noreply@easybillkit.online>";
    if (resendKey) {
      const resend = new Resend(resendKey);
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Your EasyBillKit Pro verification code",
          html: `<p>Hello,</p><p>You requested to activate your EasyBillKit Pro lifetime purchase.</p><p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p><p>This code expires in 10 minutes.</p><p>If you did not request this code, you can ignore this email.</p><p>EasyBillKit<br/>https://easybillkit.online</p>`,
        });
      } catch (e) {
        console.error("Resend send failed");
      }
    }
  }

  return NextResponse.json({ message: "If a licence exists, a code has been sent." }, { status: 200 });
}