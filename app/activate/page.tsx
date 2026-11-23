"use client";

import { useState } from "react";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";
import { setLicenseState } from "@/lib/storage/db";

export default function ActivatePage() {
  const { isPro, refresh } = useLicenseStatus();
  const [licenseKey, setLicenseKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const activate = async () => {
    const key = licenseKey.trim();
    if (!key) {
      setMessage("Please enter your license key.");
      return;
    }
    if (!/^EBK-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) {
      setMessage("Invalid license key format. Expected: EBK-XXXX-XXXX-XXXX-XXXX");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key }),
      });
      const data = await res.json();
      if (res.ok && data.isPro) {
        await setLicenseState({ verified: true, pro: true, verifiedAt: new Date().toISOString() });
        setMessage("Pro activated on this browser.");
        await refresh();
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMessage(data.error || "Activation failed.");
      }
    } catch {
      setMessage("Activation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/license/logout", { method: "POST", credentials: "include" });
    await refresh();
    setMessage("Signed out.");
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <h2 className="text-xl font-bold text-green-950">Activate Pro</h2>
        <p className="mt-2">Enter your EasyBillKit Pro license key to unlock Pro features.</p>
        {isPro && <span className="text-green-700 font-medium">Pro is active on this browser.</span>}
        <input
          className="glass-input w-full px-3 py-2 text-sm font-mono uppercase"
          placeholder="EBK-XXXX-XXXX-XXXX-XXXX"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
          maxLength={23}
        />
        <button onClick={activate} disabled={loading} className="btn-primary px-5 py-2 rounded-xl font-medium disabled:opacity-60 w-full">
          {loading ? "Activating…" : "Activate"}
        </button>
        {message && <p className="text-sm">{message}</p>}
        {isPro && (
          <button onClick={logout} className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium">Sign out</button>
        )}
      </div>
    </section>
  );
}