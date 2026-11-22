import type { BaseDocument } from "@/types";
import { computeTotals } from "@/lib/calculations/invoice";
import { formatCents } from "@/lib/calculations/money";

function escapeCsv(value: string | number | undefined | null): string {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function documentsToCsv(docs: BaseDocument[]): string {
  const header = ["Type", "Number", "Date", "Client", "Status", "Total", "Balance", "Currency"];
  const rows = docs.map((d) => {
    const t = d.type === "receipt" && (!d.lineItems || d.lineItems.length === 0)
      ? { totalCents: d.amountPaidCents || 0, balanceCents: 0 }
      : computeTotals(d);
    return [
      d.type,
      d.number,
      d.issueDate,
      d.clientSnapshot?.name || "",
      d.status,
      formatCents(t.totalCents, d.currency),
      formatCents(t.balanceCents, d.currency),
      d.currency,
    ].map(escapeCsv).join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}