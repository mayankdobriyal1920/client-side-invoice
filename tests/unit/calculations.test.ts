import { describe, it, expect } from "vitest";
import { computeTotals, computeLine } from "@/lib/calculations/invoice";
import { toCents, formatCents } from "@/lib/calculations/money";

describe("money", () => {
  it("toCents", () => {
    expect(toCents(12.34)).toBe(1234);
    expect(toCents("1.5")).toBe(150);
    expect(toCents(NaN)).toBe(0);
  });
  it("formatCents", () => {
    expect(formatCents(1234)).toBe("$12.34");
  });
});

describe("invoice calculations", () => {
  it("line subtotal", () => {
    const c = computeLine({ id: "1", description: "x", quantity: 2, unitPriceCents: 1000, taxable: true });
    expect(c.lineSubtotalCents).toBe(2000);
    expect(c.lineTotalCents).toBe(2000);
  });
  it("quantity decimals", () => {
    const c = computeLine({ id: "1", description: "x", quantity: 1.5, unitPriceCents: 1000, taxable: true });
    expect(c.lineSubtotalCents).toBe(1500);
  });
  it("per-line percent discount", () => {
    const c = computeLine({ id: "1", description: "x", quantity: 1, unitPriceCents: 1000, discountType: "percent", discountValue: 10, taxable: true });
    expect(c.lineDiscountCents).toBe(100);
    expect(c.lineTotalCents).toBe(900);
  });
  it("document discount + tax + balance", () => {
    const doc: any = {
      lineItems: [{ id: "1", description: "x", quantity: 1, unitPriceCents: 1000, taxable: true }],
      documentDiscountType: "fixed",
      documentDiscountValue: 100,
      shippingCents: 500,
      taxMode: "rate",
      taxRatePercent: 10,
      amountPaidCents: 200,
    };
    const t = computeTotals(doc);
    expect(t.subtotalCents).toBe(1000);
    expect(t.documentDiscountCents).toBe(100);
    expect(t.shippingCents).toBe(500);
    expect(t.totalCents).toBe(1000 - 100 + 500 + Math.round((1000-100)*0.1));
    expect(t.balanceCents).toBe(t.totalCents - 200);
  });
  it("manual tax", () => {
    const doc: any = {
      lineItems: [{ id: "1", description: "x", quantity: 1, unitPriceCents: 1000, taxable: true }],
      taxMode: "manual",
      taxManualCents: 75,
    };
    const t = computeTotals(doc);
    expect(t.taxCents).toBe(75);
  });
  it("tax exempt", () => {
    const doc: any = {
      lineItems: [{ id: "1", description: "x", quantity: 1, unitPriceCents: 1000, taxable: true }],
      taxMode: "rate",
      taxRatePercent: 10,
      taxExempt: true,
    };
    const t = computeTotals(doc);
    expect(t.taxCents).toBe(0);
  });
  it("partial payment balance", () => {
    const doc: any = {
      lineItems: [{ id: "1", description: "x", quantity: 1, unitPriceCents: 1000, taxable: true }],
      amountPaidCents: 300,
    };
    const t = computeTotals(doc);
    expect(t.paidCents).toBe(300);
    expect(t.balanceCents).toBe(t.totalCents - 300);
  });
});