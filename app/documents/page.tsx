"use client";

import { useEffect, useState } from "react";
import type { BaseDocument } from "@/types";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";
import { documentsToCsv, downloadCsv } from "@/lib/formatting/csv";
import { listDocuments, deleteDocument, saveDocument, getNumberingPrefs, setNumberingPrefs } from "@/lib/storage/db";
import { formatCents } from "@/lib/calculations/money";
import { computeTotals } from "@/lib/calculations/invoice";
import { formatDate } from "@/lib/formatting";
import { getUserPrefs } from "@/lib/storage/db";

function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function docTotal(d: BaseDocument) {
  if (d.type === "receipt" && (!d.lineItems || d.lineItems.length === 0)) {
    const paid = d.amountPaidCents || 0;
    return { totalCents: paid, balanceCents: 0, paidCents: paid, subtotalCents: paid, lineDiscountCents: 0, documentDiscountCents: 0, shippingCents: 0, taxCents: 0 };
  }
  return computeTotals(d);
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<BaseDocument[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const { isPro } = useLicenseStatus();

  const reload = async () => {
    setDocs(await listDocuments());
    const p = await getUserPrefs();
    setDateFormat(p.dateFormat);
  };
  useEffect(() => { reload(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(id);
    reload();
  };

  const convertEstimate = async (est: BaseDocument) => {
    const np = await getNumberingPrefs();
    const num = `${np.invoicePrefix}-${String(np.nextInvoice).padStart(4, "0")}`;
    const inv: BaseDocument = {
      ...est,
      id: newId(),
      type: "invoice",
      number: num,
      status: "draft",
      convertedFromEstimateId: est.id,
      validUntil: undefined,
      scopeOfWork: est.scopeOfWork,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveDocument(inv);
    await setNumberingPrefs({ ...np, nextInvoice: np.nextInvoice + 1 });
    // mark estimate converted
    await saveDocument({ ...est, status: "converted", updatedAt: new Date().toISOString() });
    reload();
    alert(`Converted to invoice ${num}. Open in editor? Find it in the list.`);
  };

  const recordPayment = async (doc: BaseDocument) => {
    const amt = prompt("Payment amount (USD):");
    if (!amt) return;
    const cents = Math.round(Number(amt) * 100);
    if (!Number.isFinite(cents) || cents <= 0) return;
    const newPaid = (doc.amountPaidCents || 0) + cents;
    await saveDocument({ ...doc, amountPaidCents: newPaid, status: newPaid >= docTotal(doc).totalCents ? "paid" : "partially_paid", updatedAt: new Date().toISOString() });
    // create receipt
    const np = await getNumberingPrefs();
    const rnum = `${np.receiptPrefix}-${String(np.nextReceipt).padStart(4, "0")}`;
    const receipt: BaseDocument = {
      id: newId(),
      type: "receipt",
      number: rnum,
      title: `Payment for ${doc.number}`,
      issueDate: new Date().toISOString().slice(0, 10),
      status: "paid",
      businessSnapshot: doc.businessSnapshot,
      clientSnapshot: doc.clientSnapshot,
      clientId: doc.clientId,
      businessId: doc.businessId,
      lineItems: [],
      currency: doc.currency,
      amountPaidCents: cents,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: "other",
      relatedInvoiceNumber: doc.number,
      notes: `Payment recorded against ${doc.type} ${doc.number}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveDocument(receipt);
    await setNumberingPrefs({ ...np, nextReceipt: np.nextReceipt + 1 });
    reload();
  };

  let filtered = docs.filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (q && !(d.number.toLowerCase().includes(q) || (d.clientSnapshot?.name || "").toLowerCase().includes(q) || (d.title || "").toLowerCase().includes(q))) return false;
    return true;
  });
  filtered = [...filtered].sort((a, b) => {
    if (sort === "date-desc") return b.issueDate.localeCompare(a.issueDate);
    if (sort === "date-asc") return a.issueDate.localeCompare(b.issueDate);
    if (sort === "number") return a.number.localeCompare(b.number);
    if (sort === "client") return (a.clientSnapshot?.name || "").localeCompare(b.clientSnapshot?.name || "");
    return 0;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="glass-card p-4 mb-4 flex flex-wrap gap-3">
        <input className="glass-input px-3 py-2 text-sm flex-1 min-w-[160px]" placeholder="Search number, client, title…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="glass-input px-3 py-2 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="invoice">Invoice</option>
          <option value="estimate">Estimate</option>
          <option value="receipt">Receipt</option>
        </select>
        <select className="glass-input px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {["draft","sent","partially_paid","paid","overdue","accepted","declined","converted"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="glass-input px-3 py-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date-desc">Newest</option>
          <option value="date-asc">Oldest</option>
          <option value="number">Number</option>
          <option value="client">Client</option>
        </select>
        {isPro && (
          <button onClick={() => downloadCsv("easybillkit-documents.csv", documentsToCsv(filtered))} className="btn-primary px-3 py-2 rounded-xl text-sm font-medium">
            Export CSV (Pro)
          </button>
        )}
      </div>
      <div className="space-y-3">
        {filtered.map((d) => (
          <div key={d.id} className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-green-950">{d.type.toUpperCase()} {d.number}</p>
              <p className="text-xs text-muted">{d.clientSnapshot?.name || "—"} · {formatDate(d.issueDate, dateFormat as any)}</p>
              <p className="text-xs text-muted">Status: {d.status}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCents(docTotal(d).totalCents, d.currency)}</p>
              <p className="text-xs text-muted">Balance {formatCents(docTotal(d).balanceCents, d.currency)}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {d.type === "estimate" && d.status !== "converted" && (
                <button onClick={() => convertEstimate(d)} className="btn-ghost px-3 py-1 rounded-lg">Convert to invoice</button>
              )}
              {d.type === "invoice" && docTotal(d).balanceCents > 0 && (
                <button onClick={() => recordPayment(d)} className="btn-ghost px-3 py-1 rounded-lg">Record payment</button>
              )}
              <button onClick={() => remove(d.id)} className="text-danger hover:underline px-2 py-1">Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted text-sm">No documents found.</p>}
      </div>
    </section>
  );
}