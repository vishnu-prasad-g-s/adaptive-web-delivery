import { onCLS, onFCP, onLCP, onINP, Metric } from "web-vitals";
import { VitalMetric, AdaptiveMode } from "@/types";

type VitalsCallback = (metric: VitalMetric) => void;

export function initVitalsLogging(mode: AdaptiveMode, onReport: VitalsCallback) {
  const tag = (metric: Metric) => {
    const vitalData: VitalMetric = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating || 'good',
      delta: metric.delta,
      mode: mode,
      timestamp: Date.now(),
    };
    onReport(vitalData);
    console.log(`[Vitals - ${mode}] ${metric.name}:`, metric.value);
  };

  try {
    onCLS(tag);
    onFCP(tag);
    onLCP(tag);
    onINP(tag);
  } catch (err) {
    console.warn("web-vitals listener error:", err);
  }
}
