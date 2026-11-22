import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "SimpleInvoice Studio — Free Invoice, Estimate & Receipt Maker",
  description:
    "Create professional invoices, estimates, and receipts in your browser. No account required. Export a clean PDF in seconds.",
  metadataBase: new URL("https://flipfee.online"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
        {/* Animated gradient backdrop */}
        <div className="fixed inset-0 -z-10 bg-hero-gradient" aria-hidden />
        <div className="fixed inset-0 -z-10 grid-bg opacity-40" aria-hidden />
        <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-green-400/30 blur-3xl animate-blob-float -z-10" aria-hidden />
        <div className="fixed top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-green-700/20 blur-3xl animate-blob-float -z-10" style={{ animationDelay: "6s" }} aria-hidden />
        <div className="fixed bottom-0 left-1/3 w-[32rem] h-[32rem] rounded-full bg-green-100/60 blur-3xl animate-blob-float -z-10" style={{ animationDelay: "12s" }} aria-hidden />
        <SiteHeader />
        <main className="flex-1 relative">{children}</main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}