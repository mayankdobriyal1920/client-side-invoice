// Money as integer minor units (cents). Avoids floating-point arithmetic.

export function toCents(amount: number | string): number {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatCents(cents: number, currency = "USD"): string {
  const value = cents / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function clampInt(n: number, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function safeMultiplyCents(unitPriceCents: number, quantity: number): number {
  // quantity may be decimal; use rounding at the end
  return Math.round(unitPriceCents * quantity);
}

export function applyPercent(amountCents: number, percent: number): number {
  if (!Number.isFinite(percent)) return 0;
  return Math.round((amountCents * percent) / 100);
}

export function percentOf(amountCents: number, percent: number): number {
  return applyPercent(amountCents, percent);
}