"use client";

import { useEffect } from "react";

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdSlot({ slot, format = "auto", className }: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  useEffect(() => {
    if (!client) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [client]);
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