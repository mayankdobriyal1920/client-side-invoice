export const metadata = { title: "Privacy Policy", description: "Privacy policy for SimpleInvoice Studio." };

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Privacy Policy</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <p><strong className="text-text">Local data:</strong> Invoices, estimates, receipts, clients, business profiles, and catalog items are stored in your browser (IndexedDB) on this device. We do not receive or store them on a server.</p>
        <p><strong className="text-text">Payments & licensing:</strong> Purchases and license verification are handled by Gumroad. Your license key and payment details are processed by Gumroad under their privacy policy. We do not store card details.</p>
        <p><strong className="text-text">Analytics:</strong> We may collect page-level, aggregate product events (e.g., page views, document type selected, PDF export completed). We never collect client names, emails, addresses, invoice numbers, line items, amounts, tax IDs, or license keys.</p>
        <p><strong className="text-text">Advertising:</strong> If ads are enabled, third-party advertising technologies (such as Google AdSense) may collect data as described in their policies. Ads are not shown in editors, checkout, activation, or PDFs.</p>
        <p><strong className="text-text">Deletion:</strong> You can delete records in the app. Clearing browser data may remove all records. There is no automatic cloud backup or sync.</p>
        <p><strong className="text-text">Contact:</strong> <a href="mailto:hello@flipfee.online" className="text-green-700">hello@flipfee.online</a></p>
      </div>
    </section>
  );
}