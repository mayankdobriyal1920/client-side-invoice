import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Terms", description: "Terms of use for EasyBillKit.", path: "/terms" });

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Terms of Use</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <p>SimpleInvoice Studio provides document-generation functionality only. It is not accounting, tax, or legal advice. You are responsible for the accuracy of information, tax rates, and document compliance.</p>
        <p>PDFs are generated from user-entered data. We do not verify payments or financial data.</p>
        <p>Data is stored locally in your browser and may be lost if browser data is cleared or the device is lost. There is no automatic cloud backup or sync.</p>
        <p>Payments are processed by Paddle.com, which acts as the Merchant of Record. Refunds are subject to Paddle&apos;s terms and the EasyBillKit Refund Policy.</p>
        <p>Pro license activation is best-effort client-side licensing; frontend restrictions are not strong DRM. A technically capable user may bypass them; a backend would be required for stronger enforcement.</p>
        <p>Contact: <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a></p>
      </div>
    </section>
  );
}