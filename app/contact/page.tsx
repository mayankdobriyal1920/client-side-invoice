export const metadata = { title: "Contact", description: "Contact SimpleInvoice Studio." };

export default function ContactPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-950">Contact</h1>
      <p className="mt-3 text-muted">
        Email <a href="mailto:hello@flipfee.online" className="text-green-700">hello@flipfee.online</a>.
      </p>
    </section>
  );
}