import Link from "next/link";

export default function HomePage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-green-950">
        Create professional invoices, estimates, and receipts in your browser.
      </h1>
      <p className="mt-4 text-muted max-w-2xl">
        No account required. Export a clean PDF in seconds. Your documents stay in this browser on this device.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/invoice-generator" className="px-5 py-3 rounded-xl bg-green-700 text-white">Create invoice</Link>
        <Link href="/estimate-maker" className="px-5 py-3 rounded-xl border border-border">Create estimate</Link>
        <Link href="/receipt-maker" className="px-5 py-3 rounded-xl border border-border">Create receipt</Link>
      </div>
    </section>
  );
}