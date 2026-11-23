"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/types";
import { listClients, saveClient, deleteClient } from "@/lib/storage/db";
import { required, validateEmail, validatePhone, validateZip } from "@/lib/validation";
import { PageHeader } from "@/components/layout/PageHeader";

function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});

  const reload = async () => setClients(await listClients());
  useEffect(() => { reload(); }, []);

  const startNew = () => setEditing({ id: newId(), name: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const validateEditing = (): boolean => {
    if (!editing) return false;
    const e: Record<string,string> = {};
    const r = required(editing.name, "Client name");
    if (r) e.name = r;
    const em = validateEmail(editing.email);
    if (em) e.email = em;
    const ph = validatePhone(editing.phone);
    if (ph) e.phone = ph;
    const z = validateZip(editing.address?.zip);
    if (z) e.zip = z;
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const save = async () => {
    if (!editing) return;
    if (!validateEditing()) return;
    editing.updatedAt = new Date().toISOString();
    await saveClient(editing);
    setEditing(null);
    setErrors({});
    reload();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await deleteClient(id);
    reload();
  };

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader showBack={true} title="Clients" subtitle="Locally saved client directory." />
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={startNew} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">+ New client</button>
        </div>
        <input className="glass-input w-full px-3 py-2 text-sm mb-4" placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {editing && (
          <div className="glass-card p-5 mb-4 space-y-3">
            <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Client / company name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Contact name" value={editing.contactName || ""} onChange={(e) => setEditing({ ...editing, contactName: e.target.value })} />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
            <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Phone" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
            <input className="glass-input w-full px-3 py-2 text-sm" placeholder="Address line 1" value={editing.address?.line1 || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), line1: e.target.value } })} />
            <div className="grid grid-cols-3 gap-2">
              <input className="glass-input px-3 py-2 text-sm" placeholder="City" value={editing.address?.city || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), city: e.target.value } })} />
              <input className="glass-input px-3 py-2 text-sm" placeholder="State" value={editing.address?.state || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), state: e.target.value } })} />
              <input className="glass-input px-3 py-2 text-sm" placeholder="ZIP" value={editing.address?.zip || ""} onChange={(e) => setEditing({ ...editing, address: { ...(editing.address || {}), zip: e.target.value } })} />
              {errors.zip && <p className="text-xs text-danger mt-1 col-span-3">{errors.zip}</p>}
            </div>
            <textarea className="glass-input w-full px-3 py-2 text-sm" placeholder="Notes" value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={save} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">Save</button>
              <button onClick={() => setEditing(null)} className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium">Cancel</button>
            </div>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="glass-card p-4">
              <p className="font-semibold text-green-950">{c.name}</p>
              <p className="text-xs text-muted">{c.contactName}</p>
              <p className="text-xs text-muted">{c.email} {c.phone}</p>
              <div className="mt-3 flex gap-2 text-xs">
                <button onClick={() => setEditing(c)} className="text-green-700 hover:underline">Edit</button>
                <button onClick={() => remove(c.id)} className="text-danger hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-muted text-sm">No clients yet.</p>}
        </div>
      </section>
    </>
  );
}