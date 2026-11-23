import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { licenses, activations } from "@/lib/db/schema";
import { sha256, randomToken } from "@/lib/server/crypto";

export const runtime = "nodejs";

const SESSION_DAYS = 30;

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const licenseKey = body?.licenseKey;
  const deviceName = body?.deviceName;
  const deviceHash = body?.deviceHash;

  if (typeof licenseKey !== "string" || !licenseKey.trim()) {
    return NextResponse.json({ error: "License key is required" }, { status: 400 });
  }
  if (typeof deviceName !== "string" || !deviceName.trim()) {
    return NextResponse.json({ error: "Device name is required" }, { status: 400 });
  }
  if (typeof deviceHash !== "string" || !deviceHash.trim()) {
    return NextResponse.json({ error: "Device identifier is required" }, { status: 400 });
  }

  const key = licenseKey.trim().toUpperCase();

  // Basic format validation
  if (!/^EBK-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) {
    return NextResponse.json({ error: "Invalid license key format" }, { status: 400 });
  }

  const keyHash = sha256(key);

  // Find active license with this key hash
  const licRows = await db.select().from(licenses).where(eq(licenses.licenseKeyHash, keyHash)).limit(1);
  if (licRows.length === 0) {
    return NextResponse.json({ error: "Invalid license key" }, { status: 403 });
  }
  const license = licRows[0];
  if (license.status !== "active") {
    return NextResponse.json({ error: "License is not active" }, { status: 403 });
  }

  // Check if this device is already activated
  const existingActivations = await db.select().from(activations).where(eq(activations.licenseId, license.id));
  const existingDevice = existingActivations.find(a => a.deviceLabel === deviceName);
  if (existingDevice) {
    // Reactivate existing device
    const rawToken = randomToken(32);
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await db.update(activations).set({ tokenHash, expiresAt, lastUsedAt: new Date() }).where(eq(activations.id, existingDevice.id));

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ success: true, isPro: true, plan: license.plan, signedToken: rawToken, expiresAt: expiresAt.toISOString() }, { status: 200 });
    res.cookies.set("ebk_session", rawToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return res;
  }

  // Create new activation session
  const rawToken = randomToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(activations).values({
    licenseId: license.id,
    tokenHash,
    deviceLabel: deviceName,
    deviceHash,
    expiresAt,
  });

  const isProd = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ success: true, isPro: true, plan: license.plan, signedToken: rawToken, expiresAt: expiresAt.toISOString() }, { status: 200 });
  res.cookies.set("ebk_session", rawToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}