import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "About", description: "About EasyBillKit.", path: "/about" });

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About" subtitle="About EasyBillKit." breadcrumbs={[ { label: "Home", href: "/" }, { label: "About" } ]} showBack={true} />
      <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="glass-card p-5 space-y-3 text-sm text-muted">
          <p>EasyBillKit is a fast, clean, no-account invoice, estimate, and receipt maker for US freelancers and small service businesses.</p>
          <p>Everything runs in your browser. No account required for the basic workflow. No watermark on standard PDF exports.</p>
          <p>Contact: <a href="mailto:hello@easybillkit.online" className="text-green-700">hello@easybillkit.online</a></p>
        </div>
      </section>
    </>
  );
}