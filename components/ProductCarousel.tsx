"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(products.length, 4));
    }, 4000);
    return () => clearInterval(timer);
  }, [products.length]);

  const featured = products.slice(0, 4);
  const current = featured[currentIndex];

  if (!current) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 p-6 md:p-8 mb-8 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
          ✨ Featured Showcase (Loaded in FULL Mode)
        </span>
        <span className="text-xs text-slate-400">Interactive Heavy Component</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            {current.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
            {current.name}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {current.description}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-2xl font-black text-emerald-400">
              ₹{current.price.toLocaleString()}
            </span>
            <Link
              href={`/product/${current.id}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
          <Image
            src={current.imageLarge}
            alt={current.name}
            fill
            className="object-cover transition-all duration-700 transform scale-100"
          />
        </div>
      </div>

      {/* Carousel dots */}
      <div className="flex justify-center gap-2 mt-6">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-8 bg-indigo-400" : "w-2 bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
