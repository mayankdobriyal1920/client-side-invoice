import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "documents",
  description: "EasyBillKit app area.",
  path: "/documents",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
