"use client";

import { useEffect, useState } from "react";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";
import { required, validateEmail, validatePhone, validateZip, validateUrl } from "@/lib/validation";
import type { BusinessProfile, NumberingPrefs, UserPrefs } from "@/types";
import {
  listBusinessProfiles,
  saveBusinessProfile,
  deleteBusinessProfile,
  getNumberingPrefs,
  setNumberingPrefs,
  getUserPrefs,
  setUserPrefs,
  exportBackup,
  importBackup,
  isStorageAvailable,
} from "@/lib/storage/db";
import { PageHeader } from "@/components/layout/PageHeader";

function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default function SettingsPage() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [editing, setEditing] = useState<BusinessProfile | null>(null);
  const [np, setNp] = useState<NumberingPrefs | null>(null);
  const [up, setUp] = useState<UserPrefs | null>(null);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});
  const { isPro } = useLicenseStatus();

  const reload = async () => {
    setProfiles(await listBusinessProfiles());
    setNp(await getNumberingPrefs());
    setUp(await getUserPrefs());
  };
  useEffect(() => { reload(); }, []);

  const validateProfile = (): boolean => {
    if (!editing) return false;
    const e: Record<string,string> = {};
    const r = required(editing.name, "Business name");
    if (r) e.name = r;
    const em = validateEmail(editing.email);
    if (em) e.email = em;
    const ph = validatePhone(editing.phone);
    if (ph) e.phone = ph;
    const z = validateZip(editing.address?.zip);
    if (z) e.zip = z;
    const w = validateUrl(editing.website);
    if (w) e.website = w;
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const saveProfile = async () => {
    if (!editing) return;
    if (!validateProfile()) return;
    await saveBusinessProfile(editing);
    setEditing(null);
    setErrors({});
    reload();
    setMsg("Business profile saved.");
  };
  const removeProfile = async (id: string) => {
    if (!confirm("Delete this business profile?")) return;
    await deleteBusinessProfile(id);
    reload();
  };
  const newProfile = () => setEditing({ id: newId(), name: "", isDefault: profiles.length === 0 });

  const handleLogo = (file: File) => {
    if (!editing) return;
    if (file.size > 2 * 1024 * 1024) { setMsg("Logo must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setEditing({ ...editing, logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const saveNumbering = async () => {
    if (!np) return;
    if (!np.invoicePrefix.trim() || !np.estimatePrefix.trim() || !np.receiptPrefix.trim()) {
      setMsg("Prefixes cannot be empty.");
      return;
    }
    if (np.nextInvoice < 1 || np.nextEstimate < 1 || np.nextReceipt < 1) {
      setMsg("Next numbers must be at least 1.");
      return;
    }
    await setNumberingPrefs(np);
    setMsg("Numbering preferences saved.");
  };
  const savePrefs = async () => {
    if (!up) return;
    await setUserPrefs(up);
    setMsg("Preferences saved.");
  };

  const handleExport = async () => {
    const data = await exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-studio-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    let data: any;
    try { data = JSON.parse(text); } catch { setMsg("Invalid JSON file."); return; }
    const counts = `Clients: ${data?.clients?.length ?? 0}, Documents: ${data?.documents?.length ?? 0}`;
    if (!confirm(`Import backup? This replaces existing local data.\n${counts}`)) return;
    try {
      await importBackup(data);
      reload();
      setMsg("Backup imported.");
    } catch (e: any) {
      setMsg(e?.message || "Import failed.");
    }
  };

  return (
    <>
      <PageHeader showBack={true} title="Settings" subtitle="Business profile, preferences, and backup." />
      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {!isStorageAvailable() && <p className="text-danger text-sm">Storage is unavailable in this browser.</p>}
        {msg && <p className="text-sm text-muted">{msg}</p>}

        {/* Business profiles */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-green-950">Business profiles</h2>
            <button onClick={newProfile} className="btn-primary px-3 py-1 rounded-lg text-xs font-medium">+ New</button>
          </div>
          {editing && (
            <div className="space-y-3 mb-4">
              <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Business / trading name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
              <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Contact person" value={editing.contactPerson || ""} onChange={(e) => setEditing({ ...editing, contactPerson: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="glass-input px-3 py-2 text-sm" placeholder="Email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                <input className="glass-input px-3 py-2 text-sm" placeholder="Phone" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
                {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
              </div>
              <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Address line 1" value={editing.address?.line1 || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), line1: e.target.value } })} />
              <div className="grid grid-cols-3 gap-2">
                <input className="glass-input px-3 py-2 text-sm" placeholder="City" value={editing.address?.city || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), city: e.target.value } })} />
                <input className="glass-input px-3 py-2 text-sm" placeholder="State" value={editing.address?.state || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), state: e.target.value } })} />
                <input className="glass-input px-3 py-2 text-sm" placeholder="ZIP" value={editing.address?.zip || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), zip: e.target.value } })} />
                {errors.zip && <p className="text-xs text-danger mt-1">{errors.zip}</p>}
              </div>
              <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Website" value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} />
              {errors.website && <p className="text-xs text-danger mt-1">{errors.website}</p>}
              <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Tax ID / EIN (optional)" value={editing.taxId || ""} onChange={(e) => setEditing({ ...editing, taxId: e.target.value })} />
              <div>
                <label className="text-xs text-muted">Logo (PNG/JPEG/WebP, max 2MB)</label>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogo(f); }} className="text-sm mt-1" />
                {editing.logoDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editing.logoDataUrl} alt="logo" className="h-12 mt-2" />
                )}
              </div>
              {isPro && (
                <label className="text-sm block">
                  <span className="text-muted">Brand accent color (Pro)</span>
                  <input type="color" className="glass-input w-16 h-10 mt-1 cursor-pointer" value={editing.accentColor || "#0a9b68"} onChange={(e) => setEditing({ ...editing, accentColor: e.target.value })} />
                </label>
              )}
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.isDefault || false} onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })} /> Default profile</label>
              <div className="flex gap-2">
                <button onClick={saveProfile} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">Save</button>
                <button onClick={() => setEditing(null)} className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium">Cancel</button>
              </div>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {profiles.map((p) => (
              <div key={p.id} className="glass p-3 rounded-xl">
                <p className="font-semibold text-green-950">{p.name} {p.isDefault && <span className="text-xs text-muted">(default)</span>}</p>
                <p className="text-xs text-muted">{p.email} {p.phone}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <button onClick={() => setEditing(p)} className="text-green-700 hover:underline">Edit</button>
                  <button onClick={() => removeProfile(p.id)} className="text-danger hover:underline">Delete</button>
                </div>
              </div>
            ))}
            {profiles.length === 0 && <p className="text-sm text-muted">No business profiles yet.</p>}
          </div>
        </div>

        {/* Numbering */}
        {np && (
          <div className="glass-card p-5">
            <h2 className="font-semibold text-green-950 mb-3">Document numbering</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-sm"><span className="text-muted">Invoice prefix</span><input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={np.invoicePrefix} onChange={(e) => setNp({ ...np, invoicePrefix: e.target.value })} /></label>
              <label className="text-sm"><span className="text-muted">Next invoice #</span><input type="number" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={np.nextInvoice} onChange={(e) => setNp({ ...np, nextInvoice: Number(e.target.value) })} /></label>
              <label className="text-sm"><span className="text-muted">Estimate prefix</span><input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={np.estimatePrefix} onChange={(e) => setNp({ ...np, estimatePrefix: e.target.value })} /></label>
              <label className="text-sm"><span className="text-muted">Next estimate #</span><input type="number" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={np.nextEstimate} onChange={(e) => setNp({ ...np, nextEstimate: Number(e.target.value) })} /></label>
              <label className="text-sm"><span className="text-muted">Receipt prefix</span><input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={np.receiptPrefix} onChange={(e) => setNp({ ...np, receiptPrefix: e.target.value })} /></label>
              <label className="text-sm"><span className="text-muted">Next receipt #</span><input type="number" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={np.nextReceipt} onChange={(e) => setNp({ ...np, nextReceipt: Number(e.target.value) })} /></label>
            </div>
            <button onClick={saveNumbering} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium mt-3">Save numbering</button>
            <p className="text-xs text-muted mt-2">Numbering is per browser/device and does not synchronize.</p>
          </div>
        )}

        {/* Preferences */}
        {up && (
          <div className="glass-card p-5">
            <h2 className="font-semibold text-green-950 mb-3">Preferences</h2>
            <label className="text-sm block mb-2">
              <span className="text-muted">Date format</span>
              <select className="glass-input w-full px-3 py-2 mt-1 text-sm" value={up.dateFormat} onChange={(e) => setUp({ ...up, dateFormat: e.target.value as any })}>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </label>
            <button onClick={savePrefs} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">Save preferences</button>
          </div>
        )}

        {/* Backup */}
        <div className="glass-card p-5">
          <h2 className="font-semibold text-green-950 mb-3">Backup & restore</h2>
          <p className="text-xs text-muted mb-3">Your documents are saved in this browser on this device. Export a backup regularly. They do not automatically sync to other devices.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleExport} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">Export backup (JSON)</button>
            <label className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium cursor-pointer">
              Import backup
              <input type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }} />
            </label>
          </div>
        </div>
      </section>
    </>
  );
}