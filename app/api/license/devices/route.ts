import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { licenses, activations } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const licenseKey = body?.licenseKey;
  if (typeof licenseKey !== "string" || !licenseKey.trim()) {
    return NextResponse.json({ error: "License key is required" }, { status: 400 });
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
  const devices = actRows.map((a) => ({
    activation_id: a.id,
    device_name: a.deviceLabel || "Unknown Device",
    activated_at: a.createdAt.toISOString(),
    last_validated_at: a.lastUsedAt?.toISOString() ?? a.createdAt.toISOString(),
    status: a.expiresAt && new Date() > new Date(a.expiresAt) ? "expired" : "active",
  }));

  return NextResponse.json({ devices, maxActivations: 3 });
}