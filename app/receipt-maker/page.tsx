import DocumentEditor from "@/components/editor/DocumentEditor";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "Receipt Maker", description: "Create and download a receipt PDF in your browser.", path: "/receipt-maker" });

export default function ReceiptMakerPage() {
  return (
    <>
      <PageHeader showBack={true} />
      <h1 className="text-2xl font-bold text-green-950 mb-4">Receipt Maker</h1>
      <section className="max-w-6xl mx-auto px-4 py-6">
        <DocumentEditor type="receipt" />
      </section>
    </>
  );
}