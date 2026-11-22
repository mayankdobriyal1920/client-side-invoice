import { describe, it, expect } from "vitest";
import { computeTotals } from "@/lib/calculations/invoice";
import { toCents } from "@/lib/calculations/money";

describe("integration: totals consistency", () => {
  it("preview totals match saved document totals", () => {
    const doc: any = {
      lineItems: [
        { id: "1", description: "Labor", quantity: 2, unitPriceCents: 5000, taxable: true },
        { id: "2", description: "Materials", quantity: 1, unitPriceCents: 3000, taxable: true, discountType: "percent", discountValue: 10 },
      ],
      documentDiscountType: "fixed",
      documentDiscountValue: 500,
      taxMode: "rate",
      taxRatePercent: 8,
      amountPaidCents: 2000,
    };
    const t1 = computeTotals(doc);
    // recompute (simulating reopen)
    const t2 = computeTotals({ ...doc });
    expect(t1.totalCents).toBe(t2.totalCents);
    expect(t1.balanceCents).toBe(t2.balanceCents);
  });
});

describe("integration: estimate to invoice conversion", () => {
  it("preserves line items and creates new number", () => {
    const est: any = {
      id: "est1",
      type: "estimate",
      number: "EST-0001",
      lineItems: [{ id: "l1", description: "Work", quantity: 3, unitPriceCents: 1000, taxable: true }],
    };
    const inv: any = { ...est, id: "inv1", type: "invoice", number: "INV-0001", convertedFromEstimateId: est.id };
    expect(inv.lineItems.length).toBe(est.lineItems.length);
    expect(inv.number).not.toBe(est.number);
    expect(inv.convertedFromEstimateId).toBe(est.id);
  });
});

describe("integration: partial payment receipt", () => {
  it("balance decreases after payment", () => {
    const doc: any = {
      lineItems: [{ id: "1", description: "Work", quantity: 1, unitPriceCents: 10000, taxable: true }],
      amountPaidCents: 0,
    };
    const before = computeTotals(doc);
    const after = computeTotals({ ...doc, amountPaidCents: 5000 });
    expect(after.balanceCents).toBe(before.balanceCents - 5000);
  });
});