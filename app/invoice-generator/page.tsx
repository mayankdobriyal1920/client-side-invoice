import DocumentEditor from "@/components/editor/DocumentEditor";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "Free Invoice Generator", description: "Create and download a professional invoice PDF in your browser.", path: "/invoice-generator" });

export default function InvoiceGeneratorPage() {
  return (
    <>
      <PageHeader showBack={true} />
      <section className="max-w-6xl mx-auto px-4 py-6">
        <DocumentEditor type="invoice" />
      </section>
    </>
  );
}