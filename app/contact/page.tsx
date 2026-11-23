import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "Contact", description: "Contact EasyBillKit Studio.", path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" subtitle="Contact EasyBillKit Studio." breadcrumbs={[ { label: "Home", href: "/" }, { label: "Contact" } ]} showBack={true} />
      <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="glass-card p-5 space-y-3 text-sm text-muted">
          <p>For support, feedback, or corrections, email us:</p>
          <a href="mailto:hello@easybillkit.online" className="text-green-700 font-medium">hello@easybillkit.online</a>
        </div>
      </section>
    </>
  );
}