"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdaptiveMode } from "@/hooks/useAdaptiveMode";

export default function Navbar() {
  const pathname = usePathname();
  const { mode, overrideMode } = useAdaptiveMode();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-slate-100 flex items-center gap-2">
              AdaptiStore
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                WA-5
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Network & Device Adaptive Delivery</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              pathname === "/"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Storefront
          </Link>
          <Link
            href="/lab"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              pathname === "/lab"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span>📊</span> Performance Lab
          </Link>

          {/* Mode Pill */}
          <div className="ml-2 pl-3 border-l border-slate-800">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 transition-all ${
                mode === "FULL"
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-700/60 shadow-emerald-950/50"
                  : "bg-amber-950/80 text-amber-400 border-amber-700/60 shadow-amber-950/50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${mode === "FULL" ? "bg-emerald-400" : "bg-amber-400"}`} />
              {mode} MODE {overrideMode ? "(SIMULATED)" : ""}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
