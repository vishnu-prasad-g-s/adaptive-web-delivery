"use client";

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800/40 p-4 md:p-5 mb-6 text-white shadow-lg flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0 animate-bounce">
          🎉
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm md:text-base text-emerald-200">
              Flash Festival Sale — Save up to 40%
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
              FULL MODE ONLY
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Use code <span className="font-mono text-emerald-400 font-bold">ADAPTIVE2026</span> at checkout. Dynamic component deferred in constrained network.
          </p>
        </div>
      </div>

      <button className="hidden sm:block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shrink-0 shadow-md">
        Claim Offer
      </button>
    </div>
  );
}
