import Image from "next/image";
import Link from "next/link";
import { Product, AdaptiveMode } from "@/types";

export default function ProductCard({
  product,
  mode,
  prefetch,
}: {
  product: Product;
  mode: AdaptiveMode;
  prefetch: boolean;
}) {
  const imageSrc = mode === "FULL" ? product.imageLarge : product.imageSmall;
  const isConstrained = mode === "CONSTRAINED";

  return (
    <Link
      href={`/product/${product.id}`}
      prefetch={prefetch}
      className="group bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
    >
      <div>
        <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-square flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={product.name}
            width={mode === "FULL" ? 400 : 200}
            height={mode === "FULL" ? 400 : 200}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isConstrained ? "" : "group-hover:scale-105"
            }`}
            priority={product.id === "p1" || product.id === "p2"}
          />

          {/* Quality Indicator Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`text-[10px] font-semibold px-2 py-1 rounded-md border backdrop-blur-md ${
                isConstrained
                  ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                  : "bg-slate-950/80 text-emerald-300 border-emerald-800/60"
              }`}
            >
              {isConstrained ? "Small ~1.7KB" : "Large HD"}
            </span>
          </div>

          {/* Prefetch Status Indicator */}
          <div className="absolute bottom-2 right-2">
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border backdrop-blur-md ${
                prefetch
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60"
                  : "bg-slate-950/80 text-slate-400 border-slate-800"
              }`}
            >
              {prefetch ? "Prefetch ON" : "Prefetch OFF"}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{product.category || "Electronics"}</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              ★ {product.rating || "4.5"}
            </span>
          </div>
          <h3 className="font-bold text-slate-100 text-sm group-hover:text-indigo-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="font-extrabold text-base text-white">
          ₹{product.price.toLocaleString()}
        </div>
        <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          View details →
        </span>
      </div>
    </Link>
  );
}
