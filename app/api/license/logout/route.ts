import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { sha256 } from "@/lib/server/crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("ebk_session")?.value;
  if (token) {
    const tokenHash = sha256(token);
    await db.delete(activations).where(eq(activations.tokenHash, tokenHash));
  }
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set("ebk_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}