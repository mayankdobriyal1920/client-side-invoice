"use client";

import { useEffect, useState } from "react";
import { getNumberingPrefs } from "@/lib/storage/db";

export default function Page() {
  const [prefix, setPrefix] = useState("INV");
  const [next, setNext] = useState(1);
  const [count, setCount] = useState(5);
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const np = await getNumberingPrefs();
      setPrefix(np.invoicePrefix);
      setNext(np.nextInvoice);
    })();
  }, []);

  const generate = () => {
    const nums: string[] = [];
    for (let i = 0; i < count; i++) {
      nums.push(`${prefix}-${String(next + i).padStart(4, "0")}`);
    }
    setResult(nums);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Invoice Number Generator</h1>
      <div className="glass-card p-5 space-y-3">
        <label className="text-sm block"><span className="text-muted">Prefix</span><input className="glass-input w-full px-3 py-2 mt-1 text-sm" value={prefix} onChange={(e) => setPrefix(e.target.value)} /></label>
        <label className="text-sm block"><span className="text-muted">Starting number</span><input type="number" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={next} onChange={(e) => setNext(Number(e.target.value))} /></label>
        <label className="text-sm block"><span className="text-muted">How many</span><input type="number" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={count} onChange={(e) => setCount(Number(e.target.value))} /></label>
        <button onClick={generate} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">Generate</button>
        {result.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm font-mono">
            {result.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
      </div>
      <p className="text-xs text-muted">Numbers are generated locally and are not guaranteed unique across devices.</p>
    </section>
  );
}