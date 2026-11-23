import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import PricingCheckoutSection from "@/components/pro/PricingCheckoutSection";

export const metadata = pageMetadata({ title: "Pricing", description: "Free vs Pro for EasyBillKit.", path: "/pricing" });

export default function PricingPage() {
  return (
    <>
      <PageHeader showBack={true} title="Pricing" subtitle="Free vs Pro for EasyBillKit." />
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-green-950">Free</h2>
            <p className="text-3xl font-bold mt-2">$0</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>✓ Create invoices, estimates, and receipts</li>
              <li>✓ Standard professional templates</li>
              <li>✓ PDF export without watermark</li>
              <li>✓ Local storage for documents</li>
              <li>✓ Basic business profile and client directory</li>
              <li>✓ Manual tax and discount fields</li>
              <li>✓ Print</li>
            </ul>
          </div>
          <div className="glass-card p-6 border-2 border-green-600/40">
            <h2 className="text-xl font-bold text-green-950">Pro (Lifetime)</h2>
            <p className="text-3xl font-bold mt-2">$29 <span className="text-sm font-normal text-muted">one-time</span></p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>✓ Everything in Free</li>
              <li>✓ Premium document templates</li>
              <li>✓ Additional brand colors and layout controls</li>
              <li>✓ Multiple business profiles</li>
              <li>✓ Advanced document themes</li>
              <li>✓ CSV export</li>
              <li>✓ Ad-free experience</li>
            </ul>
            <div className="mt-6">
              <PricingCheckoutSection />
            </div>
            <p className="text-xs text-muted mt-3">
              One-time payment, not a subscription. Checkout is processed by Paddle (Merchant of Record). Pro activates on this browser after a successful purchase via email verification.
              Local data does not sync across devices.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}