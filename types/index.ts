export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageSmall: string;
  imageLarge: string;
  category?: string;
  rating?: number;
}

export type AdaptiveMode = "FULL" | "CONSTRAINED";

export interface NetworkInfo {
  effectiveType: string | null;   // "4g" | "3g" | "2g" | "slow-2g" | null
  saveData: boolean;
  downlink: number | null;        // Mbps, if available
  source: "api" | "probe" | "unknown"; // where the reading came from
}

export interface DeviceInfo {
  hardwareConcurrency: number | null;
  deviceMemory: number | null;    // GB, if available
}

export interface AdaptationDecision {
  mode: AdaptiveMode;
  network: NetworkInfo;
  device: DeviceInfo;
  changes: {
    imageReduced: boolean;
    componentDeferred: boolean;
    animationsReduced: boolean;
    prefetchDisabled: boolean;
  };
}

export interface VitalMetric {
  id: string;
  name: string;
  value: number;
  rating: string;
  delta: number;
  mode: AdaptiveMode;
  timestamp: number;
}
