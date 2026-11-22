"use client";

import { useEffect, useState } from "react";
import { fetchLicenseStatus, type LicenseStatus } from "@/lib/license";

export function useLicenseStatus() {
  const [status, setStatus] = useState<LicenseStatus>({ authenticated: false, isPro: false });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const s = await fetchLicenseStatus();
    setStatus(s);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ...status, loading, refresh };
}