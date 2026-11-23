import crypto from "node:crypto";

export interface PaddleWebhookVerification {
  valid: boolean;
  timestamp?: string;
  signature?: string;
}

export function verifyPaddleSignature(rawBody: string, signatureHeader: string | null, secret: string): PaddleWebhookVerification {
  if (!signatureHeader) return { valid: false };
  const parts = signatureHeader.split(";").map((p) => p.trim());
  const tsPart = parts.find((p) => p.startsWith("ts="));
  const h1Part = parts.find((p) => p.startsWith("h1="));
  if (!tsPart || !h1Part) return { valid: false };
  const ts = tsPart.slice(3);
  const h1 = h1Part.slice(3);
  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  // timing-safe compare
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(h1, "hex");
  if (a.length !== b.length) return { valid: false, timestamp: ts, signature: h1 };
  const valid = crypto.timingSafeEqual(a, b);
  // optional: reject old timestamps (>5 min) to prevent replay
  const now = Math.floor(Date.now() / 1000);
  const tsNum = Number(ts);
  if (Number.isFinite(tsNum) && Math.abs(now - tsNum) > 300) {
    return { valid: false, timestamp: ts, signature: h1 };
  }
  return { valid, timestamp: ts, signature: h1 };
}

export const PRO_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || "";

export function isProPrice(priceId: string): boolean {
  return !!PRO_PRICE_ID && priceId === PRO_PRICE_ID;
}