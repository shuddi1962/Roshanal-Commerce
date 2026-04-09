"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, brands, products } from "@/lib/demo-data";
import { useCurrencyStore } from "@/store/currency-store";
import type { Product } from "@/types";

export interface FilterValues {
  category: string[];
  brand: string[];
  minPrice: string;
  maxPrice: string;
  rating: string;
  inStock: boolean;
  q: string;
}

interface FilterSidebarProps {
  filters: FilterValues;
  onFilterChange: (key: keyof FilterValues, value: FilterValues[keyof FilterValues]) => void;
  filteredProducts: Product[];
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 group"
      >
        <h3 className="font-syne font-bold text-sm text-text-1">{title}</h3>
        <ChevronDown
          size={16}
          className={`text-text-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filteredProducts,
}: FilterSidebarProps) {
  const { formatPrice } = useCurrencyStore();

  // Compute counts based on current products (excluding the filter being counted)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      // Apply all filters except category
      const matchBrand =
        filters.brand.length === 0 || filters.brand.includes(p.brand.slug);
      const price = p.salePrice || p.regularPrice;
      const matchMin = !filters.minPrice || price >= Number(filters.minPrice);
      const matchMax = !filters.maxPrice || price <= Number(filters.maxPrice);
      const matchRating =
        !filters.rating || p.rating >= Number(filters.rating);
      const stock = p.inventory.reduce((s, loc) => s + loc.quantity, 0);
      const matchStock = !filters.inStock || stock > 0;
      const matchQ =
        !filters.q ||
        p.name.toLowerCase().includes(filters.q.toLowerCase());

      if (matchBrand && matchMin && matchMax && matchRating && matchStock && matchQ) {
        counts[p.category.slug] = (counts[p.category.slug] || 0) + 1;
      }
    });
    return counts;
  }, [filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.inStock, filters.q]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const matchCategory =
        filters.category.length === 0 ||
        filters.category.includes(p.category.slug);
      const price = p.salePrice || p.regularPrice;
      const matchMin = !filters.minPrice || price >= Number(filters.minPrice);
      const matchMax = !filters.maxPrice || price <= Number(filters.maxPrice);
      const matchRating =
        !filters.rating || p.rating >= Number(filters.rating);
      const stock = p.inventory.reduce((s, loc) => s + loc.quantity, 0);
      const matchStock = !filters.inStock || stock > 0;
      const matchQ =
        !filters.q ||
        p.name.toLowerCase().includes(filters.q.toLowerCase());

      if (matchCategory && matchMin && matchMax && matchRating && matchStock && matchQ) {
        counts[p.brand.slug] = (counts[p.brand.slug] || 0) + 1;
      }
    });
    return counts;
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.rating, filters.inStock, filters.q]);

  const toggleArrayFilter = useCallback(
    (key: "category" | "brand", value: string) => {
      const current = filters[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFilterChange(key, next);
    },
    [filters, onFilterChange]
  );

  // Price range: determine min/max from all products
  const priceExtents = useMemo(() => {
    const prices = products.map((p) => p.salePrice || p.regularPrice);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, []);

  const minVal = filters.minPrice ? Number(filters.minPrice) : priceExtents.min;
  const maxVal = filters.maxPrice ? Number(filters.maxPrice) : priceExtents.max;

  return (
    <div className="space-y-1">
      {/* Categories */}
      <CollapsibleSection title="Category">
        <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] || 0;
            const checked = filters.category.includes(cat.slug);
            return (
              <label
                key={cat.slug}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-xs ${
                  checked
                    ? "bg-blue-50 text-blue font-semibold"
                    : "hover:bg-off-white text-text-2"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleArrayFilter("category", cat.slug)}
                  className="rounded border-border text-blue focus:ring-blue w-3.5 h-3.5 shrink-0"
                />
                <span className="flex-1 truncate">{cat.name}</span>
                <span
                  className={`text-[10px] ${
                    checked ? "text-blue/70" : "text-text-4"
                  }`}
                >
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Brands */}
      <CollapsibleSection title="Brand">
        <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
          {brands.map((brand) => {
            const count = brandCounts[brand.slug] || 0;
            const checked = filters.brand.includes(brand.slug);
            return (
              <label
                key={brand.slug}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-xs ${
                  checked
                    ? "bg-blue-50 text-blue font-semibold"
                    : "hover:bg-off-white text-text-2"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleArrayFilter("brand", brand.slug)}
                  className="rounded border-border text-blue focus:ring-blue w-3.5 h-3.5 shrink-0"
                />
                <div className="w-5 h-5 rounded bg-off-white flex items-center justify-center shrink-0">
                  <span className="text-[7px] font-bold text-text-4">
                    {brand.name.charAt(0)}
                  </span>
                </div>
                <span className="flex-1 truncate">{brand.name}</span>
                <span
                  className={`text-[10px] ${
                    checked ? "text-blue/70" : "text-text-4"
                  }`}
                >
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection title="Price Range">
        <div className="px-1 pb-1">
          {/* Visual slider track */}
          <div className="relative h-1.5 bg-gray-200 rounded-full mt-3 mb-4">
            <div
              className="absolute h-full bg-blue rounded-full"
              style={{
                left: `${((minVal - priceExtents.min) / (priceExtents.max - priceExtents.min)) * 100}%`,
                right: `${100 - ((maxVal - priceExtents.min) / (priceExtents.max - priceExtents.min)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={priceExtents.min}
              max={priceExtents.max}
              step={1000}
              value={minVal}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min={priceExtents.min}
              max={priceExtents.max}
              step={1000}
              value={maxVal}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* Min/Max inputs */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-text-4 mb-0.5 block">Min</label>
              <input
                type="number"
                placeholder={`${formatPrice(priceExtents.min)}`}
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-lg border border-border bg-white focus:border-blue focus:ring-1 focus:ring-blue/20 outline-none transition-colors"
              />
            </div>
            <span className="text-text-4 mt-4">-</span>
            <div className="flex-1">
              <label className="text-[10px] text-text-4 mb-0.5 block">Max</label>
              <input
                type="number"
                placeholder={`${formatPrice(priceExtents.max)}`}
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-lg border border-border bg-white focus:border-blue focus:ring-1 focus:ring-blue/20 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Quick price ranges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {[
              { label: "Under ₦50k", min: "", max: "50000" },
              { label: "₦50k-₦200k", min: "50000", max: "200000" },
              { label: "₦200k-₦1M", min: "200000", max: "1000000" },
              { label: "Over ₦1M", min: "1000000", max: "" },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  onFilterChange("minPrice", range.min);
                  onFilterChange("maxPrice", range.max);
                }}
                className={`px-2 py-1 text-[10px] rounded-full border transition-colors ${
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? "bg-blue text-white border-blue"
                    : "border-border text-text-3 hover:border-blue hover:text-blue"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Rating */}
      <CollapsibleSection title="Rating">
        <div className="space-y-0.5">
          {[4, 3, 2, 1].map((rating) => {
            const active = filters.rating === String(rating);
            return (
              <button
                key={rating}
                onClick={() =>
                  onFilterChange("rating", active ? "" : String(rating))
                }
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg w-full text-left transition-colors ${
                  active
                    ? "bg-blue-50 text-blue"
                    : "hover:bg-off-white text-text-2"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs">& up</span>
                {active && (
                  <X size={10} className="ml-auto text-blue" />
                )}
              </button>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Availability */}
      <CollapsibleSection title="Availability">
        <label className="flex items-center gap-2.5 px-2 py-2 text-xs text-text-2 cursor-pointer hover:bg-off-white rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange("inStock", e.target.checked)}
            className="rounded border-border text-blue focus:ring-blue w-3.5 h-3.5"
          />
          <span className="flex-1">In Stock Only</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </label>
      </CollapsibleSection>
    </div>
  );
}
