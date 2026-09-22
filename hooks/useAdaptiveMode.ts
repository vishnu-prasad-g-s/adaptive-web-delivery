"use client";

import { useEffect, useState } from "react";
import { getNetworkInfo } from "@/lib/networkProbe";
import { getDeviceInfo } from "@/lib/deviceSignals";
import { decideMode } from "@/lib/decisionEngine";
import { AdaptationDecision, AdaptiveMode } from "@/types";

function getInitialOverride(): AdaptiveMode | null {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode")?.toUpperCase();
    if (modeParam === "FULL" || modeParam === "CONSTRAINED") {
      return modeParam as AdaptiveMode;
    }
  }
  return null;
}

export function useAdaptiveMode() {
  const [overrideMode, setOverrideMode] = useState<AdaptiveMode | null>(getInitialOverride);
  
  const [decision, setDecision] = useState<AdaptationDecision>(() => {
    const initialMode = getInitialOverride() || "FULL";
    return {
      mode: initialMode,
      network: { effectiveType: null, saveData: false, downlink: null, source: "unknown" },
      device: { hardwareConcurrency: null, deviceMemory: null },
      changes: {
        imageReduced: initialMode === "CONSTRAINED",
        componentDeferred: initialMode === "CONSTRAINED",
        animationsReduced: initialMode === "CONSTRAINED",
        prefetchDisabled: initialMode === "CONSTRAINED",
      },
    };
  });

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
