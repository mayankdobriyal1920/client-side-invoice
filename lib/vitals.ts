import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";
import { track } from "./analytics";

export function reportWebVitals() {
  if (typeof window === "undefined") return;
  const send = (metric: { name: string; value: number; id: string }) => {
    track("page_view", { metric_name: metric.name, metric_value: String(Math.round(metric.value)), metric_id: metric.id });
  };
  onCLS(send);
  onINP(send);
  onLCP(send);
  onFCP(send);
  onTTFB(send);
}