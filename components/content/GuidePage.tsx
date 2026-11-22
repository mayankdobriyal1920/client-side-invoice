import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export interface GuideContent {
  title: string;
  intro: string;
  who: string;
  fields: string[];
  tips: string[];
  example: string;
  faq: { q: string; a: string }[];
}

export default function GuidePage({ content }: { content: GuideContent }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faq.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <section className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-950">{content.title}</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        <p>{content.intro}</p>
        <p><strong className="text-text">Who it&apos;s for:</strong> {content.who}</p>
      </div>
      <div className="glass-card p-5 space-y-2">
        <h2 className="font-semibold text-green-950">Common fields to include</h2>
        <ul className="list-disc pl-5 text-sm text-muted space-y-1">
          {content.fields.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <div className="glass-card p-5 space-y-2">
        <h2 className="font-semibold text-green-950">Tips</h2>
        <ul className="list-disc pl-5 text-sm text-muted space-y-1">
          {content.tips.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
      <div className="glass-card p-5 space-y-2">
        <h2 className="font-semibold text-green-950">Example (fictional data)</h2>
        <p className="text-sm text-muted whitespace-pre-line">{content.example}</p>
      </div>
      <div className="glass-card p-5 space-y-3">
        <h2 className="font-semibold text-green-950">FAQ</h2>
        {content.faq.map((f) => (
          <div key={f.q}>
            <p className="font-medium text-text text-sm">{f.q}</p>
            <p className="text-sm text-muted">{f.a}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link href="/invoice-generator" className="btn-primary px-6 py-3 rounded-xl font-medium inline-block">
          Open invoice generator →
        </Link>
      </div>
      <p className="text-xs text-muted text-center">
        Tax and legal requirements vary by jurisdiction. You are responsible for your entries.
      </p>
    </section>
    </>
  );
}