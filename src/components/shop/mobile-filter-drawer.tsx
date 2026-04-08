"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import FilterSidebar, { type FilterValues } from "./filter-sidebar";
import type { Product } from "@/types";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterValues;
  onFilterChange: (key: keyof FilterValues, value: FilterValues[keyof FilterValues]) => void;
  onClearAll: () => void;
  filteredProducts: Product[];
  resultCount: number;
}

export default function MobileFilterDrawer({
  open,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  filteredProducts,
  resultCount,
}: MobileFilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] bg-white shadow-strong flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-text-1" />
                <h2 className="font-syne font-bold text-lg text-text-1">
                  Filters
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClearAll}
                  className="text-xs text-red hover:underline font-semibold"
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-off-white transition-colors"
                >
                  <X size={18} className="text-text-2" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <FilterSidebar
                filters={filters}
                onFilterChange={onFilterChange}
                filteredProducts={filteredProducts}
              />
            </div>

            {/* Bottom Apply Button */}
            <div className="shrink-0 px-4 py-3 border-t border-border bg-white">
              <Button
                onClick={onClose}
                className="w-full"
                size="lg"
              >
                Show {resultCount} {resultCount === 1 ? "Product" : "Products"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
