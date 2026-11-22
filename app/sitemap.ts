import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = [
  "/",
  "/invoice-generator",
  "/estimate-maker",
  "/receipt-maker",
  "/documents",
  "/clients",
  "/settings",
  "/pricing",
  "/activate",
  "/how-it-works",
  "/privacy-policy",
  "/terms",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `https://easybillkit.online${r}`,
    lastModified: new Date(),
  }));
}