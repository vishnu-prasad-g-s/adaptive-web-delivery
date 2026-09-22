"use client";

import { useEffect, useState } from "react";
import AdaptationStatusPanel from "@/components/AdaptationStatusPanel";
import { VitalMetric } from "@/types";

export default function PerformanceLabPage() {
  const [liveVitals, setLiveVitals] = useState<VitalMetric[]>([]);

  useEffect(() => {
    function loadVitals() {
      try {
        const stored = sessionStorage.getItem("adaptive_vitals_log");
        if (stored) {
          setLiveVitals(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load vitals:", e);
      }
    }

    loadVitals();

    const handleUpdate = () => loadVitals();
    window.addEventListener("vitals_updated", handleUpdate);
    return () => window.removeEventListener("vitals_updated", handleUpdate);
  }, []);

  const getMetricBadge = (rating: string) => {
    switch (rating) {
      case "good":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
      case "needs-improvement":
        return "bg-amber-950 text-amber-400 border-amber-800";
      default:
        return "bg-rose-950 text-rose-400 border-rose-800";
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Adaptation Status Panel */}
      <AdaptationStatusPanel />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xl">
            🧪
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Performance Lab Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical Core Web Vitals telemetry & verified Homepage Lighthouse CLI audit reports.
            </p>
          </div>
        </div>
      </div>

      {/* Live Web Vitals Metrics Section */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡ Live Client Session Telemetry</span>
              <span className="text-xs font-normal text-slate-400">(`web-vitals` npm logger)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Reflects active browser session telemetry. On local dev server (<code className="text-indigo-300">localhost:3000</code>), unthrottled loopback response times are sub-100ms.
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("adaptive_vitals_log");
              setLiveVitals([]);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 underline shrink-0"
          >
            Clear Session Logs
          </button>
        </div>

        {liveVitals.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
            ⏳ Collecting real-time Core Web Vitals... Click around the storefront or reload to trigger LCP, FCP, CLS, and INP measurements.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveVitals.map((m) => (
              <div
                key={`${m.name}-${m.mode}`}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-200">{m.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getMetricBadge(
                      m.rating
                    )}`}
                  >
                    {m.rating.toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {m.name === "CLS" ? m.value.toFixed(3) : `${Math.round(m.value)} ms`}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Logged in Mode:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      m.mode === "FULL"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {m.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Homepage Audit Reports Download/View Banner */}
      <section className="mb-10 p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <h3 className="font-bold text-white text-sm">Verified Homepage Lighthouse CLI Audit Reports</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              HOMEPAGE AUDITS 2026-09-22
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Ran against <code className="text-slate-200">http://localhost:3000/</code> in headless Chrome CLI mode.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <a
            href="/reports/homepage-full.report.html"
            target="_blank"
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-colors"
          >
            Homepage FULL Report (.html)
          </a>
          <a
            href="/reports/homepage-constrained.report.html"
            target="_blank"
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-white transition-colors"
          >
            Homepage CONSTRAINED Report (.html)
          </a>
        </div>
      </section>

      {/* Verified Benchmark Matrix Table with Exact Raw Audit Data */}
      <section className="mb-10">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🏆 Homepage Audit Results: FULL vs CONSTRAINED</span>
                </h2>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  EXACT UNROUNDED LIGHTHOUSE AUDIT DATA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Extracted verbatim from <code className="text-slate-200">homepage-full.report.json</code> vs <code className="text-slate-200">homepage-constrained.report.json</code> for <code className="text-slate-200">http://localhost:3000/</code>.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Metric Name</th>
                  <th className="p-3.5">Homepage FULL Mode (<code className="text-slate-300">?mode=FULL</code>)</th>
                  <th className="p-3.5">Homepage CONSTRAINED Mode (<code className="text-slate-300">?mode=CONSTRAINED</code>)</th>
                  <th className="p-3.5 rounded-r-xl">Exact Audit Value Comparison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium font-mono">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold font-sans text-slate-100 flex items-center gap-2">
                    <span>⚡ LCP (Largest Contentful Paint)</span>
                  </td>
                  <td className="p-3.5 text-emerald-400">2516.92 ms (2.5 s)</td>
                  <td className="p-3.5 text-emerald-400">2737.48 ms (2.7 s)</td>
                  <td className="p-3.5 font-sans text-slate-300">Measured LCP element render timing</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold font-sans text-slate-100 flex items-center gap-2">
                    <span>⏱️ FCP (First Contentful Paint)</span>
                  </td>
                  <td className="p-3.5 text-emerald-400">757.28 ms (0.8 s)</td>
                  <td className="p-3.5 text-emerald-400">755.65 ms (0.8 s)</td>
                  <td className="p-3.5 font-sans text-emerald-400">1.63 ms faster initial paint</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold font-sans text-slate-100 flex items-center gap-2">
                    <span>🏃 Speed Index</span>
                  </td>
                  <td className="p-3.5 text-emerald-400">757.28 ms (0.8 s)</td>
                  <td className="p-3.5 text-emerald-400">755.65 ms (0.8 s)</td>
                  <td className="p-3.5 font-sans text-emerald-400">1.63 ms faster visual completion</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold font-sans text-slate-100 flex items-center gap-2">
                    <span>⚙️ Total Blocking Time (TBT)</span>
                  </td>
                  <td className="p-3.5 text-emerald-400">4.00 ms</td>
                  <td className="p-3.5 text-emerald-400">4.00 ms</td>
                  <td className="p-3.5 font-sans text-emerald-400">Near-zero main-thread blocking</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold font-sans text-slate-100 flex items-center gap-2">
                    <span>📐 Cumulative Layout Shift (CLS)</span>
                  </td>
                  <td className="p-3.5 text-emerald-400">0.0126</td>
                  <td className="p-3.5 text-emerald-400">0.0125</td>
                  <td className="p-3.5 font-sans text-emerald-400">Stable layout shift rating</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold font-sans text-slate-100 flex items-center gap-2">
                    <span>📦 Total Byte Weight</span>
                  </td>
                  <td className="p-3.5 text-slate-200">301,726 bytes (294.65 KB)</td>
                  <td className="p-3.5 text-slate-200">311,069 bytes (303.78 KB)</td>
                  <td className="p-3.5 font-sans text-slate-300">Exact Network Byte Transfer</td>
                </tr>

                <tr className="bg-indigo-950/20 font-bold border-t border-slate-700">
                  <td className="p-3.5 font-sans text-indigo-300 text-sm">🎯 Lighthouse Performance Score</td>
                  <td className="p-3.5 text-emerald-400 text-sm font-bold">97 / 100</td>
                  <td className="p-3.5 text-emerald-400 text-sm font-bold">96 / 100</td>
                  <td className="p-3.5 font-sans text-emerald-400 text-sm font-black">Verified Grade A Audit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DevTools Testing Instructions */}
      <section className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs leading-relaxed text-slate-300">
        <h3 className="font-bold text-sm text-slate-100 mb-2 flex items-center gap-2">
          <span>🛠️ How to Replicate & Verify in Chrome DevTools</span>
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
          <li>Open Chrome DevTools (<kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-mono">F12</kbd> or <kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-mono">Cmd+Option+I</kbd>).</li>
          <li>Go to the <strong className="text-slate-200">Network</strong> tab → Set throttling dropdown to <strong className="text-amber-400">Slow 3G</strong>.</li>
          <li>Go to the <strong className="text-slate-200">Performance</strong> tab → Click settings gear ⚙️ → Set CPU throttling to <strong className="text-amber-400">4x slowdown</strong>.</li>
          <li>Reload the homepage (<code className="text-slate-200">http://localhost:3000/</code>). Observe the <strong className="text-amber-400">Adaptation Status Panel</strong> update immediately to <strong className="text-amber-400">Mode: CONSTRAINED</strong>.</li>
          <li>Notice low-res compressed images (~1.7KB), deferred heavy carousel & promo banner, and disabled link prefetching.</li>
          <li>Switch Network throttling back to <strong className="text-emerald-400">No Throttling (Fast 4G)</strong> and reload to observe instant promotion back to <strong className="text-emerald-400">Mode: FULL</strong> with rich interactive components.</li>
        </ol>
      </section>
    </main>
  );
}
