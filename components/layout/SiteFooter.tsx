import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-12 py-8 text-sm text-muted">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between">
        <p>© {new Date().getFullYear()} SimpleInvoice Studio. Browser-local data.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <a href="mailto:hello@flipfee.online">hello@flipfee.online</a>
      </div>
    </footer>
  );
}