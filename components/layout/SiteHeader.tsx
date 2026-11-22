import Link from "next/link";

const nav = [
  { href: "/invoice-generator", label: "Invoice" },
  { href: "/estimate-maker", label: "Estimate" },
  { href: "/receipt-maker", label: "Receipt" },
  { href: "/documents", label: "Documents" },
  { href: "/clients", label: "Clients" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface-strong sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-green-700">SimpleInvoice Studio</Link>
        <nav className="hidden md:flex gap-4 text-sm">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted hover:text-text">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}