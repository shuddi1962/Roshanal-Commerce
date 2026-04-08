"use client";

import Link from "next/link";
import { Shovel, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { products } from "@/lib/demo-data";

export default function DredgingProductsPage() {
  const dredgingProducts = products.filter((p) => p.category.slug === "dredging-equipment");
  const displayProducts = dredgingProducts.length > 0 ? dredgingProducts : products.slice(0, 8);

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Dredging Equipment</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Shovel className="w-6 h-6 text-amber-300" />
              <span className="text-amber-200 font-syne font-600 text-sm">Dredging Equipment</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-4 leading-tight">
              Professional Dredging Equipment
            </h1>
            <p className="text-amber-100 text-lg mb-8">
              Heavy-duty dredging equipment from top manufacturers. Pumps, cutters, pipelines,
              and complete dredging systems for marine construction and waterway maintenance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop?category=dredging-equipment">
                <Button variant="cta" size="lg">Browse Equipment <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
              <Link href="/services/dredging">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Dredging Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-2xl text-text-1 mb-6 text-center">Equipment Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Dredge Pumps", count: "12 products" },
              { name: "Cutter Heads", count: "8 products" },
              { name: "Pipelines & Floats", count: "15 products" },
              { name: "Complete Dredgers", count: "5 products" },
            ].map((cat) => (
              <Link key={cat.name} href={`/shop?category=dredging-equipment&sub=${cat.name.toLowerCase()}`} className="bg-white rounded-xl border border-border p-5 text-center hover:border-amber-300 transition-colors group">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shovel className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-amber-700">{cat.name}</h3>
                <p className="text-xs text-text-4 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-700 text-xl text-text-1 mb-6">Dredging Equipment</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} style="classic" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-2xl p-8 text-white">
            <h2 className="font-syne font-800 text-2xl mb-3">Need Dredging Services?</h2>
            <p className="text-amber-200 mb-6">We also offer professional dredging services with our own equipment fleet</p>
            <Link href="/services/dredging"><Button variant="cta" size="lg">Learn About Our Services</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
