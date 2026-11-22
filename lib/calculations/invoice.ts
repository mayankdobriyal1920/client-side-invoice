import type { BaseDocument, LineItem, DocumentTotals, MoneyCents } from "@/types";
import { applyPercent, safeMultiplyCents } from "./money";

export interface LineComputation {
  lineSubtotalCents: MoneyCents;
  lineDiscountCents: MoneyCents;
  lineTotalCents: MoneyCents;
  taxableBaseCents: MoneyCents;
}

export function computeLine(item: LineItem): LineComputation {
  const qty = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
  const unit = Number.isFinite(item.unitPriceCents) ? item.unitPriceCents : 0;
  const lineSubtotalCents = safeMultiplyCents(unit, qty);

  let lineDiscountCents = 0;
  if (item.discountType === "percent") {
    lineDiscountCents = applyPercent(lineSubtotalCents, item.discountValue ?? 0);
  } else if (item.discountType === "fixed") {
    lineDiscountCents = Math.min(lineSubtotalCents, Math.max(0, Math.round(item.discountValue ?? 0)));
  }
  const lineTotalCents = Math.max(0, lineSubtotalCents - lineDiscountCents);
  const taxableBaseCents = item.taxable === false ? 0 : lineTotalCents;
  return { lineSubtotalCents, lineDiscountCents, lineTotalCents, taxableBaseCents };
}

export function computeTotals(doc: Pick<BaseDocument, "lineItems" | "documentDiscountType" | "documentDiscountValue" | "shippingCents" | "taxRatePercent" | "taxMode" | "taxManualCents" | "taxExempt" | "amountPaidCents" | "depositCents">): DocumentTotals {
  let subtotalCents = 0;
  let lineDiscountCents = 0;
  let taxableBaseCents = 0;
  for (const item of doc.lineItems) {
    const c = computeLine(item);
    subtotalCents += c.lineSubtotalCents;
    lineDiscountCents += c.lineDiscountCents;
    taxableBaseCents += c.taxableBaseCents;
  }
  const afterLineDiscountSubtotal = subtotalCents - lineDiscountCents;

  // document-level discount
  let documentDiscountCents = 0;
  if (doc.documentDiscountType === "percent") {
    documentDiscountCents = applyPercent(afterLineDiscountSubtotal, doc.documentDiscountValue ?? 0);
  } else if (doc.documentDiscountType === "fixed") {
    documentDiscountCents = Math.min(afterLineDiscountSubtotal, Math.max(0, Math.round(doc.documentDiscountValue ?? 0)));
  }

  const discountedSubtotal = Math.max(0, afterLineDiscountSubtotal - documentDiscountCents);
  const shippingCents = Math.max(0, Math.round(doc.shippingCents ?? 0));

  // tax
  let taxCents = 0;
  if (!doc.taxExempt) {
    if (doc.taxMode === "manual") {
      taxCents = Math.max(0, Math.round(doc.taxManualCents ?? 0));
    } else {
      const rate = Number.isFinite(doc.taxRatePercent ?? 0) ? (doc.taxRatePercent ?? 0) : 0;
      taxCents = applyPercent(taxableBaseCents > 0 ? Math.round((taxableBaseCents / (afterLineDiscountSubtotal || 1)) * discountedSubtotal) : 0, rate);
      // simpler: tax on taxable base proportionally; fallback to rate on discountedSubtotal if no taxable split
    }
  }
  // If taxableBaseCents tracking is all-or-nothing per line, recompute tax more simply when all items taxable
  // Recompute using discountedSubtotal if taxRate and no per-line taxable toggles detected
  const hasTaxableToggle = doc.lineItems.some((i) => i.taxable === false);
  if (!doc.taxExempt && doc.taxMode !== "manual" && !hasTaxableToggle) {
    const rate = Number.isFinite(doc.taxRatePercent ?? 0) ? (doc.taxRatePercent ?? 0) : 0;
    taxCents = applyPercent(discountedSubtotal, rate);
  }

  const totalCents = discountedSubtotal + shippingCents + taxCents;
  const paidCents = Math.max(0, Math.round((doc.amountPaidCents ?? 0) + (doc.depositCents ?? 0)));
  const balanceCents = Math.max(0, totalCents - paidCents);

  return {
    subtotalCents,
    lineDiscountCents,
    documentDiscountCents,
    shippingCents,
    taxCents,
    totalCents,
    paidCents,
    balanceCents,
  };
}

export function isOverdue(issueDate: string, dueDate: string | undefined, balanceCents: number, now = new Date()): boolean {
  if (balanceCents <= 0) return false;
  if (!dueDate) return false;
  const due = new Date(dueDate + "T00:00:00");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return due < today;
}