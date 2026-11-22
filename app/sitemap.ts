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
  "/refund-policy",
  "/about",
  "/contact",
  "/tools/invoice-generator",
  "/tools/estimate-generator",
  "/tools/receipt-maker",
  "/tools/invoice-number-generator",
  "/tools/hourly-invoice-calculator",
  "/guides/contractor-invoice",
  "/guides/handyman-invoice",
  "/guides/cleaning-invoice",
  "/guides/landscaping-invoice",
  "/guides/plumbing-invoice",
  "/guides/electrical-invoice",
  "/guides/freelance-designer-invoice",
  "/guides/consulting-invoice",
  "/guides/tutoring-invoice",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `https://easybillkit.online${r}`,
    lastModified: new Date(),
  }));
}