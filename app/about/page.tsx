export const metadata = { title: "About", description: "About SimpleInvoice Studio." };

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">About SimpleInvoice Studio</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <p>SimpleInvoice Studio is a fast, clean, no-account invoice, estimate, and receipt maker for US freelancers and small service businesses.</p>
        <p>Everything runs in your browser. No account required for the basic workflow. No watermark on standard PDF exports.</p>
        <p>Contact: <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a></p>
      </div>
    </section>
  );
}