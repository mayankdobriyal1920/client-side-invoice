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

export function required(value: string | undefined | null, label = "This field"): string | null {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `${label} is required.`;
  }
  return null;
}

export function validateEmail(value: string | undefined): string | null {
  if (!value || value.trim() === "") return null; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value.trim())) return "Enter a valid email address.";
  return null;
}

export function validateUrl(value: string | undefined): string | null {
  if (!value || value.trim() === "") return null;
  try {
    const u = new URL(value.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return "URL must start with http:// or https://";
    return null;
  } catch {
    return "Enter a valid URL.";
  }
}

export function validateDateOrder(issue: string, other: string | undefined): string | null {
  if (!other) return null;
  const a = new Date(issue + "T00:00:00");
  const b = new Date(other + "T00:00:00");
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
  if (b < a) return "Date cannot be earlier than issue date.";
  return null;
}

export function validateZip(value: string | undefined): string | null {
  if (!value || value.trim() === "") return null;
  const v = value.trim();
  if (v.length > 8) return "ZIP must be at most 8 characters.";
  if (!/^[A-Za-z0-9 -]{3,8}$/.test(v)) return "ZIP must be 3–8 characters.";
  return null;
}

export function validatePhone(value: string | undefined): string | null {
  if (!value || value.trim() === "") return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return "Enter a valid phone number.";
  return null;
}