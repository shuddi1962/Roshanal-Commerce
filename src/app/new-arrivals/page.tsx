"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import { newArrivals, products } from "@/lib/demo-data";

export default function NewArrivalsPage() {
  const allNew = newArrivals.length > 0 ? newArrivals : products.slice(0, 12);

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">New Arrivals</span>
        </div>
      </div>

      <section className="bg-gradient-to-r from-navy to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h1 className="font-syne font-800 text-3xl">New Arrivals</h1>
          </div>
          <p className="text-blue-200">The latest products added to our store</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allNew.map((product) => (
            <ProductCard key={product.id} product={product} style="classic" />
          ))}
        </div>

        {allNew.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-border">
            <Sparkles className="w-12 h-12 text-text-4/30 mx-auto mb-3" />
            <h3 className="font-syne font-600 text-text-1 mb-1">No new arrivals yet</h3>
            <p className="text-sm text-text-3">Check back soon for fresh products</p>
          </div>
        )}
      </div>
    </div>
  );
}
