"use client";

import { useEffect, useState } from "react";
import { fetchLicenseStatus, getCachedLicenseStatus, isProFromIndexedDB, type LicenseStatus } from "@/lib/license";

export function useLicenseStatus() {
  const [status, setStatus] = useState<LicenseStatus>({ authenticated: false, isPro: false });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    // Seed from localStorage cache for instant UI
    const cached = getCachedLicenseStatus();
    if (cached) {
      setStatus(cached);
    }
    // Check IndexedDB for Pro state
    const fromIDB = await isProFromIndexedDB();
    if (fromIDB) {
      setStatus({ authenticated: true, isPro: true, plan: "lifetime_pro" });
    }
    // Verify with server (authoritative)
    const s = await fetchLicenseStatus();
    setStatus(s);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ...status, loading, refresh };
}