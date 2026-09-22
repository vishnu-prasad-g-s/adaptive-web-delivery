"use client";

import { useEffect } from "react";
import { useAdaptiveMode } from "@/hooks/useAdaptiveMode";
import { initVitalsLogging } from "@/lib/vitalsLogger";
import { VitalMetric } from "@/types";

export default function VitalsCollector() {
  const { mode } = useAdaptiveMode();

  useEffect(() => {
    initVitalsLogging(mode, (metric: VitalMetric) => {
      try {
        const stored = sessionStorage.getItem("adaptive_vitals_log");
        const list: VitalMetric[] = stored ? JSON.parse(stored) : [];
        // Replace metric if already recorded for this metric name & mode or append
        const updated = [...list.filter(m => m.name !== metric.name || m.mode !== metric.mode), metric];
        sessionStorage.setItem("adaptive_vitals_log", JSON.stringify(updated));
        
        // Dispatch custom event so active Lab page updates immediately
        window.dispatchEvent(new CustomEvent("vitals_updated", { detail: metric }));
      } catch (e) {
        console.error("Failed to store vitals in sessionStorage:", e);
      }
    });
  }, [mode]);

  return null;
}
