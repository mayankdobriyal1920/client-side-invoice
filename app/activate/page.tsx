"use client";

import { useEffect, useState } from "react";
import { getLicenseState } from "@/lib/storage/db";

export default function ActivatePage() {
  const [pro, setPro] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await getLicenseState();
      setPro(s.pro);
    })();
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Pro access</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <p>EasyBillKit Pro is purchased through Paddle checkout on the Pricing page. After a successful purchase, Pro activates automatically on this browser.</p>
        <p>This app is static and has no account system, so purchases cannot be verified across devices or browsers. If you purchased on another device, Pro will not automatically appear here.</p>
        <p>If you completed a purchase but Pro did not activate, try completing checkout again on this browser, or contact support.</p>
        {pro && <p className="text-green-700 font-medium">Pro is active on this browser.</p>}
      </div>
      <p className="text-xs text-muted">
        Contact: <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a>
      </p>
    </section>
  );
}