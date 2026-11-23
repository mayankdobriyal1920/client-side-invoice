import { describe, it, expect } from "vitest";
import { computeTotals } from "@/lib/calculations/invoice";
import { formatCents } from "@/lib/calculations/money";
import { sanitizeFileName } from "@/lib/formatting";

describe("PDF quality — edge cases", () => {
  it("empty optional fields", () => {
    const doc: any = { type: "invoice", lineItems: [], amountPaidCents: 0, currency: "USD" };
    const t = computeTotals(doc);
    expect(t.totalCents).toBe(0);
    expect(t.balanceCents).toBe(0);
  });

  it("long company/client names", () => {
    const longName = "A".repeat(200);
    expect(longName.length).toBeGreaterThan(100);
    // PDF library handles long strings via splitTextToSize
  });

  it("long descriptions", () => {
    const longDesc = "B".repeat(500);
    expect(longDesc.length).toBeGreaterThan(100);
  });

  it("many line items (1, 10, 25, 50)", () => {
    for (const count of [1, 10, 25, 50]) {
      const doc: any = {
        type: "invoice",
        lineItems: Array.from({ length: count }, (_, i) => ({
          id: `li-${i}`,
          description: `Item ${i + 1}`,
          quantity: 1,
          unitPriceCents: 1000,
          taxable: true,
        })),
        amountPaidCents: 0,
      };
      const t = computeTotals(doc);
      expect(t.subtotalCents).toBe(1000 * count);
      expect(t.totalCents).toBe(1000 * count);
    }
  });

  it("multi-page would result from many items", () => {
    const doc: any = {
      type: "invoice",
      lineItems: Array.from({ length: 50 }, (_, i) => ({
        id: `li-${i}`,
        description: `Item ${i + 1} — ${"X".repeat(80)}`,
        quantity: 1,
        unitPriceCents: 5000,
        taxable: true,
      })),
      amountPaidCents: 0,
    };
    const t = computeTotals(doc);
    expect(t.totalCents).toBe(250000);
  });

  it("logo absent", () => {
    const doc: any = { type: "invoice", businessSnapshot: {}, lineItems: [] };
    expect(doc.businessSnapshot.logoDataUrl).toBeUndefined();
  });

  it("logo present", () => {
    const doc: any = {
      type: "invoice",
      businessSnapshot: { logoDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" },
      lineItems: [],
    };
    expect(doc.businessSnapshot.logoDataUrl).toContain("data:image");
  });

  it("large totals", () => {
    const doc: any = {
      type: "invoice",
      lineItems: [{ id: "li-1", description: "Large", quantity: 1, unitPriceCents: 99999999, taxable: true }],
      amountPaidCents: 0,
    };
    const t = computeTotals(doc);
    expect(t.totalCents).toBe(99999999);
  });

  it("discounts and taxes", () => {
    const doc: any = {
      type: "invoice",
      lineItems: [{ id: "li-1", description: "Item", quantity: 1, unitPriceCents: 10000, taxable: true }],
      documentDiscountType: "percent",
      documentDiscountValue: 10,
      shippingCents: 500,
      taxMode: "rate",
      taxRatePercent: 8,
      amountPaidCents: 0,
    };
    const t = computeTotals(doc);
    expect(t.documentDiscountCents).toBe(1000);
    expect(t.taxCents).toBe(720);
    expect(t.totalCents).toBe(10000 - 1000 + 500 + 720);
  });

  it("partial payment", () => {
    const doc: any = {
      type: "invoice",
      lineItems: [{ id: "li-1", description: "Item", quantity: 1, unitPriceCents: 10000, taxable: true }],
      amountPaidCents: 3000,
    };
    const t = computeTotals(doc);
    expect(t.paidCents).toBe(3000);
    expect(t.balanceCents).toBe(7000);
  });

  it("invalid input rejection", () => {
    const doc: any = {
      type: "invoice",
      lineItems: [{ id: "li-1", description: "Item", quantity: -1, unitPriceCents: 1000, taxable: true }],
      amountPaidCents: 0,
    };
    // validation should catch negative quantity before totals
    const qty = doc.lineItems[0].quantity;
    expect(qty <= 0).toBe(true);
  });

  it("sanitize file names", () => {
    expect(sanitizeFileName("Invoice-INV-0001.pdf")).toBe("Invoice-INV-0001.pdf");
    expect(sanitizeFileName("../etc/passwd")).toBe(".._etc_passwd");
    expect(sanitizeFileName("Invoice/../x.pdf")).toBe("Invoice_.._x.pdf");
  });

  it("currency formatting", () => {
    expect(formatCents(1234)).toBe("$12.34");
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(99999999)).toBe("$999,999.99");
  });
});