import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activations, licenses } from "@/lib/db/schema";
import { sha256 } from "@/lib/server/crypto";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ebk_session")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
  }
  const tokenHash = sha256(token);
  const actRows = await db.select().from(activations).where(eq(activations.tokenHash, tokenHash)).limit(1);
  if (actRows.length === 0) {
    return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
  }
  const activation = actRows[0];
  if (new Date() > activation.expiresAt) {
    return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
  }
  const licRows = await db.select().from(licenses).where(eq(licenses.id, activation.licenseId)).limit(1);
  if (licRows.length === 0 || licRows[0].status !== "active") {
    return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
  }
  // update last used
  await db.update(activations).set({ lastUsedAt: new Date() }).where(eq(activations.id, activation.id));
  return NextResponse.json({ authenticated: true, isPro: true, plan: licRows[0].plan }, { status: 200 });
}