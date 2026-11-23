import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import VitalsReporter from "@/components/layout/VitalsReporter";
import OfflineBanner from "@/components/layout/OfflineBanner";

export const metadata: Metadata = {
  title: "EasyBillKit — Free Invoice, Estimate & Receipt Maker",
  description:
    "Create professional invoices, estimates, and receipts in your browser. No account required. Export a clean PDF in seconds.",
  metadataBase: new URL("https://easybillkit.online"),
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "48x48 96x96 32x32 16x16", type: "image/x-icon" },
    { rel: "icon", url: "/logo.png", sizes: "256x256", type: "image/png" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WN6KFCCJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Animated gradient backdrop */}
        <div className="fixed inset-0 -z-10 bg-hero-gradient" aria-hidden />
        <div className="fixed inset-0 -z-10 grid-bg opacity-40" aria-hidden />
        <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-green-400/30 blur-3xl animate-blob-float -z-10" aria-hidden />
        <div className="fixed top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-green-700/20 blur-3xl animate-blob-float -z-10" style={{ animationDelay: "6s" }} aria-hidden />
        <div className="fixed bottom-0 left-1/3 w-[32rem] h-[32rem] rounded-full bg-green-100/60 blur-3xl animate-blob-float -z-10" style={{ animationDelay: "12s" }} aria-hidden />
        <VitalsReporter />
        <OfflineBanner />
        <SiteHeader />
        <main id="main-content" className="flex-1 relative">{children}</main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WN6KFCCJ');`}
        </Script>
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());`}
        </Script>
      </body>
    </html>
  );
}