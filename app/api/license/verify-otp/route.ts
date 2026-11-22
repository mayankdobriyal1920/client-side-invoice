import { NextRequest, NextResponse } from "next/server";
import { eq, and, gt, desc, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, licenses, otpChallenges, activations } from "@/lib/db/schema";
import { normalizeEmail, sha256, randomToken, timingSafeEqual } from "@/lib/server/crypto";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const SESSION_DAYS = 30;

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const emailRaw = body?.email;
  const otp = body?.otp;
  if (typeof emailRaw !== "string" || typeof otp !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const email = normalizeEmail(emailRaw);
  const otpClean = otp.trim();

  // find latest unconsumed challenge
  const challenges = await db.select().from(otpChallenges)
    .where(and(eq(otpChallenges.email, email), isNull(otpChallenges.consumedAt)))
    .orderBy(desc(otpChallenges.createdAt))
    .limit(1);
  if (challenges.length === 0) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }
  const challenge = challenges[0];
  if (new Date() > challenge.expiresAt) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const otpHash = sha256(otpClean);
  const match = timingSafeEqual(otpHash, challenge.otpHash);
  // increment attempts
  await db.update(otpChallenges).set({ attempts: challenge.attempts + 1 }).where(eq(otpChallenges.id, challenge.id));

  if (!match) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  // consume challenge
  await db.update(otpChallenges).set({ consumedAt: new Date() }).where(eq(otpChallenges.id, challenge.id));

  // find customer + active license
  const custRows = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  if (custRows.length === 0) {
    return NextResponse.json({ error: "No licence found" }, { status: 403 });
  }
  const licRows = await db.select().from(licenses).where(eq(licenses.customerId, custRows[0].id));
  const activeLicense = licRows.find((l) => l.status === "active");
  if (!activeLicense) {
    return NextResponse.json({ error: "No active licence" }, { status: 403 });
  }

  // create activation session
  const rawToken = randomToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(activations).values({
    licenseId: activeLicense.id,
    tokenHash,
    expiresAt,
  });

  const isProd = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ success: true, isPro: true }, { status: 200 });
  res.cookies.set("ebk_session", rawToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}