import { NetworkInfo, DeviceInfo, AdaptiveMode } from "@/types";

export function decideMode(network: NetworkInfo, device: DeviceInfo): AdaptiveMode {
  // saveData always forces CONSTRAINED
  if (network.saveData) return "CONSTRAINED";

  // Poor network types force CONSTRAINED
  const slowTypes = ["slow-2g", "2g", "3g"];
  if (network.effectiveType && slowTypes.includes(network.effectiveType)) {
    return "CONSTRAINED";
  }

  // Low downlink (if available) forces CONSTRAINED
  if (network.downlink !== null && network.downlink < 1.5) {
    return "CONSTRAINED";
  }

  // Weak device signals push toward CONSTRAINED
  if (device.hardwareConcurrency !== null && device.hardwareConcurrency <= 2) {
    return "CONSTRAINED";
  }
  if (device.deviceMemory !== null && device.deviceMemory <= 2) {
    return "CONSTRAINED";
  }

  // Default: FULL
  return "FULL";
}
