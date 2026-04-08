"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Ship,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  X,
  Fuel,
  Gauge,
  Weight,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/product-card";
import { boatEngines } from "@/lib/demo-data";

const engineBrands = ["All", "Yamaha", "Mercury", "Suzuki Marine", "Honda Marine", "Evinrude", "Tohatsu"];
const horsepowerRanges = ["All HP", "Under 50 HP", "50–100 HP", "100–200 HP", "200–300 HP", "300+ HP"];
const engineTypes = ["All Types", "4-Stroke", "2-Stroke", "Electric", "Diesel"];
const fuelTypes = ["All Fuel", "Gasoline", "Diesel", "Electric"];
const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Top Rated", "Best Selling"];

export default function BoatEnginesPage() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedHP, setSelectedHP] = useState("All HP");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedFuel, setSelectedFuel] = useState("All Fuel");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilters = [selectedBrand, selectedHP, selectedType, selectedFuel].filter(
    (f) => !f.startsWith("All")
  );

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-navy via-blue-900 to-navy py-16">
          <div className="max-w-[1440px] mx-auto px-4">
            <div className="flex items-center gap-2 text-blue-300 text-sm mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              <Link href="/shop" className="hover:text-white">Shop</Link>
              <ChevronRight size={14} />
              <span className="text-white">Boat Engines</span>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-xl">
                <h1 className="font-syne font-black text-3xl lg:text-4xl text-white">
                  Boat Engines & Outboard Motors
                </h1>
                <p className="text-white/60 text-base mt-3">
                  Premium marine engines from Yamaha, Mercury, Suzuki, and more. All horsepower
                  ranges for fishing, cruising, racing, and commercial use.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                    <Ship size={16} className="text-blue-300" />
                    <span className="text-white text-sm font-semibold">{boatEngines.length}+ Products</span>
                  </div>
                  <Link href="/services/boat-building" className="flex items-center gap-1 text-blue-300 text-sm hover:text-white transition-colors">
                    Need a full boat? <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-64 h-40 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Ship size={64} className="text-white/15" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Filter Pills — inline banner */}
        <div className="bg-white border-b border-border">
          <div className="max-w-[1440px] mx-auto px-4 py-3">
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
              <span className="text-xs text-text-4 shrink-0 font-semibold">Brands:</span>
              {engineBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedBrand === brand
                      ? "bg-blue text-white"
                      : "bg-off-white text-text-3 hover:bg-border"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Engine Banners */}
      <section className="py-6">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red to-red-700 rounded-xl p-5 text-white">
              <Badge className="bg-white/20 text-white text-[10px] mb-2">HOT DEAL</Badge>
              <h3 className="font-syne font-bold text-lg">Yamaha Outboards</h3>
              <p className="text-white/70 text-xs mt-1">F-Series 4-Stroke — 40HP to 350HP</p>
              <p className="font-syne font-bold text-xl mt-3">From ₦1.8M</p>
              <Link href="/brands/yamaha" className="inline-flex items-center gap-1 text-xs mt-3 text-white/80 hover:text-white">
                Shop Yamaha <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-800 to-navy rounded-xl p-5 text-white">
              <Badge className="bg-white/20 text-white text-[10px] mb-2">PREMIUM</Badge>
              <h3 className="font-syne font-bold text-lg">Mercury Verado</h3>
              <p className="text-white/70 text-xs mt-1">V6 & V8 Performance Series</p>
              <p className="font-syne font-bold text-xl mt-3">From ₦4.5M</p>
              <Link href="/brands/mercury" className="inline-flex items-center gap-1 text-xs mt-3 text-white/80 hover:text-white">
                Shop Mercury <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-5 text-white">
              <Badge className="bg-white/20 text-white text-[10px] mb-2">RELIABLE</Badge>
              <h3 className="font-syne font-bold text-lg">Suzuki Marine</h3>
              <p className="text-white/70 text-xs mt-1">DF-Series — Fuel Efficient</p>
              <p className="font-syne font-bold text-xl mt-3">From ₦2.2M</p>
              <Link href="/brands/suzuki-marine" className="inline-flex items-center gap-1 text-xs mt-3 text-white/80 hover:text-white">
                Shop Suzuki <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-12">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex gap-6">
            {/* Sidebar Filters — Desktop */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="sticky top-4 space-y-6">
                <div>
                  <h3 className="font-syne font-bold text-sm mb-3">Horsepower</h3>
                  <div className="space-y-1.5">
                    {horsepowerRanges.map((hp) => (
                      <button
                        key={hp}
                        onClick={() => setSelectedHP(hp)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                          selectedHP === hp ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                        }`}
                      >
                        <Gauge size={12} /> {hp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-syne font-bold text-sm mb-3">Engine Type</h3>
                  <div className="space-y-1.5">
                    {engineTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                          selectedType === type ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-syne font-bold text-sm mb-3">Fuel Type</h3>
                  <div className="space-y-1.5">
                    {fuelTypes.map((fuel) => (
                      <button
                        key={fuel}
                        onClick={() => setSelectedFuel(fuel)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                          selectedFuel === fuel ? "bg-blue text-white" : "hover:bg-off-white text-text-2"
                        }`}
                      >
                        <Fuel size={12} /> {fuel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-syne font-bold text-sm mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <input type="range" min="0" max="10000000" className="w-full" />
                    <div className="flex items-center gap-2">
                      <input placeholder="Min ₦" className="w-full h-8 px-2 text-xs rounded border border-border" />
                      <span className="text-text-4">–</span>
                      <input placeholder="Max ₦" className="w-full h-8 px-2 text-xs rounded border border-border" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-syne font-bold text-sm mb-3">Rating</h3>
                  <div className="space-y-1.5">
                    {[4, 3, 2, 1].map((rating) => (
                      <button key={rating} className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-off-white w-full text-left">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                        ))}
                        <span className="text-xs text-text-4 ml-1">& up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specifications Quick Filters */}
                <div>
                  <h3 className="font-syne font-bold text-sm mb-3">Specifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text-2 p-2 bg-off-white rounded-lg">
                      <Weight size={12} className="text-text-4" />
                      <span>Shaft Length</span>
                      <select className="ml-auto text-[10px] bg-white border border-border rounded px-1 py-0.5">
                        <option>Any</option>
                        <option>Short (15&quot;)</option>
                        <option>Long (20&quot;)</option>
                        <option>Extra Long (25&quot;)</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-2 p-2 bg-off-white rounded-lg">
                      <Waves size={12} className="text-text-4" />
                      <span>Application</span>
                      <select className="ml-auto text-[10px] bg-white border border-border rounded px-1 py-0.5">
                        <option>Any</option>
                        <option>Freshwater</option>
                        <option>Saltwater</option>
                        <option>Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-off-white rounded-lg text-xs font-semibold"
                  >
                    <SlidersHorizontal size={14} /> Filters
                  </button>
                  <span className="text-xs text-text-4">{boatEngines.length} products</span>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {activeFilters.map((filter) => (
                      <span key={filter} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue text-[10px] rounded-full font-semibold">
                        {filter}
                        <button onClick={() => {
                          if (selectedBrand === filter) setSelectedBrand("All");
                          if (selectedHP === filter) setSelectedHP("All HP");
                          if (selectedType === filter) setSelectedType("All Types");
                          if (selectedFuel === filter) setSelectedFuel("All Fuel");
                        }}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

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

              {/* Products */}
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {boatEngines.map((product) => (
                  <ProductCard key={product.id} product={product} style={viewMode === "list" ? "horizontal" : "classic"} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Products <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related: Boat Building CTA */}
      <section className="py-8 bg-gradient-to-r from-navy to-blue-900">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="font-syne font-bold text-2xl">Need a Complete Boat?</h2>
              <p className="text-white/60 text-sm mt-2">
                We build custom vessels with engines pre-installed. Design your dream boat with 3D visualization.
              </p>
            </div>
            <Link
              href="/services/boat-building"
              className="inline-flex items-center justify-center rounded-lg text-sm font-syne font-bold h-12 px-8 bg-red text-white hover:bg-red-600 shadow-lg transition-all shrink-0"
            >
              Start Boat Design <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
