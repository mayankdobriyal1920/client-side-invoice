"use client";

import { useEffect } from "react";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdSlot({ slot, format = "auto", className }: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const { isPro } = useLicenseStatus();
  useEffect(() => {
    if (!client) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [client]);
  if (isPro) return null; // ad-free for Pro
  if (!client) return null;
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}