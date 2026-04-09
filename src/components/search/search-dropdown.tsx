"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Clock,
  TrendingUp,
  ArrowRight,
  Tag,
  Layers,
  Package,
} from "lucide-react";
import { useCurrencyStore } from "@/store/currency-store";
import {
  useSearch,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  type SearchResults,
} from "@/lib/search";

// Unsplash fallback images keyed by category slug
const CATEGORY_IMAGES: Record<string, string> = {
  surveillance:
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=100&h=100&fit=crop",
  "fire-alarm":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&h=100&fit=crop",
  "access-control":
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=100&h=100&fit=crop",
  "solar-systems":
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&h=100&fit=crop",
  networking:
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&h=100&fit=crop",
  "ict-equipment":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop",
  "marine-accessories":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop",
  "boat-engines":
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=100&h=100&fit=crop",
  "safety-equipment":
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&h=100&fit=crop",
  "dredging-equipment":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
  "kitchen-equipment":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
  "ups-inverters":
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop",
};

function getProductImage(categorySlug: string): string {
  return (
    CATEGORY_IMAGES[categorySlug] ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
  );
}

interface SearchDropdownProps {
  query: string;
  onQueryChange: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export default function SearchDropdown({
  query,
  onQueryChange,
  inputRef,
  isFocused,
  onFocusChange,
}: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { results, isSearching, search } = useSearch(200);
  const { formatPrice, formatNGN, currency } = useCurrencyStore();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Build flat list of navigable items for keyboard nav
  const getNavigableItems = useCallback(
    (r: SearchResults | null): { type: string; id: string; href: string }[] => {
      if (!r) return [];
      const items: { type: string; id: string; href: string }[] = [];
      r.products.forEach((p) =>
        items.push({
          type: "product",
          id: p.product.id,
          href: `/product/${p.product.slug}`,
        })
      );
      r.categories.forEach((c) =>
        items.push({
          type: "category",
          id: c.category.id,
          href: `/shop?category=${c.category.slug}`,
        })
      );
      r.brands.forEach((b) =>
        items.push({
          type: "brand",
          id: b.brand.id,
          href: `/shop?brand=${b.brand.slug}`,
        })
      );
      // "View all" link
      items.push({ type: "viewall", id: "viewall", href: `/shop?q=${encodeURIComponent(r.query)}` });
      return items;
    },
    []
  );

  // Sync search
  useEffect(() => {
    search(query);
  }, [query, search]);

  // Load recent searches on focus
  useEffect(() => {
    if (isFocused) {
      setRecentSearches(getRecentSearches());
    }
  }, [isFocused]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        onFocusChange(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef, onFocusChange]);

  // Keyboard handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isFocused) return;

      if (e.key === "Escape") {
        onFocusChange(false);
        inputRef.current?.blur();
        return;
      }

      const items = getNavigableItems(results);
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === "Enter" && activeIndex >= 0 && activeIndex < items.length) {
        e.preventDefault();
        const item = items[activeIndex];
        addRecentSearch(query);
        onFocusChange(false);
        window.location.href = item.href;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, results, activeIndex, query, inputRef, onFocusChange, getNavigableItems]);

  const handleRecentClick = (term: string) => {
    onQueryChange(term);
    search(term);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleProductClick = () => {
    addRecentSearch(query);
    onFocusChange(false);
  };

  const handleViewAll = () => {
    addRecentSearch(query);
    onFocusChange(false);
  };

  // Determine what to show
  const showDropdown = isFocused && (query.length >= 2 || (query.length === 0 && recentSearches.length > 0));
  const showRecent = isFocused && query.length < 2 && recentSearches.length > 0;
  const showResults = query.length >= 2;

  const hasResults =
    results &&
    (results.products.length > 0 ||
      results.categories.length > 0 ||
      results.brands.length > 0);

  let navIndex = 0;

  return (
    <AnimatePresence>
      {showDropdown && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-strong border border-border z-50 max-h-[520px] overflow-y-auto overscroll-contain"
        >
          {/* Recent Searches */}
          {showRecent && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} />
                  Recent Searches
                </span>
                <button
                  onClick={handleClearRecent}
                  className="text-[11px] text-text-4 hover:text-red transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-0.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-gray-50 transition-colors text-left group"
                  >
                    <Clock size={14} className="text-text-4 shrink-0" />
                    <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors truncate">
                      {term}
                    </span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-text-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-border/50">
                <span className="text-xs text-text-4 flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  Trending: CCTV, Solar Panel, Boat Engine, Fire Alarm
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {showResults && isSearching && (
            <div className="p-4">
              <p className="text-xs text-text-4 mb-3">
                Searching for &quot;{query}&quot;...
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2 mt-1.5 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && !isSearching && hasResults && results && (
            <div className="py-2">
              {/* Products Section */}
              {results.products.length > 0 && (
                <div>
                  <div className="px-4 py-1.5">
                    <span className="text-[11px] font-semibold text-text-4 uppercase tracking-wider flex items-center gap-1.5">
                      <Package size={11} />
                      Products
                    </span>
                  </div>
                  {results.products.map((r) => {
                    const currentNavIndex = navIndex++;
                    const isActive = currentNavIndex === activeIndex;
                    const effectivePrice =
                      r.product.salePrice || r.product.regularPrice;
                    const hasDiscount = !!r.product.salePrice;

                    return (
                      <Link
                        key={r.product.id}
                        href={`/product/${r.product.slug}`}
                        onClick={handleProductClick}
                        className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                          isActive ? "bg-blue/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-11 h-11 rounded-lg bg-gray-50 overflow-hidden shrink-0 relative">
                          <Image
                            src={getProductImage(r.product.category.slug)}
                            alt={r.product.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-1 font-medium truncate leading-tight">
                            {r.product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold text-blue">
                              {formatPrice(effectivePrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[11px] text-text-4 line-through">
                                {formatPrice(r.product.regularPrice)}
                              </span>
                            )}
                            {currency !== "NGN" && (
                              <span className="text-[10px] text-text-4">
                                ({formatNGN(effectivePrice)})
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-text-4 bg-gray-100 px-2 py-0.5 rounded-full shrink-0 hidden sm:block">
                          {r.product.category.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Categories Section */}
              {results.categories.length > 0 && (
                <div className="mt-1">
                  <div className="px-4 py-1.5 border-t border-border/50">
                    <span className="text-[11px] font-semibold text-text-4 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={11} />
                      Categories
                    </span>
                  </div>
                  {results.categories.map((r) => {
                    const currentNavIndex = navIndex++;
                    const isActive = currentNavIndex === activeIndex;

                    return (
                      <Link
                        key={r.category.id}
                        href={`/shop?category=${r.category.slug}`}
                        onClick={handleProductClick}
                        className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                          isActive ? "bg-blue/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-md bg-blue/5 flex items-center justify-center shrink-0">
                          <Layers size={14} className="text-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-1 font-medium truncate">
                            {r.category.name}
                          </p>
                        </div>
                        <span className="text-[11px] text-text-4">
                          {r.category.productCount} products
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Brands Section */}
              {results.brands.length > 0 && (
                <div className="mt-1">
                  <div className="px-4 py-1.5 border-t border-border/50">
                    <span className="text-[11px] font-semibold text-text-4 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={11} />
                      Brands
                    </span>
                  </div>
                  {results.brands.map((r) => {
                    const currentNavIndex = navIndex++;
                    const isActive = currentNavIndex === activeIndex;

                    return (
                      <Link
                        key={r.brand.id}
                        href={`/shop?brand=${r.brand.slug}`}
                        onClick={handleProductClick}
                        className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                          isActive ? "bg-blue/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center shrink-0">
                          <Tag size={14} className="text-text-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-1 font-medium truncate">
                            {r.brand.name}
                          </p>
                        </div>
                        <span className="text-[11px] text-text-4">
                          {r.brand.productCount} products
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* View All Link */}
              <div className="border-t border-border/50 mt-1">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={handleViewAll}
                  className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                    navIndex === activeIndex ? "bg-blue/5" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm text-blue font-medium">
                    View all results for &quot;{query}&quot;
                  </span>
                  <ArrowRight size={16} className="text-blue" />
                </Link>
              </div>
            </div>
          )}

          {/* No Results */}
          {showResults && !isSearching && !hasResults && results && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-text-4" />
              </div>
              <p className="text-sm font-medium text-text-2 mb-1">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-text-4 mb-3">
                Try a different search term or browse our categories
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["CCTV", "Solar", "Boat Engine", "Fire Alarm", "Access Control"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleRecentClick(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-text-3 hover:bg-blue/10 hover:text-blue transition-colors"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
