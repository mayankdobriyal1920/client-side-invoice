import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "clients",
  description: "EasyBillKit app area.",
  path: "/clients",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
