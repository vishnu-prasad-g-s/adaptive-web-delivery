"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useAdaptiveMode } from "@/hooks/useAdaptiveMode";
import AdaptationStatusPanel from "@/components/AdaptationStatusPanel";
import products from "@/data/products.json";

const RecommendationWidget = dynamic(() => import("@/components/RecommendationWidget"), {
  ssr: false,
});

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === resolvedParams.id);
  const decision = useAdaptiveMode();
  const isFull = decision.mode === "FULL";

  if (!product) {
    notFound();
  }

  const imageSrc = isFull ? product.imageLarge : product.imageSmall;

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Adaptation Status Panel */}
      <AdaptationStatusPanel />

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/80 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
        {/* Product Image Section */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />

          {/* Adaptation Image Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border backdrop-blur-md ${
                !isFull
                  ? "bg-amber-950/90 text-amber-300 border-amber-800/80"
                  : "bg-emerald-950/90 text-emerald-300 border-emerald-800/80"
              }`}
            >
              {!isFull ? "CONSTRAINED (~1.7KB Compressed Small Variant)" : "FULL (Crisp High-Res Variant)"}
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase tracking-wider font-bold text-indigo-400">
                {product.category || "Electronics"}
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                ★ {product.rating || "4.8"} / 5.0
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-emerald-400 mt-4">
              ₹{product.price.toLocaleString()}
            </div>

            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Delivery Specifications */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2">
              <div className="font-semibold text-slate-300">Active Page Adaptations:</div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🖼️ Image Variant:</span>
                <span className="font-mono text-slate-200">{imageSrc}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🧩 Recommendations:</span>
                <span className={isFull ? "text-emerald-400" : "text-amber-400 font-medium"}>
                  {isFull ? "Loaded (FULL)" : "Deferred (CONSTRAINED)"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex gap-4">
            <button className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white transition-all shadow-lg shadow-indigo-600/30">
              Add to Cart (Demo)
            </button>
          </div>
        </div>
      </div>

      {/* Heavy Deferred Component (ONLY rendered in FULL mode) */}
      {isFull ? (
        <RecommendationWidget currentProductId={product.id} products={products} />
      ) : (
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs text-center">
          ℹ️ Recommendation widget deferred in CONSTRAINED mode to reduce main-thread JS execution.
        </div>
      )}
    </main>
  );
}
