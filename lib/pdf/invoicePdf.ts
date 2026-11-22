import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { BaseDocument } from "@/types";
import { computeTotals } from "@/lib/calculations/invoice";
import { formatCents } from "@/lib/calculations/money";
import { formatDate } from "@/lib/formatting";

export function generateDocumentPdf(doc: BaseDocument, dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" = "MM/DD/YYYY") {
  const pdf = new jsPDF({ unit: "pt", format: "letter" });
  const totals = doc.type === "receipt" && (!doc.lineItems || doc.lineItems.length === 0)
    ? { totalCents: doc.amountPaidCents || 0, balanceCents: 0, paidCents: doc.amountPaidCents || 0, subtotalCents: doc.amountPaidCents || 0, lineDiscountCents: 0, documentDiscountCents: 0, shippingCents: 0, taxCents: 0 }
    : computeTotals(doc);

  const biz = doc.businessSnapshot;
  const cli = doc.clientSnapshot;
  const margin = 40;
  let y = margin;

  // Header
  if (biz?.logoDataUrl) {
    try { pdf.addImage(biz.logoDataUrl, "PNG", margin, y, 60, 60); } catch {}
  }
  pdf.setFontSize(18);
  pdf.setTextColor(6, 59, 43);
  pdf.text(biz?.name || "Your Business", margin + (biz?.logoDataUrl ? 70 : 0), y + 18);
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  const bizLines = [biz?.address?.line1, [biz?.address?.city, biz?.address?.state, biz?.address?.zip].filter(Boolean).join(", "), biz?.email, biz?.phone, biz?.website].filter(Boolean);
  bizLines.forEach((l, i) => pdf.text(String(l), margin + (biz?.logoDataUrl ? 70 : 0), y + 32 + i * 11));
  if (biz?.taxId) pdf.text(`Tax ID: ${biz.taxId}`, margin + (biz?.logoDataUrl ? 70 : 0), y + 32 + bizLines.length * 11);

  // Document title
  pdf.setFontSize(22);
  pdf.setTextColor(10, 155, 104);
  pdf.text(doc.type.toUpperCase(), 595 - margin, y + 18, { align: "right" });
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`#${doc.number}`, 595 - margin, y + 34, { align: "right" });
  pdf.text(`Issued: ${formatDate(doc.issueDate, dateFormat)}`, 595 - margin, y + 48, { align: "right" });
  if (doc.dueDate) pdf.text(`Due: ${formatDate(doc.dueDate, dateFormat)}`, 595 - margin, y + 62, { align: "right" });
  if (doc.validUntil) pdf.text(`Valid until: ${formatDate(doc.validUntil, dateFormat)}`, 595 - margin, y + 62, { align: "right" });
  if (doc.paymentDate) pdf.text(`Payment date: ${formatDate(doc.paymentDate, dateFormat)}`, 595 - margin, y + 62, { align: "right" });

  y += 90;

  // Bill to
  pdf.setFontSize(11);
  pdf.setTextColor(6, 59, 43);
  pdf.text("Bill to", margin, y);
  y += 14;
  pdf.setFontSize(10);
  pdf.setTextColor(30, 30, 30);
  pdf.text(cli?.name || "Client", margin, y); y += 12;
  if (cli?.contactName) { pdf.text(cli.contactName, margin, y); y += 12; }
  if (cli?.address?.line1) { pdf.text(cli.address.line1, margin, y); y += 12; }
  const cityLine = [cli?.address?.city, cli?.address?.state, cli?.address?.zip].filter(Boolean).join(", ");
  if (cityLine) { pdf.text(cityLine, margin, y); y += 12; }
  if (cli?.email) { pdf.text(cli.email, margin, y); y += 12; }
  if (cli?.phone) { pdf.text(cli.phone, margin, y); y += 12; }

  y += 10;

  // Line items table
  if (doc.lineItems && doc.lineItems.length > 0) {
    autoTable(pdf, {
      startY: y,
      head: [["Description", "Qty", "Unit", "Unit price", "Total"]],
      body: doc.lineItems.map((li) => {
        const c = computeTotals({ ...doc, lineItems: [li] });
        return [li.description || "", String(li.quantity), li.unit || "", formatCents(li.unitPriceCents, doc.currency), formatCents(c.subtotalCents - c.lineDiscountCents, doc.currency)];
      }),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [10, 155, 104], textColor: 255 },
      margin: { left: margin, right: margin },
    });
    y = (pdf as any).lastAutoTable.finalY + 12;
  }

  // Totals
  pdf.setFontSize(10);
  const rightX = 595 - margin;
  const labelX = rightX - 120;
  const rows: [string, string][] = [];
  rows.push(["Subtotal", formatCents(totals.subtotalCents, doc.currency)]);
  if (totals.lineDiscountCents > 0) rows.push(["Line discounts", `-${formatCents(totals.lineDiscountCents, doc.currency)}`]);
  if (totals.documentDiscountCents > 0) rows.push(["Document discount", `-${formatCents(totals.documentDiscountCents, doc.currency)}`]);
  if (totals.shippingCents > 0) rows.push([doc.shippingLabel || "Shipping", formatCents(totals.shippingCents, doc.currency)]);
  if (totals.taxCents > 0) rows.push(["Tax", formatCents(totals.taxCents, doc.currency)]);
  rows.push(["Total", formatCents(totals.totalCents, doc.currency)]);
  if (totals.paidCents > 0) {
    rows.push(["Paid", formatCents(totals.paidCents, doc.currency)]);
    rows.push(["Balance due", formatCents(totals.balanceCents, doc.currency)]);
  }
  // receipt amount
  if (doc.type === "receipt") {
    rows.length = 0;
    rows.push(["Amount received", formatCents(doc.amountPaidCents || 0, doc.currency)]);
    if (doc.relatedInvoiceNumber) rows.push(["Related invoice", doc.relatedInvoiceNumber]);
    if (doc.paymentMethod) rows.push(["Payment method", doc.paymentMethod]);
    if (doc.transactionReference) rows.push(["Reference", doc.transactionReference]);
  }

  rows.forEach(([label, val], i) => {
    const bold = label === "Total" || label === "Balance due" || label === "Amount received";
    if (bold) pdf.setFont("helvetica", "bold");
    else pdf.setFont("helvetica", "normal");
    pdf.text(label, labelX, y);
    pdf.text(val, rightX, y, { align: "right" });
    y += 14;
  });

  // Notes/terms
  y += 8;
  if (doc.notes) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Notes", margin, y); y += 12;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const split = pdf.splitTextToSize(doc.notes, 595 - 2 * margin);
    pdf.text(split, margin, y); y += split.length * 11 + 6;
  }
  if (doc.terms) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Terms", margin, y); y += 12;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const split = pdf.splitTextToSize(doc.terms, 595 - 2 * margin);
    pdf.text(split, margin, y); y += split.length * 11 + 6;
  }
  if (doc.type === "estimate") {
    if (doc.scopeOfWork) {
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.text("Scope of work", margin, y); y += 12;
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
      const split = pdf.splitTextToSize(doc.scopeOfWork, 595 - 2 * margin);
      pdf.text(split, margin, y); y += split.length * 11 + 6;
    }
    if (doc.assumptions) {
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.text("Assumptions", margin, y); y += 12;
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
      const split = pdf.splitTextToSize(doc.assumptions, 595 - 2 * margin);
      pdf.text(split, margin, y); y += split.length * 11 + 6;
    }
    if (doc.exclusions) {
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.text("Exclusions", margin, y); y += 12;
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
      const split = pdf.splitTextToSize(doc.exclusions, 595 - 2 * margin);
      pdf.text(split, margin, y); y += split.length * 11 + 6;
    }
  }

  // Footer page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Page ${i} of ${pageCount} · ${doc.type.toUpperCase()} ${doc.number}`, 595 / 2, 780, { align: "center" });
  }

  const safeName = `${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}-${doc.number}.pdf`.replace(/[^a-zA-Z0-9._-]/g, "_");
  pdf.save(safeName);
}