import Image from "next/image";
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
    <header className="sticky top-0 z-40 no-print">
      <div className="glass-strong mx-3 mt-3 rounded-2xl px-4 h-16 flex items-center justify-between md:mx-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-green-900">
          <Image src="/logo.png" alt="SimpleInvoice Studio logo" width={30} height={30} className="rounded-lg" />
          <span className="hidden sm:inline">SimpleInvoice Studio</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-xl text-muted hover:text-text hover:bg-white/60 transition"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/invoice-generator" className="btn-primary ml-2 px-4 py-2 rounded-xl text-sm font-medium">
            Create invoice
          </Link>
        </nav>
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer px-3 py-2 rounded-xl btn-ghost">Menu</summary>
          <div className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl p-2 shadow-glass-lg">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block px-3 py-2 rounded-xl text-sm text-muted hover:text-text hover:bg-white/60"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/invoice-generator" className="block mt-1 px-3 py-2 rounded-xl btn-primary text-sm text-center font-medium">
              Create invoice
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}