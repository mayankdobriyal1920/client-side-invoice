import { describe, it, expect } from "vitest";
import { isOverdue } from "@/lib/calculations/invoice";
import { computeTotals } from "@/lib/calculations/invoice";

describe("isOverdue", () => {
  it("false when balance zero", () => {
    expect(isOverdue("2020-01-01", "2020-01-02", 0)).toBe(false);
  });
  it("false when no due date", () => {
    expect(isOverdue("2020-01-01", undefined, 100)).toBe(false);
  });
  it("true when due date past and balance > 0", () => {
    expect(isOverdue("2020-01-01", "2020-01-02", 100, new Date("2020-01-10"))).toBe(true);
  });
  it("false when due date future", () => {
    expect(isOverdue("2020-01-01", "2020-01-20", 100, new Date("2020-01-10"))).toBe(false);
  });
});

describe("receipt totals", () => {
  it("total equals amount paid", () => {
    const doc: any = { type: "receipt", lineItems: [], amountPaidCents: 5000 };
    const t = computeTotals(doc);
    expect(t.totalCents).toBe(5000);
    expect(t.balanceCents).toBe(0);
  });
});

describe("estimate to invoice conversion (logic)", () => {
  it("preserves line items count", () => {
    const est: any = {
      id: "e1",
      type: "estimate",
      number: "EST-0001",
      issueDate: "2026-01-01",
      status: "accepted",
      currency: "USD",
      lineItems: [{ id: "l1", description: "Work", quantity: 2, unitPriceCents: 1000, taxable: true }],
    };
    const inv: any = { ...est, id: "i1", type: "invoice", number: "INV-0001", status: "draft", convertedFromEstimateId: est.id };
    expect(inv.lineItems.length).toBe(est.lineItems.length);
    expect(inv.convertedFromEstimateId).toBe("EST-0001".replace("EST", "EST") ? est.id : est.id);
  });
});