// Privacy-friendly, page-level analytics only. Never send document/client/financial data.

export type AnalyticsEvent =
  | "page_view"
  | "document_type_selected"
  | "pdf_export_completed"
  | "pro_pricing_viewed"
  | "checkout_clicked"
  | "license_activation_success"
  | "license_activation_failure";

export function track(event: AnalyticsEvent, params?: Record<string, string | boolean | number>) {
  if (typeof window === "undefined") return;
  // GTM dataLayer
  const dl = (window as any).dataLayer;
  if (Array.isArray(dl)) {
    dl.push({ event, ...params });
  }
  // gtag fallback
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, params);
  }
}

export function trackPageView(path: string) {
  track("page_view", { page_path: path });
}