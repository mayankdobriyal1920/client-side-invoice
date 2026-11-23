"use client";

import Link from "next/link";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";
import PaddleCheckout from "./PaddleCheckout";

export default function PricingCheckoutSection() {
  const { isPro, loading } = useLicenseStatus();

  if (loading) {
    return <div className="btn-ghost px-5 py-3 rounded-xl font-medium text-center opacity-60">Checking access…</div>;
  }

  if (isPro) {
    return (
      <div className="space-y-2">
        <div className="glass-card p-4 text-center">
          <p className="text-green-700 font-semibold">✓ Pro Active</p>
          <p className="text-xs text-muted mt-1">Pro features unlocked on this browser.</p>
        </div>
        <Link href="/settings" className="btn-ghost px-5 py-3 rounded-xl font-medium text-center block">
          Manage License
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PaddleCheckout />
      <Link href="/activate" className="text-green-700 font-medium underline hover:text-green-800 text-center block">
        Already purchased? Activate License
      </Link>
    </div>
  );
}