"use client";

import dynamic from "next/dynamic";
import { useAdaptiveMode } from "@/hooks/useAdaptiveMode";
import AdaptationStatusPanel from "@/components/AdaptationStatusPanel";
import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

// Heavy components are dynamic imported and rendered conditionally
const ProductCarousel = dynamic(() => import("@/components/ProductCarousel"), {
  ssr: false,
});
const PromoBanner = dynamic(() => import("@/components/PromoBanner"), {
  ssr: false,
});

export default function Home() {
  const decision = useAdaptiveMode();
  const isFull = decision.mode === "FULL";

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Live Adaptation Status Panel */}
      <AdaptationStatusPanel />

      {/* Heavy Deferred Components (ONLY loaded in FULL mode) */}
      {isFull ? (
        <>
          <PromoBanner />
          <ProductCarousel products={products} />
        </>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span>
              <strong>CONSTRAINED Mode Active:</strong> Promo banner & autoplaying carousel deferred to preserve bandwidth and save CPU execution time.
            </span>
          </div>
        </div>
      )}

      {/* Product Catalog Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-400">
            Delivering {decision.mode === "FULL" ? "High-Resolution" : "Optimized Low-Res"} media & adaptive routing
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{products.length}</span> items
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            mode={decision.mode}
            prefetch={!decision.changes.prefetchDisabled}
          />
        ))}
      </div>
    </main>
  );
}
