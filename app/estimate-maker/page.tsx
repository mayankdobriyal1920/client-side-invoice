import DocumentEditor from "@/components/editor/DocumentEditor";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = pageMetadata({ title: "Free Estimate Maker", description: "Create and download a professional estimate PDF in your browser.", path: "/estimate-maker" });

export default function EstimateMakerPage() {
  return (
    <>
      <PageHeader showBack={true} />
      <h1 className="text-2xl font-bold text-green-950 mb-4">Estimate Maker</h1>
      <section className="max-w-6xl mx-auto px-4 py-6">
        <DocumentEditor type="estimate" />
      </section>
    </>
  );
}