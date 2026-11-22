"use client";

import { useState } from "react";
import { getLicenseState, setLicenseState } from "@/lib/storage/db";

export default function ActivatePage() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [pro, setPro] = useState(false);

  const verify = async () => {
    if (!key.trim()) { setResult("Please enter a license key."); return; }
    setLoading(true);
    setResult("");
    const productId = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID || "";
    const verifyUrl = process.env.NEXT_PUBLIC_GUMROAD_LICENSE_VERIFY_URL || "https://api.gumroad.com/v2/licenses/verify";
    try {
      const res = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ product_id: productId, license_key: key.trim() }).toString(),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === true || data.success === "true")) {
        await setLicenseState({ verified: true, pro: true, verifiedAt: new Date().toISOString(), keyMasked: key.trim().slice(0, 4) + "…" });
        setPro(true);
        setResult("License activated. Pro features unlocked on this browser.");
      } else {
        await setLicenseState({ verified: false, pro: false });
        setResult(data.message || "Invalid or unrecognized license key.");
      }
    } catch {
      // retain previous entitlement on network error
      const prev = await getLicenseState();
      if (prev.pro) {
        const grace = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        await setLicenseState({ ...prev, graceUntil: grace });
        setResult("Network error. Previous Pro entitlement retained for a 7-day grace period.");
      } else {
        setResult("Network error. Could not verify license. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Activate Pro</h1>
      <p className="text-sm text-muted">
        Enter the license key you received after purchase. Activation may require internet access.
        This app is static; license checks are best-effort client-side controls, not strong DRM.
      </p>
      <div className="glass-card p-5 space-y-3">
        <input className="glass-input w-full px-3 py-2 text-sm" placeholder="License key" value={key} onChange={(e) => setKey(e.target.value)} />
        <button onClick={verify} disabled={loading} className="btn-primary px-5 py-2 rounded-xl font-medium disabled:opacity-60">
          {loading ? "Verifying…" : "Activate"}
        </button>
        {result && <p className="text-sm text-muted">{result}</p>}
        {pro && <p className="text-sm text-green-700 font-medium">Pro is active on this browser.</p>}
      </div>
      <p className="text-xs text-muted">
        Never share your license key publicly. We do not store the full key after verification.
      </p>
    </section>
  );
}