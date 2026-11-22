export function parseNumber(input: string | number): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  const cleaned = String(input).replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function isPositive(n: number): boolean {
  return Number.isFinite(n) && n > 0;
}

export function isNonNegative(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

export function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function validateQuantity(q: number): string | null {
  if (!Number.isFinite(q)) return "Quantity must be a number.";
  if (q <= 0) return "Quantity must be greater than zero.";
  return null;
}

export function validateUnitPrice(p: number): string | null {
  if (!Number.isFinite(p)) return "Price must be a number.";
  if (p < 0) return "Price cannot be negative.";
  return null;
}

export function validateDiscountPercent(p: number): string | null {
  if (!Number.isFinite(p)) return "Discount must be a number.";
  if (p < 0 || p > 100) return "Discount percent must be 0–100.";
  return null;
}