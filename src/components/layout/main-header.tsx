"use client";

import {
  Search,
  GitCompareArrows,
  Heart,
  ShoppingCart,
  User,
  Package,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrencyStore } from "@/store/currency-store";
import { useState } from "react";
import Link from "next/link";

export default function MainHeader() {
  const { getItemCount, getTotal } = useCartStore();
  const { compareItems, wishlistItems } = useUIStore();
  const { formatPrice } = useCurrencyStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white border-b border-border">
      <div className="w-full max-w-[1440px] mx-auto px-4 h-[68px] flex items-center gap-4 lg:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-blue-700 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg tracking-tight">RS</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-[16px] text-text-1 leading-tight tracking-tight">
              ROSHANAL GLOBAL
            </div>
            <div className="text-[9px] text-red font-semibold -mt-0.5 tracking-wide uppercase">
              Infotech Limited
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/10 transition-all">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 px-4 bg-transparent text-sm text-text-1 placeholder:text-text-4 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1.5 mr-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X size={16} className="text-text-4" />
              </button>
            )}
            <button className="bg-blue hover:bg-blue-600 h-11 px-5 rounded-r-lg transition-colors flex items-center gap-2 shrink-0">
              <Search size={16} className="text-white" />
              <span className="text-white text-sm font-medium hidden md:inline">Search</span>
            </button>
          </div>

          {/* Search Dropdown */}
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-strong border border-border z-50 max-h-[480px] overflow-y-auto">
              <div className="p-4">
                <p className="text-xs text-text-4 mb-3">Searching for &quot;{searchQuery}&quot;...</p>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/2 mt-1.5 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/track-order"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Package size={20} className="text-text-3 group-hover:text-blue transition-colors" />
            <span className="text-[10px] text-text-4 hidden lg:block">Track</span>
          </Link>

          <Link
            href="/compare"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group relative"
          >
            <GitCompareArrows size={20} className="text-text-3 group-hover:text-blue transition-colors" />
            <span className="text-[10px] text-text-4 hidden lg:block">Compare</span>
            {compareItems.length > 0 && (
              <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-blue text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {compareItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/account/wishlist"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group relative"
          >
            <Heart size={20} className="text-text-3 group-hover:text-red transition-colors" />
            <span className="text-[10px] text-text-4 hidden lg:block">Wishlist</span>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group relative"
          >
            <ShoppingCart size={20} className="text-text-3 group-hover:text-blue transition-colors" />
            <span className="text-[10px] text-text-4 hidden lg:block">
              {formatPrice(getTotal())}
            </span>
            {getItemCount() > 0 && (
              <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <User size={20} className="text-text-3 group-hover:text-blue transition-colors" />
            <span className="text-[10px] text-text-4 hidden lg:block">Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
