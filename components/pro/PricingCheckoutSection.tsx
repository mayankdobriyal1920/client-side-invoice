"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";
import { setLicenseState } from "@/lib/storage/db";
import PaddleCheckout from "./PaddleCheckout";

export default function PricingCheckoutSection() {
  const { isPro, loading } = useLicenseStatus();

  useEffect(() => {
    if (isPro) {
      setLicenseState({ verified: true, pro: true, verifiedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [isPro]);

  if (loading) {
    return <div className="btn-ghost px-5 py-3 rounded-xl font-medium text-center opacity-60">Checking access…</div>;
  }

  if (isPro) {
    return (
      <div className="space-y-2">
        <div className="glass-card p-4 text-center">
          <p className="text-green-700 font-semibold">✓ Pro purchased</p>
          <p className="text-xs text-muted mt-1">Pro is active on this browser.</p>
        </div>
        <Link href="/activate" className="btn-ghost px-5 py-3 rounded-xl font-medium text-center block">
          Manage access
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PaddleCheckout />
      <Link href="/activate" className="btn-ghost px-5 py-3 rounded-xl font-medium text-center block">
        Already purchased? Restore access
      </Link>
    </div>
  );
}