"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ChevronDown,
  Star,
} from "lucide-react";
import { products, categories, brands } from "@/lib/demo-data";
import { searchProducts } from "@/lib/search";
import { useCurrencyStore } from "@/store/currency-store";
import type { Product } from "@/types";

type SortOption = "relevance" | "price-asc" | "price-desc" | "name" | "rating";
type ViewMode = "grid" | "list";

interface SearchResultsPageProps {
  initialQuery?: string;
  initialCategory?: string;
  initialBrand?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  surveillance:
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop",
  "fire-alarm":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
  "access-control":
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop",
  "solar-systems":
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop",
  networking:
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
  "ict-equipment":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
  "marine-accessories":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
  "boat-engines":
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400&h=400&fit=crop",
  "safety-equipment":
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
  "dredging-equipment":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
  "kitchen-equipment":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
  "ups-inverters":
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
};

function getProductImage(categorySlug: string): string {
  return (
    CATEGORY_IMAGES[categorySlug] ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
  );
}

export default function SearchResultsPage({
  initialQuery = "",
  initialCategory = "",
  initialBrand = "",
}: SearchResultsPageProps) {
  const { formatPrice, formatNGN, currency } = useCurrencyStore();

  const [searchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: false,
  });
  const [minRating, setMinRating] = useState(0);

  // Get search results
  const filteredProducts = useMemo(() => {
    let results: Product[];

    if (searchQuery) {
      const searchResults = searchProducts(searchQuery, 100);
      results = searchResults.map((r) => r.product);
    } else {
      results = [...products];
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter((p) =>
        selectedCategories.includes(p.category.slug)
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      results = results.filter((p) =>
        selectedBrands.includes(p.brand.slug)
      );
    }

    // Apply price range filter
    results = results.filter((p) => {
      const price = p.salePrice || p.regularPrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply rating filter
    if (minRating > 0) {
      results = results.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        results.sort(
          (a, b) =>
            (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice)
        );
        break;
      case "price-desc":
        results.sort(
          (a, b) =>
            (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice)
        );
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      // "relevance" keeps search order
    }

    return results;
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy, minRating]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000000]);
    setMinRating(0);
  };

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0);

  const toggleFilterSection = (key: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        {searchQuery && (
          <div className="flex items-center gap-2 mb-2">
            <Search size={18} className="text-text-3" />
            <h1 className="text-lg font-semibold text-text-1">
              Search results for &quot;{searchQuery}&quot;
            </h1>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-3">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
          <div className="flex items-center gap-3">
            {/* Filter toggle for mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1.5 text-sm text-text-2 hover:text-blue transition-colors px-3 py-1.5 rounded-md border border-border"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-4 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm text-text-2 border border-border rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="hidden sm:flex items-center border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue text-white"
                    : "bg-white text-text-3 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-blue text-white"
                    : "bg-white text-text-3 hover:bg-gray-50"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {selectedCategories.map((slug) => {
              const cat = categories.find((c) => c.slug === slug);
              return cat ? (
                <button
                  key={slug}
                  onClick={() => toggleCategory(slug)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue/10 text-blue hover:bg-blue/20 transition-colors"
                >
                  {cat.name}
                  <X size={12} />
                </button>
              ) : null;
            })}
            {selectedBrands.map((slug) => {
              const brand = brands.find((b) => b.slug === slug);
              return brand ? (
                <button
                  key={slug}
                  onClick={() => toggleBrand(slug)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue/10 text-blue hover:bg-blue/20 transition-colors"
                >
                  {brand.name}
                  <X size={12} />
                </button>
              ) : null;
            })}
            {minRating > 0 && (
              <button
                onClick={() => setMinRating(0)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue/10 text-blue hover:bg-blue/20 transition-colors"
              >
                {minRating}+ Stars
                <X size={12} />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red hover:text-red/80 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block w-full lg:w-64 shrink-0`}
        >
          <div className="sticky top-4 space-y-4">
            {/* Categories Filter */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFilterSection("categories")}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-text-1"
              >
                Categories
                <ChevronDown
                  size={16}
                  className={`text-text-3 transition-transform ${
                    expandedFilters.categories ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFilters.categories && (
                <div className="px-4 py-3 space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue/20"
                      />
                      <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors flex-1 truncate">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-text-4">
                        {cat.productCount}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brands Filter */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFilterSection("brands")}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-text-1"
              >
                Brands
                <ChevronDown
                  size={16}
                  className={`text-text-3 transition-transform ${
                    expandedFilters.brands ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFilters.brands && (
                <div className="px-4 py-3 space-y-2 max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.slug)}
                        onChange={() => toggleBrand(brand.slug)}
                        className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue/20"
                      />
                      <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors flex-1 truncate">
                        {brand.name}
                      </span>
                      <span className="text-[11px] text-text-4">
                        {brand.productCount}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFilterSection("price")}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-text-1"
              >
                Price Range
                <ChevronDown
                  size={16}
                  className={`text-text-3 transition-transform ${
                    expandedFilters.price ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFilters.price && (
                <div className="px-4 py-3 space-y-3">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="text-[10px] text-text-4 uppercase">
                        Min
                      </label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="w-full border border-border rounded px-2 py-1.5 text-sm text-text-2 focus:outline-none focus:border-blue"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-text-4 mt-4">-</span>
                    <div className="flex-1">
                      <label className="text-[10px] text-text-4 uppercase">
                        Max
                      </label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full border border-border rounded px-2 py-1.5 text-sm text-text-2 focus:outline-none focus:border-blue"
                        placeholder="100000000"
                      />
                    </div>
                  </div>
                  {/* Quick ranges */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Under ₦50K", range: [0, 50000] as [number, number] },
                      { label: "₦50K - ₦200K", range: [50000, 200000] as [number, number] },
                      { label: "₦200K - ₦1M", range: [200000, 1000000] as [number, number] },
                      { label: "Over ₦1M", range: [1000000, 100000000] as [number, number] },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setPriceRange(opt.range)}
                        className="text-[11px] px-2 py-1 rounded border border-border hover:border-blue hover:text-blue transition-colors text-text-3"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rating Filter */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFilterSection("rating")}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-text-1"
              >
                Rating
                <ChevronDown
                  size={16}
                  className={`text-text-3 transition-transform ${
                    expandedFilters.rating ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFilters.rating && (
                <div className="px-4 py-3 space-y-1.5">
                  {[4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(stars)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                        minRating === stars
                          ? "bg-blue/5 text-blue"
                          : "hover:bg-gray-50 text-text-2"
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < stars
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs">& up</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-text-4" />
              </div>
              <h3 className="text-lg font-semibold text-text-1 mb-2">
                No products found
              </h3>
              <p className="text-sm text-text-3 mb-4 max-w-md mx-auto">
                Try adjusting your filters or search with different keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const effectivePrice =
                  product.salePrice || product.regularPrice;
                const hasDiscount = !!product.salePrice;
                const discountPct = hasDiscount
                  ? Math.round(
                      ((product.regularPrice - product.salePrice!) /
                        product.regularPrice) *
                        100
                    )
                  : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={getProductImage(product.category.slug)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{discountPct}%
                        </span>
                      )}
                      {product.badges.some(
                        (b) => b.type === "new-arrival" && b.active
                      ) && (
                        <span className="absolute top-2 right-2 bg-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] text-text-4 mb-0.5">
                        {product.category.name}
                      </p>
                      <h3 className="text-sm font-medium text-text-1 line-clamp-2 leading-tight mb-1.5 group-hover:text-blue transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-text-4">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-blue">
                          {formatPrice(effectivePrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-text-4 line-through">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                      </div>
                      {currency !== "NGN" && (
                        <p className="text-[10px] text-text-4 mt-0.5">
                          {formatNGN(effectivePrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const effectivePrice =
                  product.salePrice || product.regularPrice;
                const hasDiscount = !!product.salePrice;
                const discountPct = hasDiscount
                  ? Math.round(
                      ((product.regularPrice - product.salePrice!) /
                        product.regularPrice) *
                        100
                    )
                  : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group flex gap-4 border border-border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="relative w-28 h-28 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={getProductImage(product.category.slug)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="112px"
                      />
                      {hasDiscount && (
                        <span className="absolute top-1.5 left-1.5 bg-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <p className="text-[11px] text-text-4 mb-0.5">
                        {product.category.name} &middot; {product.brand.name}
                      </p>
                      <h3 className="text-sm font-medium text-text-1 line-clamp-1 group-hover:text-blue transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-text-3 line-clamp-2 mb-2">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-text-4">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-blue">
                          {formatPrice(effectivePrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-text-4 line-through">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                        {currency !== "NGN" && (
                          <span className="text-[10px] text-text-4">
                            ({formatNGN(effectivePrice)})
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
