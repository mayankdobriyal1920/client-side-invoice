export const metadata = { title: "Contact", description: "Contact SimpleInvoice Studio." };

export default function ContactPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Contact</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <p>For support, feedback, or corrections, email us:</p>
        <a href="mailto:hello@flipfee.online" className="text-green-700 font-medium">hello@flipfee.online</a>
      </div>
    </section>
  );
}