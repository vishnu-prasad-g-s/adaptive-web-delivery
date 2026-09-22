import { NetworkInfo } from "@/types";

// Reads navigator.connection when available.
export function readConnectionAPI(): NetworkInfo | null {
  if (typeof navigator === "undefined") return null;
  const conn = (navigator as any).connection
    || (navigator as any).mozConnection
    || (navigator as any).webkitConnection;

  if (!conn) return null;

  return {
    effectiveType: conn.effectiveType ?? null,
    saveData: !!conn.saveData,
    downlink: typeof conn.downlink === "number" ? conn.downlink : null,
    source: "api",
  };
}

// Fallback: times a small fetch to estimate network quality.
// This is an ESTIMATE ONLY — never present it as exact speed.
export async function probeNetworkSpeed(): Promise<NetworkInfo> {
  const testFileUrl = "/probe/probe-50kb.bin";
  const startTime = performance.now();

  try {
    await fetch(testFileUrl, { cache: "no-store" });
    const durationMs = performance.now() - startTime;

    // Rough thresholds based on standard 50KB download duration
    let effectiveType: string;
    if (durationMs < 200) effectiveType = "4g";
    else if (durationMs < 600) effectiveType = "3g";
    else effectiveType = "2g";

    return {
      effectiveType,
      saveData: false,
      downlink: null,
      source: "probe",
    };
  } catch {
    return {
      effectiveType: null,
      saveData: false,
      downlink: null,
      source: "unknown",
    };
  }
}

// Combined entry point: prefer the real API, fall back to probe.
export async function getNetworkInfo(): Promise<NetworkInfo> {
  const apiResult = readConnectionAPI();
  if (apiResult && apiResult.effectiveType) return apiResult;
  return probeNetworkSpeed();
}
