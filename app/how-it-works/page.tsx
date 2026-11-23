import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "How It Works", description: "How EasyBillKit calculates and stores data.", path: "/how-it-works" });

export default function HowItWorksPage() {
  return (
    <>
      <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="glass-card p-5 space-y-3 text-sm text-muted">
          <p><strong className="text-text">Calculations:</strong> All line totals, discounts, taxes, and balances are computed in your browser using decimal-safe (cents) arithmetic. Tax is user-configured; we do not fetch or infer any tax rate.</p>
          <p><strong className="text-text">Storage:</strong> Business profiles, clients, catalog items, and documents are stored in IndexedDB in this browser on this device. We do not upload them.</p>
          <p><strong className="text-text">PDF export:</strong> PDFs are generated locally in your browser from your entered data. No document data is sent to a server.</p>
          <p><strong className="text-text">Numbering:</strong> Invoice/estimate/receipt numbers are sequential per browser/device and are not globally unique.</p>
          <p><strong className="text-text">Statuses:</strong> Overdue status is based on your local records and due dates, not a payment processor.</p>
        </div>
      </section>
    </>
  );
}