import { DeviceInfo } from "@/types";

export function getDeviceInfo(): DeviceInfo {
  if (typeof navigator === "undefined") {
    return { hardwareConcurrency: null, deviceMemory: null };
  }
  return {
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    deviceMemory: (navigator as any).deviceMemory ?? null,
  };
}
