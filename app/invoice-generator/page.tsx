import DocumentEditor from "@/components/editor/DocumentEditor";

export const metadata = { title: "Free Invoice Generator", description: "Create and download a professional invoice PDF in your browser." };

export default function InvoiceGeneratorPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-green-950 mb-4">Free Invoice Generator</h1>
      <DocumentEditor type="invoice" />
    </section>
  );
}