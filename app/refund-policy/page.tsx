import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "Refund Policy", description: "Refund policy for EasyBillKit Pro.", path: "/refund-policy" });

export default function RefundPolicyPage() {
  return (
    <>
      <PageHeader showBack={true} title="Refund Policy" subtitle="Refund policy for EasyBillKit Pro." />
      <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold text-green-950">Refund Policy</h1>
        <p className="text-xs text-muted">Last Updated: November 22, 2026</p>
        <div className="glass-card p-5 space-y-4 text-sm text-muted">
          <p>At EasyBillKit, we want you to be satisfied with your purchase. This Refund Policy explains the terms for requesting a refund when purchasing EasyBillKit Pro.</p>

          <h2 className="font-semibold text-green-950">1. 30-Day Money-Back Guarantee</h2>
          <p>We offer a 30-day money-back guarantee on EasyBillKit Pro lifetime purchases. If you are not satisfied with your purchase, you may request a refund within 30 days of the original transaction date. Refund requests will be reviewed and processed through our payment provider, Paddle.</p>

          <h2 className="font-semibold text-green-950">2. Eligible Refund Requests</h2>
          <p>You may request a refund for reasons including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>EasyBillKit Pro does not work as described.</li>
            <li>A technical issue prevents you from accessing essential Pro features and cannot be resolved.</li>
            <li>You purchased EasyBillKit Pro by mistake.</li>
            <li>You are not satisfied with the product within the 30-day guarantee period.</li>
          </ul>

          <h2 className="font-semibold text-green-950">3. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Visit https://paddle.net.</li>
            <li>Locate your EasyBillKit purchase.</li>
            <li>Submit a refund request using Paddle&apos;s buyer support options.</li>
          </ol>
          <p>You can also contact our support team at <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a> for assistance.</p>

          <h2 className="font-semibold text-green-950">4. Refund Processing</h2>
          <p>Approved refunds are returned to the original payment method where possible. Processing times depend on the payment provider and financial institution. Once a refund is issued, your EasyBillKit Pro lifetime access and associated premium benefits may be deactivated.</p>

          <h2 className="font-semibold text-green-950">5. Technical Support</h2>
          <p>If you experience technical difficulties, please contact us at <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a>. We will make reasonable efforts to investigate and resolve the issue before a refund is necessary.</p>

          <h2 className="font-semibold text-green-950">6. Legal Consumer Rights</h2>
          <p>Nothing in this policy limits or excludes any mandatory consumer rights or statutory refund rights applicable in your country.</p>

          <h2 className="font-semibold text-green-950">7. Payment Processing</h2>
          <p>Paddle.com acts as the Merchant of Record and authorized reseller for EasyBillKit purchases. Paddle handles payment processing and customer refund transactions.</p>

          <h2 className="font-semibold text-green-950">8. Contact Us</h2>
          <p>For questions about this Refund Policy, contact:</p>
          <p><strong className="text-text">EasyBillKit</strong><br />Website: https://easybillkit.online<br />Email: <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a></p>
        </div>
      </section>
    </>
  );
}