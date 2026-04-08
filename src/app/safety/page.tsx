"use client";

import Link from "next/link";
import { HardHat, Shield, ArrowRight, Flame, Eye, HeadphonesIcon, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { products } from "@/lib/demo-data";

export default function SafetyEquipmentPage() {
  const safetyProducts = products.filter((p) => p.category.slug === "safety-equipment");
  const displayProducts = safetyProducts.length > 0 ? safetyProducts : products.slice(0, 8);

  const subcategories = [
    { icon: HardHat, name: "Head Protection", desc: "Hard hats, helmets, bump caps" },
    { icon: Eye, name: "Eye & Face Protection", desc: "Safety goggles, face shields, visors" },
    { icon: HeadphonesIcon, name: "Hearing Protection", desc: "Ear plugs, ear muffs, communication headsets" },
    { icon: Shield, name: "Body Protection", desc: "Hi-vis vests, coveralls, life jackets" },
    { icon: Footprints, name: "Foot Protection", desc: "Safety boots, steel-toe shoes" },
    { icon: Flame, name: "Fire Safety", desc: "Extinguishers, blankets, suits" },
  ];

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Safety Equipment</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-yellow-600 via-yellow-700 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <HardHat className="w-6 h-6 text-yellow-300" />
              <span className="text-yellow-200 font-syne font-600 text-sm">Safety First</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-4 leading-tight">
              Professional Safety Equipment
            </h1>
            <p className="text-yellow-100 text-lg mb-8">
              Protect your workforce with premium PPE and safety gear. From hard hats to fire extinguishers —
              all certified and compliant with international safety standards.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop?category=safety-equipment">
                <Button variant="cta" size="lg">Shop All Safety <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
              <Link href="/quote">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Bulk Order Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-2xl text-text-1 mb-6 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {subcategories.map((sub) => {
              const Icon = sub.icon;
              return (
                <Link key={sub.name} href={`/shop?category=safety-equipment&sub=${sub.name.toLowerCase()}`} className="bg-white rounded-xl border border-border p-4 text-center hover:border-blue/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-syne font-600 text-xs text-text-1 group-hover:text-blue">{sub.name}</h3>
                  <p className="text-[10px] text-text-4 mt-1 line-clamp-1">{sub.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-syne font-700 text-xl text-text-1">Safety Equipment</h2>
            <Link href="/shop?category=safety-equipment" className="text-sm text-blue hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
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
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-white">
            <h2 className="font-syne font-800 text-2xl mb-3">Need Bulk Safety Equipment?</h2>
            <p className="text-yellow-100 mb-6">Get wholesale pricing for teams, construction sites, and oil & gas operations</p>
            <Link href="/quote"><Button variant="cta" size="lg">Get a Quote</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
