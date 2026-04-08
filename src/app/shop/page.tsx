"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  X,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { products, categories, brands } from "@/lib/demo-data";

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Top Rated", "Best Selling"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.category.slug !== selectedCategory) return false;
    if (selectedBrand !== "all" && p.brand.slug !== selectedBrand) return false;
    const price = p.salePrice || p.regularPrice;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    return true;
  });

  const activeFilters = [
    selectedCategory !== "all" ? categories.find((c) => c.slug === selectedCategory)?.name : null,
    selectedBrand !== "all" ? brands.find((b) => b.slug === selectedBrand)?.name : null,
  ].filter(Boolean);

  return (
    <div>
      {/* Header with banner */}
      <div className="relative overflow-hidden bg-navy">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&h=400&fit=crop&q=80" alt="Shop" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative max-w-[1440px] mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">Shop</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight">All Products</h1>
          <p className="text-white/50 text-sm mt-1">Browse our complete catalog of professional equipment</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-black/50" : "hidden"} lg:block lg:relative lg:bg-transparent lg:z-auto`}>
            <div className={`${filtersOpen ? "w-80 bg-white h-full overflow-y-auto p-4" : ""} lg:w-[250px] lg:p-0 space-y-6`}>
              {filtersOpen && (
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <span className="font-syne font-bold text-lg">Filters</span>
                  <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
                </div>
              )}

              {/* Categories */}
              <div>
                <h3 className="font-syne font-bold text-sm mb-3">Category</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      selectedCategory === "all" ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                      }`}
                    >
                      {cat.name}
                      <span className={`text-[10px] ${selectedCategory === cat.slug ? "text-white/70" : "text-text-4"}`}>
                        {cat.productCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-syne font-bold text-sm mb-3">Brand</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      selectedBrand === "all" ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand.slug}
                      onClick={() => setSelectedBrand(brand.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                        selectedBrand === brand.slug ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                      }`}
                    >
                      <div className="w-5 h-5 rounded bg-off-white flex items-center justify-center shrink-0">
                        <span className="text-[7px] font-bold text-text-4">{brand.name.charAt(0)}</span>
                      </div>
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-syne font-bold text-sm mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Min ₦"
                    className="w-full h-8 px-2 text-xs rounded border border-border"
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  />
                  <span className="text-text-4">–</span>
                  <input
                    placeholder="Max ₦"
                    className="w-full h-8 px-2 text-xs rounded border border-border"
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000000])}
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-syne font-bold text-sm mb-3">Rating</h3>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <button key={rating} className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-off-white w-full text-left">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                      ))}
                      <span className="text-[10px] text-text-4 ml-1">& up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-syne font-bold text-sm mb-3">Availability</h3>
                <label className="flex items-center gap-2 px-3 py-2 text-xs text-text-2 cursor-pointer hover:bg-off-white rounded-lg">
                  <input type="checkbox" className="rounded" defaultChecked />
                  In Stock Only
                </label>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-border p-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-off-white rounded-lg text-xs font-semibold"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <span className="text-xs text-text-4">{filteredProducts.length} products</span>

                {activeFilters.length > 0 && (
                  <div className="hidden md:flex items-center gap-1.5">
                    {activeFilters.map((filter) => (
                      <span key={filter} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue text-[10px] rounded-full font-semibold">
                        {filter}
                        <button onClick={() => {
                          const cat = categories.find((c) => c.name === filter);
                          const br = brands.find((b) => b.name === filter);
                          if (cat) setSelectedCategory("all");
                          if (br) setSelectedBrand("all");
                        }}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => { setSelectedCategory("all"); setSelectedBrand("all"); }}
                      className="text-[10px] text-red hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-off-white border border-border rounded-lg px-3 py-1.5"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <div className="hidden md:flex items-center gap-1 bg-off-white rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Grid3X3 size={14} className={viewMode === "grid" ? "text-blue" : "text-text-4"} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                  >
                    <List size={14} className={viewMode === "list" ? "text-blue" : "text-text-4"} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} style={viewMode === "list" ? "horizontal" : "classic"} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <p className="text-text-4 text-sm">No products match your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => { setSelectedCategory("all"); setSelectedBrand("all"); setPriceRange([0, 100000000]); }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
