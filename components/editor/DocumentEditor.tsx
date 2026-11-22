"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BaseDocument, BusinessProfile, Client, CatalogItem, LineItem, DocumentType } from "@/types";
import {
  listBusinessProfiles,
  listClients,
  listCatalogItems,
  saveDocument,
  getNumberingPrefs,
  setNumberingPrefs,
  getUserPrefs,
} from "@/lib/storage/db";
import { computeTotals } from "@/lib/calculations/invoice";
import { formatCents } from "@/lib/calculations/money";
import { generateDocumentPdf } from "@/lib/pdf/invoicePdf";
import { required, validateEmail, validateDateOrder, validateDiscountPercent } from "@/lib/validation";
import { formatDate, todayISO, addDaysISO } from "@/lib/formatting";
function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ensure util exists
const _ = newId;

interface Props {
  type: DocumentType;
  existingId?: string;
}

function emptyDoc(type: DocumentType, number: string): BaseDocument {
  const now = new Date().toISOString();
  return {
    id: newId(),
    type,
    number,
    title: "",
    issueDate: todayISO(),
    status: "draft",
    currency: "USD",
    lineItems: [],
    documentDiscountType: "none",
    documentDiscountValue: 0,
    shippingLabel: "Shipping",
    shippingCents: 0,
    taxMode: "rate",
    taxRatePercent: 0,
    taxExempt: false,
    amountPaidCents: 0,
    depositCents: 0,
    notes: "",
    terms: "",
    validUntil: type === "estimate" ? addDaysISO(todayISO(), 30) : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export default function DocumentEditor({ type }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<BaseDocument | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [prefs, setPrefs] = useState<{ dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" }>({ dateFormat: "MM/DD/YYYY" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      const [ps, cs, cat, np, up] = await Promise.all([
        listBusinessProfiles(),
        listClients(),
        listCatalogItems(),
        getNumberingPrefs(),
        getUserPrefs(),
      ]);
      setProfiles(ps);
      setClients(cs);
      setCatalog(cat);
      setPrefs({ dateFormat: up.dateFormat });
      // default number
      let number = "";
      if (type === "invoice") number = `${np.invoicePrefix}-${String(np.nextInvoice).padStart(4, "0")}`;
      else if (type === "estimate") number = `${np.estimatePrefix}-${String(np.nextEstimate).padStart(4, "0")}`;
      else number = `${np.receiptPrefix}-${String(np.nextReceipt).padStart(4, "0")}`;
      setDoc(emptyDoc(type, number));
    })();
  }, [type]);

  const totals = useMemo(() => (doc ? computeTotals(doc) : null), [doc]);

  // unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!doc) return <div className="text-muted">Loading editor…</div>;

  const update = (patch: Partial<BaseDocument>) => { setDirty(true); setDoc((d) => (d ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d)); };

  const addLine = () => {
    const li: LineItem = { id: newId(), description: "", quantity: 1, unit: "item", unitPriceCents: 0, discountType: "none", discountValue: 0, taxable: true };
    update({ lineItems: [...doc.lineItems, li] });
  };

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    update({ lineItems: doc.lineItems.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  };

  const removeLine = (id: string) => {
    update({ lineItems: doc.lineItems.filter((l) => l.id !== id) });
  };

  const moveLine = (id: string, dir: -1 | 1) => {
    const idx = doc.lineItems.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= doc.lineItems.length) return;
    const next = [...doc.lineItems];
    const [item] = next.splice(idx, 1);
    next.splice(newIdx, 0, item);
    update({ lineItems: next });
  };

  const duplicateLine = (id: string) => {
    const src = doc.lineItems.find((l) => l.id === id);
    if (!src) return;
    const copy: LineItem = { ...src, id: newId() };
    const idx = doc.lineItems.findIndex((l) => l.id === id);
    const next = [...doc.lineItems];
    next.splice(idx + 1, 0, copy);
    update({ lineItems: next });
  };

  const pickCatalog = (itemId: string) => {
    const it = catalog.find((c) => c.id === itemId);
    if (!it) return;
    const li: LineItem = { id: newId(), description: it.description ? `${it.name} — ${it.description}` : it.name, quantity: 1, unit: it.unit || "item", unitPriceCents: it.unitPriceCents, discountType: "none", discountValue: 0, taxable: it.taxable ?? true };
    update({ lineItems: [...doc.lineItems, li] });
  };

  const selectClient = (id: string) => {
    const c = clients.find((x) => x.id === id);
    update({ clientId: id || undefined, clientSnapshot: c });
  };

  const selectBusiness = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    update({ businessId: id || undefined, businessSnapshot: p });
  };

  const validateDoc = (): boolean => {
    const e: Record<string,string> = {};
    const numErr = required(doc.number, "Document number");
    if (numErr) e.number = numErr;
    const dateErr = required(doc.issueDate, "Issue date");
    if (dateErr) e.issueDate = dateErr;
    if (doc.dueDate) {
      const d = validateDateOrder(doc.issueDate, doc.dueDate);
      if (d) e.dueDate = d;
    }
    if (doc.validUntil) {
      const v = validateDateOrder(doc.issueDate, doc.validUntil);
      if (v) e.validUntil = v;
    }
    if (doc.taxMode !== "manual") {
      const t = validateDiscountPercent(doc.taxRatePercent ?? 0);
      if (t) e.taxRate = t;
    }
    if (doc.documentDiscountType === "percent") {
      const dd = validateDiscountPercent(doc.documentDiscountValue ?? 0);
      if (dd) e.docDiscount = dd;
    }
    if ((doc.shippingCents ?? 0) < 0) e.shipping = "Shipping cannot be negative.";
    if ((doc.amountPaidCents ?? 0) < 0) e.paid = "Paid amount cannot be negative.";
    doc.lineItems.forEach((li, idx) => {
      if (!li.description.trim()) e[`line_${li.id}_desc`] = `Line ${idx+1}: description required.`;
      const qe = (li.quantity <= 0 || !Number.isFinite(li.quantity)) ? "Quantity must be greater than zero." : null;
      if (qe) e[`line_${li.id}_qty`] = `Line ${idx+1}: ${qe}`;
      if (li.unitPriceCents < 0) e[`line_${li.id}_price`] = `Line ${idx+1}: price cannot be negative.`;
      if (li.discountType === "percent" && li.discountValue !== undefined) {
        const de = validateDiscountPercent(li.discountValue);
        if (de) e[`line_${li.id}_disc`] = `Line ${idx+1}: ${de}`;
      }
      if (li.discountType === "fixed" && (li.discountValue ?? 0) > li.unitPriceCents * li.quantity) {
        e[`line_${li.id}_disc`] = `Line ${idx+1}: discount exceeds line amount.`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = async () => {
    if (!validateDoc()) {
      setMessage("Please fix validation errors.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await saveDocument(doc);
      setDirty(false);
      setMessage("Saved.");
    } catch (e) {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const fmt = (c: number) => formatCents(c, doc.currency);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-5 no-print">
        <div className="glass-card p-5">
          <h2 className="font-semibold text-green-950 mb-3">Business</h2>
          <select className="glass-input w-full px-3 py-2 text-sm" value={doc.businessId || ""} onChange={(e) => selectBusiness(e.target.value)}>
            <option value="">Select business profile…</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <p className="text-xs text-muted mt-2">
            Manage profiles in <a href="/settings" className="text-green-700 underline">Settings</a>.
          </p>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold text-green-950 mb-3">Client</h2>
          <select className="glass-input w-full px-3 py-2 text-sm" value={doc.clientId || ""} onChange={(e) => selectClient(e.target.value)}>
            <option value="">Select client…</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold text-green-950 mb-3">Document details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-muted">Number</span>
              <input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.number} onChange={(e) => update({ number: e.target.value })} />
              {errors.number && <p className="text-xs text-danger mt-1">{errors.number}</p>}
            </label>
            <label className="text-sm">
              <span className="text-muted">Title</span>
              <input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.title || ""} onChange={(e) => update({ title: e.target.value })} />
            </label>
            <label className="text-sm">
              <span className="text-muted">Issue date</span>
              <input type="date" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.issueDate} onChange={(e) => update({ issueDate: e.target.value })} />
              {errors.issueDate && <p className="text-xs text-danger mt-1">{errors.issueDate}</p>}
            </label>
            {type === "invoice" && (
              <label className="text-sm">
                <span className="text-muted">Due date</span>
                <input type="date" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.dueDate || ""} onChange={(e) => update({ dueDate: e.target.value })} />
                {errors.dueDate && <p className="text-xs text-danger mt-1">{errors.dueDate}</p>}
              </label>
            )}
            {type === "estimate" && (
              <label className="text-sm">
                <span className="text-muted">Valid until</span>
                <input type="date" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.validUntil || ""} onChange={(e) => update({ validUntil: e.target.value })} />
                {errors.validUntil && <p className="text-xs text-danger mt-1">{errors.validUntil}</p>}
              </label>
            )}
            {type === "receipt" && (
              <label className="text-sm">
                <span className="text-muted">Payment date</span>
                <input type="date" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.paymentDate || doc.issueDate} onChange={(e) => update({ paymentDate: e.target.value })} />
              </label>
            )}
            <label className="text-sm">
              <span className="text-muted">Status</span>
              <select className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.status} onChange={(e) => update({ status: e.target.value as any })}>
                {["draft","sent","partially_paid","paid","overdue","accepted","declined","converted"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            {type === "receipt" && (
              <label className="text-sm">
                <span className="text-muted">Payment method</span>
                <select className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.paymentMethod || "other"} onChange={(e) => update({ paymentMethod: e.target.value as any })}>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="other">Other</option>
                </select>
              </label>
            )}
          </div>
          {type === "receipt" && (
            <label className="text-sm block mt-3">
              <span className="text-muted">Related invoice number</span>
              <input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.relatedInvoiceNumber || ""} onChange={(e) => update({ relatedInvoiceNumber: e.target.value })} />
            </label>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-green-950">Line items</h2>
            <div className="flex gap-2">
              {catalog.length > 0 && (
                <select className="glass-input px-2 py-1 text-xs" onChange={(e) => { if (e.target.value) pickCatalog(e.target.value); e.target.value = ""; }}>
                  <option value="">+ from catalog</option>
                  {catalog.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
              <button type="button" onClick={addLine} className="btn-primary px-3 py-1 rounded-lg text-xs font-medium">+ Add row</button>
            </div>
          </div>
          <div className="space-y-3">
            {doc.lineItems.length === 0 && <p className="text-sm text-muted">No line items yet.</p>}
            {doc.lineItems.map((li) => (
              <div key={li.id} className="glass p-3 rounded-xl space-y-2">
                <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Description" value={li.description} onChange={(e) => updateLine(li.id, { description: e.target.value })} />
                {errors[`line_${li.id}_desc`] && <p className="text-xs text-danger mt-1">{errors[`line_${li.id}_desc`]}</p>}
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" step="0.01" className="glass-input px-2 py-1 text-sm" placeholder="Qty" value={li.quantity} onChange={(e) => updateLine(li.id, { quantity: Number(e.target.value) })} />
                  {errors[`line_${li.id}_qty`] && <p className="text-xs text-danger mt-1 col-span-3">{errors[`line_${li.id}_qty`]}</p>}
                  <input className="glass-input px-2 py-1 text-sm" placeholder="Unit" value={li.unit || ""} onChange={(e) => updateLine(li.id, { unit: e.target.value })} />
                  <input type="number" step="0.01" className="glass-input px-2 py-1 text-sm" placeholder="Unit price" value={(li.unitPriceCents / 100).toFixed(2)} onChange={(e) => updateLine(li.id, { unitPriceCents: Math.round(Number(e.target.value) * 100) })} />
                  {errors[`line_${li.id}_price`] && <p className="text-xs text-danger mt-1 col-span-3">{errors[`line_${li.id}_price`]}</p>}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1 text-muted">
                    <input type="checkbox" checked={li.taxable !== false} onChange={(e) => updateLine(li.id, { taxable: e.target.checked })} /> Taxable
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveLine(li.id, -1)} className="text-muted hover:underline">↑</button>
                    <button type="button" onClick={() => moveLine(li.id, 1)} className="text-muted hover:underline">↓</button>
                    <button type="button" onClick={() => duplicateLine(li.id)} className="text-green-700 hover:underline">Duplicate</button>
                    <button type="button" onClick={() => removeLine(li.id)} className="text-danger hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold text-green-950 mb-3">Totals & adjustments</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-muted">Doc discount type</span>
              <select className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.documentDiscountType || "none"} onChange={(e) => update({ documentDiscountType: e.target.value as any })}>
                <option value="none">None</option>
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted">Doc discount value</span>
              <input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.documentDiscountValue || 0} onChange={(e) => update({ documentDiscountValue: Number(e.target.value) })} />
              {errors.docDiscount && <p className="text-xs text-danger mt-1">{errors.docDiscount}</p>}
            </label>
            <label className="text-sm">
              <span className="text-muted">Shipping label</span>
              <input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.shippingLabel || ""} onChange={(e) => update({ shippingLabel: e.target.value })} />
            </label>
            <label className="text-sm">
              <span className="text-muted">Shipping amount</span>
              <input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={((doc.shippingCents || 0) / 100).toFixed(2)} onChange={(e) => update({ shippingCents: Math.round(Number(e.target.value) * 100) })} />
              {errors.shipping && <p className="text-xs text-danger mt-1">{errors.shipping}</p>}
            </label>
            <label className="text-sm">
              <span className="text-muted">Tax mode</span>
              <select className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.taxMode || "rate"} onChange={(e) => update({ taxMode: e.target.value as any })}>
                <option value="rate">Rate %</option>
                <option value="manual">Manual amount</option>
              </select>
            </label>
            {doc.taxMode === "manual" ? (
              <label className="text-sm">
                <span className="text-muted">Tax amount</span>
                <input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={((doc.taxManualCents || 0) / 100).toFixed(2)} onChange={(e) => update({ taxManualCents: Math.round(Number(e.target.value) * 100) })} />
              </label>
            ) : (
              <label className="text-sm">
                <span className="text-muted">Tax rate %</span>
                <input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={doc.taxRatePercent || 0} onChange={(e) => update({ taxRatePercent: Number(e.target.value) })} />
                {errors.taxRate && <p className="text-xs text-danger mt-1">{errors.taxRate}</p>}
              </label>
            )}
            <label className="text-sm flex items-center gap-2 mt-6">
              <input type="checkbox" checked={doc.taxExempt || false} onChange={(e) => update({ taxExempt: e.target.checked })} /> Tax exempt
            </label>
            <label className="text-sm">
              <span className="text-muted">Amount paid</span>
              <input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={((doc.amountPaidCents || 0) / 100).toFixed(2)} onChange={(e) => update({ amountPaidCents: Math.round(Number(e.target.value) * 100) })} />
              {errors.paid && <p className="text-xs text-danger mt-1">{errors.paid}</p>}
            </label>
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold text-green-950 mb-3">Notes & terms</h2>
          <textarea className="glass-input w-full px-3 py-2 text-sm" rows={3} placeholder="Notes" value={doc.notes || ""} onChange={(e) => update({ notes: e.target.value })} />
          <textarea className="glass-input w-full px-3 py-2 text-sm mt-2" rows={3} placeholder="Terms" value={doc.terms || ""} onChange={(e) => update({ terms: e.target.value })} />
          {type === "estimate" && (
            <>
              <textarea className="glass-input w-full px-3 py-2 text-sm mt-2" rows={3} placeholder="Scope of work" value={doc.scopeOfWork || ""} onChange={(e) => update({ scopeOfWork: e.target.value })} />
              <textarea className="glass-input w-full px-3 py-2 text-sm mt-2" rows={2} placeholder="Assumptions" value={doc.assumptions || ""} onChange={(e) => update({ assumptions: e.target.value })} />
              <textarea className="glass-input w-full px-3 py-2 text-sm mt-2" rows={2} placeholder="Exclusions" value={doc.exclusions || ""} onChange={(e) => update({ exclusions: e.target.value })} />
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2 rounded-xl font-medium disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={() => generateDocumentPdf(doc, prefs.dateFormat)} className="btn-ghost px-5 py-2 rounded-xl font-medium">Download PDF</button>
          <button onClick={() => window.print()} className="btn-ghost px-5 py-2 rounded-xl font-medium">Print</button>
          {message && <span className="text-sm text-muted self-center">{message}</span>}
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card p-6 sticky top-24 self-start" aria-live="polite" aria-atomic="true">
        <h2 className="font-semibold text-green-950 mb-4">Preview</h2>
        <DocumentPreview doc={doc} totals={totals!} dateFormat={prefs.dateFormat} />
      </div>
    </div>
  );
}

function DocumentPreview({ doc, totals, dateFormat }: { doc: BaseDocument; totals: any; dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" }) {
  const biz = doc.businessSnapshot;
  const cli = doc.clientSnapshot;
  return (
    <div className="text-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          {biz?.logoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={biz.logoDataUrl} alt="logo" className="h-10 mb-1" />
          )}
          <p className="font-bold text-green-950">{biz?.name || "Your Business"}</p>
          <p className="text-xs text-muted">{biz?.address?.line1}</p>
          <p className="text-xs text-muted">{[biz?.address?.city, biz?.address?.state, biz?.address?.zip].filter(Boolean).join(", ")}</p>
          <p className="text-xs text-muted">{biz?.email} {biz?.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-900">{doc.type.toUpperCase()}</p>
          <p className="text-xs text-muted">#{doc.number}</p>
          <p className="text-xs text-muted">Issued {formatDate(doc.issueDate, dateFormat)}</p>
          {doc.dueDate && <p className="text-xs text-muted">Due {formatDate(doc.dueDate, dateFormat)}</p>}
          {doc.validUntil && <p className="text-xs text-muted">Valid until {formatDate(doc.validUntil, dateFormat)}</p>}
        </div>
      </div>
      <div className="border-t border-white/60 pt-3">
        <p className="font-medium text-green-950">Bill to</p>
        <p className="text-xs">{cli?.name || "Client"}</p>
        <p className="text-xs text-muted">{cli?.address?.line1}</p>
        <p className="text-xs text-muted">{[cli?.address?.city, cli?.address?.state, cli?.address?.zip].filter(Boolean).join(", ")}</p>
        <p className="text-xs text-muted">{cli?.email} {cli?.phone}</p>
      </div>
      <table className="w-full text-xs mt-3">
        <thead>
          <tr className="border-b border-white/60 text-muted">
            <th className="text-left py-1">Description</th>
            <th className="text-right py-1">Qty</th>
            <th className="text-right py-1">Price</th>
            <th className="text-right py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {doc.lineItems.map((li) => {
            const c = computeTotals({ ...doc, lineItems: [li] });
            return (
              <tr key={li.id} className="border-b border-white/40">
                <td className="py-1">{li.description || "—"}</td>
                <td className="text-right py-1">{li.quantity}</td>
                <td className="text-right py-1">{formatCents(li.unitPriceCents, doc.currency)}</td>
                <td className="text-right py-1">{formatCents(c.subtotalCents - c.lineDiscountCents, doc.currency)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="border-t border-white/60 pt-3 space-y-1 text-xs">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCents(totals.subtotalCents, doc.currency)}</span></div>
        {totals.lineDiscountCents > 0 && <div className="flex justify-between"><span>Line discounts</span><span>-{formatCents(totals.lineDiscountCents, doc.currency)}</span></div>}
        {totals.documentDiscountCents > 0 && <div className="flex justify-between"><span>Document discount</span><span>-{formatCents(totals.documentDiscountCents, doc.currency)}</span></div>}
        {totals.shippingCents > 0 && <div className="flex justify-between"><span>{doc.shippingLabel || "Shipping"}</span><span>{formatCents(totals.shippingCents, doc.currency)}</span></div>}
        {totals.taxCents > 0 && <div className="flex justify-between"><span>Tax</span><span>{formatCents(totals.taxCents, doc.currency)}</span></div>}
        <div className="flex justify-between font-bold text-green-950 text-sm pt-1 border-t border-white/60">
          <span>Total</span><span>{formatCents(totals.totalCents, doc.currency)}</span>
        </div>
        {totals.paidCents > 0 && (
          <>
            <div className="flex justify-between"><span>Paid</span><span>{formatCents(totals.paidCents, doc.currency)}</span></div>
            <div className="flex justify-between font-bold"><span>Balance due</span><span>{formatCents(totals.balanceCents, doc.currency)}</span></div>
          </>
        )}
      </div>
      {doc.notes && <p className="text-xs text-muted pt-2">{doc.notes}</p>}
      {doc.terms && <p className="text-xs text-muted">{doc.terms}</p>}
    </div>
  );
}