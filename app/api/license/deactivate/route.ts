import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activations, licenses } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const licenseKey = body?.licenseKey;
  const deviceHash = body?.deviceHash;

  if (typeof licenseKey !== "string" || !licenseKey.trim()) {
    return NextResponse.json({ error: "License key is required" }, { status: 400 });
  }
  if (typeof deviceHash !== "string" || !deviceHash.trim()) {
    return NextResponse.json({ error: "Device identifier is required" }, { status: 400 });
  }

  const key = licenseKey.trim().toUpperCase();

  const { sha256 } = await import("@/lib/server/crypto");
  const keyHash = sha256(key);

  const licRows = await db.select().from(licenses).where(eq(licenses.licenseKeyHash, keyHash)).limit(1);
  if (licRows.length === 0) {
    return NextResponse.json({ error: "Invalid license key" }, { status: 403 });
  }
  const license = licRows[0];

  const actRows = await db.select().from(activations).where(eq(activations.licenseId, license.id));
  const activation = actRows.find((a) => a.deviceHash === deviceHash);
  if (!activation) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  await db.delete(activations).where(eq(activations.id, activation.id));

  return NextResponse.json({ success: true });
}