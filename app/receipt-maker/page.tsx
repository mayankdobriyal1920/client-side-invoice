import DocumentEditor from "@/components/editor/DocumentEditor";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "Receipt Maker", description: "Create and download a receipt PDF in your browser.", path: "/receipt-maker" });

export default function ReceiptMakerPage() {
  return (
    <>
      <PageHeader showBack={true} title="Receipt Maker" subtitle="Create and download a receipt PDF in your browser." />
      <section className="max-w-6xl mx-auto px-4 py-6">
        <DocumentEditor type="receipt" />
      </section>
    </>
  );
}