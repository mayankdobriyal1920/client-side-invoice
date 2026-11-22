import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "activate",
  description: "EasyBillKit app area.",
  path: "/activate",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
