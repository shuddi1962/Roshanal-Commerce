"use client";

import Link from "next/link";
import { Zap, ArrowRight, Tag, Percent, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { saleProducts, products } from "@/lib/demo-data";

export default function DealsPage() {
  const flashSaleProducts = saleProducts.slice(0, 4);
  const clearanceProducts = products.filter((p) => p.salePrice).slice(0, 4);


  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Deals</span>
        </div>
      </div>

      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-red via-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-6 h-6 text-yellow-300" />
            <h1 className="font-syne font-800 text-3xl">Flash Sale</h1>
            <Zap className="w-6 h-6 text-yellow-300" />
          </div>
          <p className="text-red-100 mb-6">Limited time offers — grab them before they&apos;re gone!</p>
          {/* Countdown */}
          <div className="flex items-center justify-center gap-3">
            {[
              { value: "02", label: "Days" },
              { value: "14", label: "Hours" },
              { value: "37", label: "Minutes" },
              { value: "52", label: "Seconds" },
            ].map((t) => (
              <div key={t.label} className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-center">
                <p className="font-syne font-800 text-2xl">{t.value}</p>
                <p className="text-[10px] text-red-200 uppercase">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Flash Sale */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-red" />
              <h2 className="font-syne font-700 text-xl text-text-1">Flash Sale</h2>
            </div>
            <Link href="/shop?sale=true" className="text-sm text-blue hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} style="classic" />
            ))}
          </div>
        </section>

        {/* Deal Categories */}
        <section className="mb-12">
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/deals?type=clearance" className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6 hover:shadow-md transition-shadow">
              <Percent className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="font-syne font-700 text-lg text-text-1">Clearance Sale</h3>
              <p className="text-sm text-text-3 mt-1">Up to 50% off selected items</p>
            </Link>
            <Link href="/deals?type=bundles" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 hover:shadow-md transition-shadow">
              <Gift className="w-8 h-8 text-blue mb-3" />
              <h3 className="font-syne font-700 text-lg text-text-1">Bundle Deals</h3>
              <p className="text-sm text-text-3 mt-1">Save more when you buy together</p>
            </Link>
            <Link href="/deals?type=seasonal" className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6 hover:shadow-md transition-shadow">
              <Star className="w-8 h-8 text-success mb-3" />
              <h3 className="font-syne font-700 text-lg text-text-1">Seasonal Offers</h3>
              <p className="text-sm text-text-3 mt-1">Special prices for limited time</p>
            </Link>
          </div>
        </section>

        {/* More Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-blue" />
              <h2 className="font-syne font-700 text-xl text-text-1">More Great Deals</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {clearanceProducts.map((product) => (
              <ProductCard key={product.id} product={product} style="classic" />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-navy to-blue-800 rounded-2xl p-8 text-center text-white">
          <h2 className="font-syne font-800 text-2xl mb-3">Never Miss a Deal</h2>
          <p className="text-blue-200 mb-6">Subscribe to get notified about flash sales and exclusive offers</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm text-text-1 bg-white focus:outline-none"
            />
            <Button variant="cta">Subscribe</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
