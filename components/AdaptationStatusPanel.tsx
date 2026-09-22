"use client";

import { useAdaptiveMode } from "@/hooks/useAdaptiveMode";

export default function AdaptationStatusPanel() {
  const { mode, network, device, changes, setOverrideMode, overrideMode } = useAdaptiveMode();

  return (
    <section className="border border-slate-700/80 rounded-2xl p-5 bg-slate-900/90 text-slate-200 shadow-xl backdrop-blur-md mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
            📡
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base tracking-tight flex items-center gap-2">
              Adaptation Telemetry Panel
              <span className="text-xs font-normal text-slate-400">Real-time status</span>
            </h2>
            <p className="text-xs text-slate-400">
              Monitors connection API, probe latency, and hardware constraints.
            </p>
          </div>
        </div>

        {/* Override / Simulator controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 font-medium">Test Mode:</span>
          <button
            onClick={() => setOverrideMode(null)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              overrideMode === null
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Auto Detect
          </button>
          <button
            onClick={() => setOverrideMode("FULL")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              overrideMode === "FULL"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Force FULL
          </button>
          <button
            onClick={() => setOverrideMode("CONSTRAINED")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              overrideMode === "CONSTRAINED"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Force CONSTRAINED
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
        {/* Signal 1: Network */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">Network Type</div>
          <div className="font-bold text-sm text-slate-100 flex items-center justify-between">
            <span>{network.effectiveType ? network.effectiveType.toUpperCase() : "Unknown"}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              source: {network.source}
            </span>
          </div>
          {network.downlink !== null && (
            <div className="text-[11px] text-slate-400 mt-1">
              Downlink: <span className="text-slate-200 font-mono">{network.downlink} Mbps</span>
            </div>
          )}
        </div>

        {/* Signal 2: Data Saver */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">Data Saver (SaveData)</div>
          <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <span className={network.saveData ? "text-amber-400" : "text-slate-300"}>
              {network.saveData ? "ON (Active)" : "OFF"}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {network.saveData ? "User requested data conservation" : "Standard data policy"}
          </div>
        </div>

        {/* Signal 3: Hardware Capability */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">Device Profile</div>
          <div className="font-bold text-sm text-slate-100">
            {device.hardwareConcurrency ?? "?"} Cores / {device.deviceMemory ?? "?"} GB RAM
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {device.hardwareConcurrency && device.hardwareConcurrency <= 2
              ? "Low-tier CPU detected"
              : "Standard/High CPU profile"}
          </div>
        </div>

        {/* Signal 4: Computed Decision */}
        <div className={`p-3.5 rounded-xl border ${
          mode === "FULL"
            ? "bg-emerald-950/30 border-emerald-800/60"
            : "bg-amber-950/30 border-amber-800/60"
        }`}>
          <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">Engine Decision</div>
          <div className="font-extrabold text-base flex items-center gap-2">
            <span className={mode === "FULL" ? "text-emerald-400" : "text-amber-400"}>
              {mode} MODE
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {mode === "FULL" ? "Optimal experience delivered" : "Performance & bandwidth saved"}
          </div>
        </div>
      </div>

      {/* Applied Adaptations checklist */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="text-slate-400 font-medium text-xs mb-2">Active Delivery Behavior:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-medium">
          <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
            changes.imageReduced
              ? "bg-amber-950/40 border-amber-800/50 text-amber-300"
              : "bg-slate-950/40 border-slate-800 text-slate-400"
          }`}>
            <span>{changes.imageReduced ? "⚡" : "🖼️"}</span>
            <span>{changes.imageReduced ? "Small Low-Res Images (~1.7KB)" : "High-Res Large Images"}</span>
          </div>

          <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
            changes.componentDeferred
              ? "bg-amber-950/40 border-amber-800/50 text-amber-300"
              : "bg-slate-950/40 border-slate-800 text-slate-400"
          }`}>
            <span>{changes.componentDeferred ? "🚫" : "✨"}</span>
            <span>{changes.componentDeferred ? "Heavy Components Deferred" : "Full Interactive Widgets Loaded"}</span>
          </div>

          <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
            changes.animationsReduced
              ? "bg-amber-950/40 border-amber-800/50 text-amber-300"
              : "bg-slate-950/40 border-slate-800 text-slate-400"
          }`}>
            <span>{changes.animationsReduced ? "⏸️" : "🎬"}</span>
            <span>{changes.animationsReduced ? "Animations Reduced" : "Rich Motion & Carousel Active"}</span>
          </div>

          <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
            changes.prefetchDisabled
              ? "bg-amber-950/40 border-amber-800/50 text-amber-300"
              : "bg-slate-950/40 border-slate-800 text-slate-400"
          }`}>
            <span>{changes.prefetchDisabled ? "🔕" : "🚀"}</span>
            <span>{changes.prefetchDisabled ? "Link Prefetching Disabled" : "Smart Link Prefetch Enabled"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
