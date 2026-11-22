"use client";

import { useEffect, useState } from "react";
import { fetchLicenseStatus, type LicenseStatus } from "@/lib/license";
import { getLicenseState } from "@/lib/storage/db";

export function useLicenseStatus() {
  const [status, setStatus] = useState<LicenseStatus>({ authenticated: false, isPro: false });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    // Seed from IndexedDB cache for instant UI
    try {
      const cached = await getLicenseState();
      if (cached.pro) {
        setStatus({ authenticated: true, isPro: true, plan: "lifetime_pro" });
      }
    } catch {}
    // Verify with server (authoritative)
    const s = await fetchLicenseStatus();
    setStatus(s);
    // Sync cache
    try {
      if (s.isPro) {
        const { setLicenseState } = await import("@/lib/storage/db");
        await setLicenseState({ verified: true, pro: true, verifiedAt: new Date().toISOString() });
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ...status, loading, refresh };
}