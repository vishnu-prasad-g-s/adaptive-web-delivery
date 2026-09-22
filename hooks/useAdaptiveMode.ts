"use client";

import { useEffect, useState } from "react";
import { getNetworkInfo } from "@/lib/networkProbe";
import { getDeviceInfo } from "@/lib/deviceSignals";
import { decideMode } from "@/lib/decisionEngine";
import { AdaptationDecision, AdaptiveMode } from "@/types";

const DEFAULT_DECISION: AdaptationDecision = {
  mode: "FULL",
  network: { effectiveType: null, saveData: false, downlink: null, source: "unknown" },
  device: { hardwareConcurrency: null, deviceMemory: null },
  changes: {
    imageReduced: false,
    componentDeferred: false,
    animationsReduced: false,
    prefetchDisabled: false,
  },
};

export function useAdaptiveMode() {
  const [decision, setDecision] = useState<AdaptationDecision>(DEFAULT_DECISION);
  const [overrideMode, setOverrideMode] = useState<AdaptiveMode | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const network = await getNetworkInfo();
      const device = getDeviceInfo();
      const computedMode = decideMode(network, device);
      const activeMode = overrideMode ?? computedMode;

      if (cancelled) return;

      setDecision({
        mode: activeMode,
        network,
        device,
        changes: {
          imageReduced: activeMode === "CONSTRAINED",
          componentDeferred: activeMode === "CONSTRAINED",
          animationsReduced: activeMode === "CONSTRAINED",
          prefetchDisabled: activeMode === "CONSTRAINED" || network.saveData,
        },
      });
    }

    run();

    // Re-run if browser Network Information API triggers change event
    if (typeof navigator !== "undefined") {
      const conn = (navigator as any).connection
        || (navigator as any).mozConnection
        || (navigator as any).webkitConnection;

      if (conn && conn.addEventListener) {
        conn.addEventListener("change", run);
        return () => {
          cancelled = true;
          conn.removeEventListener("change", run);
        };
      }
    }

    return () => { cancelled = true; };
  }, [overrideMode]);

  return { ...decision, setOverrideMode, overrideMode };
}
