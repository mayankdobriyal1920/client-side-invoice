"use client";

import { useState } from "react";
import { formatCents } from "@/lib/calculations/money";

export default function Page() {
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [tax, setTax] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const subtotalCents = Math.round(hours * rate * 100);
  const expensesCents = Math.round(expenses * 100);
  const taxCents = Math.round((subtotalCents + expensesCents) * (tax / 100));
  const totalCents = subtotalCents + expensesCents + taxCents;

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Hourly Invoice Calculator</h1>
      <div className="glass-card p-5 space-y-3">
        <label className="text-sm block"><span className="text-muted">Hours worked</span><input type="number" step="0.25" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={hours} onChange={(e) => setHours(Number(e.target.value))} /></label>
        <label className="text-sm block"><span className="text-muted">Hourly rate (USD)</span><input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
        <label className="text-sm block"><span className="text-muted">Additional expenses (USD)</span><input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} /></label>
        <label className="text-sm block"><span className="text-muted">Tax rate %</span><input type="number" step="0.01" className="glass-input w-full px-3 py-2 mt-1 text-sm" value={tax} onChange={(e) => setTax(Number(e.target.value))} /></label>
      </div>
      <div className="glass-card p-5 space-y-2 text-sm">
        <div className="flex justify-between"><span>Labor subtotal</span><span>{formatCents(subtotalCents)}</span></div>
        <div className="flex justify-between"><span>Expenses</span><span>{formatCents(expensesCents)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{formatCents(taxCents)}</span></div>
        <div className="flex justify-between font-bold text-green-950 pt-2 border-t border-white/60"><span>Total</span><span>{formatCents(totalCents)}</span></div>
      </div>
    </section>
  );
}