"use client";

import { useEffect, useState } from "react";
import { fetchLicenseStatus, getCachedLicenseStatus, type LicenseStatus } from "@/lib/license";

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