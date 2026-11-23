"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/invoice-generator", label: "Invoice" },
  { href: "/estimate-maker", label: "Estimate" },
  { href: "/receipt-maker", label: "Receipt" },
  { href: "/documents", label: "Documents" },
  { href: "/clients", label: "Clients" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        {/* Hamburger menu button (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-green-950 hover:bg-white/60 focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Menu</span>
          <div className="w-6 h-0.5 bg-green-950 mb-1.5 rounded"></div>
          <div className="w-6 h-0.5 bg-green-950 mb-1.5 rounded"></div>
          <div className="w-6 h-0.5 bg-green-950 rounded"></div>
        </button>
      </div>
      {/* Mobile menu panel (solid background) */}
      {menuOpen && (
        <div className="md:hidden glass-strong mx-3 mt-2 rounded-2xl px-4 py-4 shadow-glass-lg border border-white/70">
          <nav className="flex flex-col gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-muted hover:text-text hover:bg-white/60 transition"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/invoice-generator"
              onClick={() => setMenuOpen(false)}
              className="block mt-2 px-3 py-2.5 rounded-xl btn-primary text-sm text-center font-medium"
            >
              Create invoice
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}