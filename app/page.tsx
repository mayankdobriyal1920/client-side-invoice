import Link from "next/link";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "EasyBillKit — Free Invoice, Estimate & Receipt Maker",
  description: "Create professional invoices, estimates, and receipts in your browser. No account required. Export a clean PDF in seconds.",
  path: "/",
});

const features = [
  { title: "No account required", desc: "Start creating invoices instantly. Nothing to sign up for." },
  { title: "Clean PDF export", desc: "Professional, watermark-free PDFs ready to send." },
  { title: "Browser-local data", desc: "Your documents stay on this device. No server uploads." },
  { title: "Estimates & receipts", desc: "Quotes, invoices, and payment receipts in one place." },
  { title: "Client directory", desc: "Reuse customer details without retyping." },
  { title: "One-time Pro", desc: "Optional lifetime upgrade. No subscription." },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "EasyBillKit",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Create professional invoices, estimates, and receipts in your browser. No account required.",
        "url": "https://easybillkit.online",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }} />
      <div className="relative">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="glass-strong rounded-3xl p-8 md:p-14 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-green-900 mb-6">
            <Image src="/logo.png" alt="" width={16} height={16} className="rounded" />
            Free · No signup · Browser-local
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-gradient">Create professional invoices,</span>
            <br />
            estimates & receipts in seconds.
          </h1>
          <p className="mt-5 text-muted max-w-2xl mx-auto text-lg">
            A fast, clean, no-account invoice maker for freelancers and small service businesses.
            Export a clean PDF. Keep your data in your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/invoice-generator" className="btn-primary px-6 py-3 rounded-xl font-medium">
              Create invoice
            </Link>
            <Link href="/estimate-maker" className="btn-ghost px-6 py-3 rounded-xl font-medium">
              Create estimate
            </Link>
            <Link href="/receipt-maker" className="btn-ghost px-6 py-3 rounded-xl font-medium">
              Create receipt
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">
            Your documents are saved in this browser on this device. Export a backup regularly.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-green-950 text-center mb-8">
          Everything you need to bill with confidence
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white font-bold shadow-glass mb-4">
                ✓
              </div>
              <h3 className="font-semibold text-green-950">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-green-950 text-center mb-8">How it works</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="glass-card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-700 text-white font-bold flex items-center justify-center mx-auto mb-3">1</div>
            <h3 className="font-semibold text-green-950">Enter your details</h3>
            <p className="mt-2 text-sm text-muted">Add your business and client info, then line items with quantities and prices. Tax and discounts are fully under your control.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-700 text-white font-bold flex items-center justify-center mx-auto mb-3">2</div>
            <h3 className="font-semibold text-green-950">Preview live</h3>
            <p className="mt-2 text-sm text-muted">See a professional preview update as you type. Check totals, balance due, and payment terms before exporting.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-700 text-white font-bold flex items-center justify-center mx-auto mb-3">3</div>
            <h3 className="font-semibold text-green-950">Export PDF or print</h3>
            <p className="mt-2 text-sm text-muted">Download a clean, multi-page PDF with no watermark, or print directly. Everything happens in your browser — no upload, no account.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-green-950 text-center mb-8">Frequently asked questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-950">Is EasyBillKit really free?</h3>
            <p className="mt-2 text-sm text-muted">Yes. Creating invoices, estimates, and receipts and exporting PDFs is free. An optional one-time Pro upgrade adds premium templates and extra features.</p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-950">Where is my data stored?</h3>
            <p className="mt-2 text-sm text-muted">In your browser on this device using IndexedDB. Nothing is uploaded to a server. Export a backup regularly to avoid data loss.</p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-950">Do I need an account?</h3>
            <p className="mt-2 text-sm text-muted">No. You can start creating documents immediately without signing up.</p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-green-950">Can I use it on mobile?</h3>
            <p className="mt-2 text-sm text-muted">Yes. The editor is responsive and works on phones and tablets. PDF download works on supported mobile browsers.</p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="glass rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-950">Ready to send your first invoice?</h2>
            <p className="text-muted mt-2">No signup. No watermark. Just a clean PDF in seconds.</p>
          </div>
          <Link href="/invoice-generator" className="btn-primary px-6 py-3 rounded-xl font-medium whitespace-nowrap">
            Start now →
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}