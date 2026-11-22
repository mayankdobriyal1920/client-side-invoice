import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "settings",
  description: "EasyBillKit app area.",
  path: "/settings",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
