import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 px-3 md:px-6 pb-6 no-print">
      <div className="glass rounded-2xl px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <p className="font-semibold text-green-900">SimpleInvoice Studio</p>
            <p className="text-sm text-muted mt-1 max-w-md">
              Create professional invoices, estimates, and receipts in your browser. No account required.
              Your documents stay in this browser on this device.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-text">Product</span>
              <Link href="/invoice-generator" className="text-muted hover:text-text">Invoice</Link>
              <Link href="/estimate-maker" className="text-muted hover:text-text">Estimate</Link>
              <Link href="/receipt-maker" className="text-muted hover:text-text">Receipt</Link>
              <Link href="/pricing" className="text-muted hover:text-text">Pricing</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-text">Company</span>
              <Link href="/about" className="text-muted hover:text-text">About</Link>
              <Link href="/contact" className="text-muted hover:text-text">Contact</Link>
              <Link href="/privacy-policy" className="text-muted hover:text-text">Privacy</Link>
              <Link href="/terms" className="text-muted hover:text-text">Terms</Link>
              <Link href="/refund-policy" className="text-muted hover:text-text">Refunds</Link>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/60 flex flex-col md:flex-row gap-2 justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} SimpleInvoice Studio. Browser-local data.</p>
          <a href="mailto:hello@easybillkit.online" className="hover:text-text">hello@easybillkit.online</a>
        </div>
      </div>
    </footer>
  );
}