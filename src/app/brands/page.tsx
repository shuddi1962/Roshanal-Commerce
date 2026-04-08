"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { brands } from "@/lib/demo-data";
import { useState } from "react";

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = brands.filter((b) =>
    !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Brands</span>
        </div>
      </div>

      <section className="bg-gradient-to-r from-navy to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-syne font-800 text-3xl mb-3">Our Brands</h1>
          <p className="text-blue-200 mb-6">Authorized distributor for world-leading brands</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg text-sm text-text-1 bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${brand.slug}`}
              className="bg-white rounded-xl border border-border p-6 text-center hover:border-blue/30 hover:shadow-md transition-all group"
            >
              <div className="w-20 h-20 mx-auto bg-off-white rounded-full flex items-center justify-center mb-4">
                <span className="font-syne font-700 text-lg text-text-3 group-hover:text-blue">{brand.name.substring(0, 2)}</span>
              </div>
              <h3 className="font-syne font-700 text-sm text-text-1 group-hover:text-blue">{brand.name}</h3>
              <p className="text-xs text-text-4 mt-1">{brand.productCount} products</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue opacity-0 group-hover:opacity-100 transition-opacity">
                View Products <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-text-4/30 mx-auto mb-3" />
            <p className="text-text-3">No brands found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
