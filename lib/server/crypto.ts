import crypto from "node:crypto";

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function randomOtp(): string {
  // 6-digit cryptographically secure
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}