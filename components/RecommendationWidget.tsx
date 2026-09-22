"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

export default function RecommendationWidget({
  currentProductId,
  products,
}: {
  currentProductId: string;
  products: Product[];
}) {
  const recommendations = products.filter((p) => p.id !== currentProductId).slice(0, 3);

  return (
    <div className="mt-12 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Recommended For You</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              Deferred in CONSTRAINED Mode
            </span>
          </div>
          <p className="text-xs text-slate-400">Personalized cross-category product recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <Link
            key={rec.id}
            href={`/product/${rec.id}`}
            className="group border border-slate-800 hover:border-slate-700 bg-slate-950 p-3 rounded-xl flex items-center gap-3 transition-all"
          >
            <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-slate-900 shrink-0">
              <Image
                src={rec.imageLarge}
                alt={rec.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 truncate">
                {rec.name}
              </h4>
              <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                ₹{rec.price.toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
