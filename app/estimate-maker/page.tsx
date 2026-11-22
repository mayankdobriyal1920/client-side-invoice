import DocumentEditor from "@/components/editor/DocumentEditor";

export const metadata = { title: "Free Estimate Maker", description: "Create and download a professional estimate PDF in your browser." };

export default function EstimateMakerPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-green-950 mb-4">Free Estimate Maker</h1>
      <DocumentEditor type="estimate" />
    </section>
  );
}