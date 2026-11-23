import DocumentEditor from "@/components/editor/DocumentEditor";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Free Estimate Maker", description: "Create and download a professional estimate PDF in your browser.", path: "/estimate-maker" });

export default function EstimateMakerPage() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-6">
        <DocumentEditor type="estimate" />
      </section>
    </>
  );
}