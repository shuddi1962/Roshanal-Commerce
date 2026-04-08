"use client";

import { Heart, ShoppingCart, Eye, Star, GitCompareArrows } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrencyStore } from "@/store/currency-store";
import type { Product } from "@/types";

// Map category slugs to sample images
const categoryImages: Record<string, string> = {
  surveillance: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
  "fire-alarm": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop",
  "access-control": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop",
  "solar-systems": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop",
  networking: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop",
  "ict-equipment": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
  "marine-accessories": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
  "boat-engines": "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=400&fit=crop",
  "safety-equipment": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
  "dredging-equipment": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop",
  "kitchen-equipment": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
  "ups-inverters": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=400&fit=crop",
};

interface ProductCardProps {
  product: Product;
  style?: "classic" | "overlay" | "horizontal" | "bold" | "compact";
}

export default function ProductCard({ product, style = "classic" }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, wishlistItems, toggleCompare } = useUIStore();
  const { formatPrice, currency } = useCurrencyStore();

  const isOnSale = product.salePrice && product.salePrice < product.regularPrice;
  const discountPercent = isOnSale
    ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100)
    : 0;
  const isWishlisted = wishlistItems.includes(product.id);
  const displayPrice = isOnSale ? product.salePrice! : product.regularPrice;
  const inStock = product.inventory.reduce((sum, loc) => sum + loc.quantity, 0) > 0;

  const productImage = product.images?.[0]?.url || categoryImages[product.category.slug] || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop";

  // ─── HORIZONTAL ──────────────────────────────────────────────────
  if (style === "horizontal") {
    return (
      <div className="product-card bg-white rounded-xl border border-border p-4 flex gap-4 hover:shadow-medium transition-shadow">
        <Link href={`/product/${product.slug}`} className="w-36 h-36 rounded-lg shrink-0 relative overflow-hidden bg-gray-50">
          <Image src={productImage} alt={product.name} fill className="object-cover" unoptimized />
          {isOnSale && (
            <Badge variant="sale" className="absolute top-2 left-2">
              -{discountPercent}%
            </Badge>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-text-4">{product.category.name}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-sm text-text-1 mt-1 line-clamp-2 hover:text-blue transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
            ))}
            <span className="text-[10px] text-text-4 ml-1">({product.reviewCount})</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-lg text-text-1">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="text-sm text-text-4 line-through ml-2">{formatPrice(product.regularPrice)}</span>
            )}
          </div>
          {currency !== "NGN" && (
            <p className="text-[10px] text-text-4 mt-0.5">&#8776; &#8358;{displayPrice.toLocaleString()}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => addItem(product)}
              className="h-8 px-4 bg-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ShoppingCart size={13} />
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                isWishlisted ? "bg-red text-white border-red" : "border-border text-text-3 hover:border-red hover:text-red"
              }`}
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-text-3 hover:border-blue hover:text-blue transition-colors"
            >
              <GitCompareArrows size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── OVERLAY ─────────────────────────────────────────────────────
  if (style === "overlay") {
    return (
      <div className="product-card relative rounded-xl overflow-hidden group aspect-[3/4]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {isOnSale && (
              <Badge variant="sale" className="text-[10px]">
                {product.saleBadge?.label || "SALE"} -{discountPercent}%
              </Badge>
            )}
            {product.badges
              .filter((b) => b.active && b.type !== "sale")
              .slice(0, 2)
              .map((badge) => (
                <Badge
                  key={badge.type}
                  variant={badge.type as "sale" | "hot" | "new" | "featured" | "trending" | "bestseller" | "top-rated"}
                  className="text-[10px]"
                >
                  {badge.type.toUpperCase().replace("-", " ")}
                </Badge>
              ))}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors ${
                isWishlisted ? "bg-red text-white" : "bg-white/20 text-white hover:bg-red"
              }`}
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleCompare(product.id); }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-blue transition-colors"
            >
              <GitCompareArrows size={14} />
            </button>
          </div>

          {/* Content overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <p className="text-[11px] text-white/60 mb-1">{product.brand.name}</p>
            <h3 className="font-semibold text-sm text-white line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-white/30"} />
              ))}
              <span className="text-[10px] text-white/50 ml-0.5">({product.reviewCount})</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="font-bold text-lg text-white">{formatPrice(displayPrice)}</span>
                {isOnSale && (
                  <span className="text-xs text-white/50 line-through ml-2">{formatPrice(product.regularPrice)}</span>
                )}
              </div>
              <button
                onClick={(e) => { e.preventDefault(); addItem(product); }}
                className="w-9 h-9 bg-blue hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-colors shadow-md"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ─── BOLD ────────────────────────────────────────────────────────
  if (style === "bold") {
    return (
      <div className="product-card bg-white rounded-2xl border-2 border-border overflow-hidden group relative hover:shadow-strong hover:border-blue/20 transition-all duration-300">
        {/* Image - larger */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />

          {/* Badges - thicker */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOnSale && (
              <Badge variant="sale" className="text-xs px-3 py-1 font-bold">
                {product.saleBadge?.label || "SALE"} -{discountPercent}%
              </Badge>
            )}
            {product.badges
              .filter((b) => b.active && b.type !== "sale")
              .slice(0, 2)
              .map((badge) => (
                <Badge
                  key={badge.type}
                  variant={badge.type as "sale" | "hot" | "new" | "featured" | "trending" | "bestseller" | "top-rated"}
                  className="text-xs px-3 py-1 font-bold"
                >
                  {badge.type.toUpperCase().replace("-", " ")}
                </Badge>
              ))}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-medium transition-colors ${
                isWishlisted ? "bg-red text-white" : "bg-white text-text-3 hover:bg-red hover:text-white"
              }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleCompare(product.id); }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-text-3 hover:bg-blue hover:text-white transition-colors shadow-medium"
            >
              <GitCompareArrows size={18} />
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-text-3 hover:bg-blue hover:text-white transition-colors shadow-medium"
            >
              <Eye size={18} />
            </Link>
          </div>

          {/* Add to Cart */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            <button
              onClick={(e) => { e.preventDefault(); addItem(product); }}
              className="w-full h-12 bg-blue hover:bg-blue-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-strong"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </Link>

        {/* Content - more prominent */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-off-white flex items-center justify-center">
              <span className="text-[7px] font-bold text-text-4">{product.brand.name.charAt(0)}</span>
            </div>
            <span className="text-xs text-text-4 font-medium">{product.brand.name}</span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-base text-text-1 line-clamp-2 hover:text-blue transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
            ))}
            <span className="text-xs text-text-4 ml-1">({product.reviewCount})</span>
          </div>

          {/* Prominent price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-bold text-xl text-text-1">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="text-sm text-text-4 line-through">{formatPrice(product.regularPrice)}</span>
            )}
          </div>
          {currency !== "NGN" && (
            <p className="text-[11px] text-text-4 mt-0.5">&#8776; &#8358;{displayPrice.toLocaleString()}</p>
          )}

          {/* Stock */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red"}`} />
            <span className={`text-xs font-medium ${inStock ? "text-emerald-600" : "text-red"}`}>
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPACT ─────────────────────────────────────────────────────
  if (style === "compact") {
    return (
      <div className="product-card bg-white rounded-lg border border-border overflow-hidden group hover:shadow-soft transition-shadow">
        <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {isOnSale && (
            <Badge variant="sale" className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5">
              -{discountPercent}%
            </Badge>
          )}

          {/* Minimal hover actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); addItem(product); }}
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-text-2 hover:bg-blue hover:text-white transition-colors shadow-sm"
            >
              <ShoppingCart size={14} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
                isWishlisted ? "bg-red text-white" : "bg-white text-text-3 hover:bg-red hover:text-white"
              }`}
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </Link>

        {/* Minimal content: name + price only */}
        <div className="p-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-xs text-text-1 line-clamp-1 hover:text-blue transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-bold text-sm text-text-1">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="text-[10px] text-text-4 line-through">{formatPrice(product.regularPrice)}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── CLASSIC (default) ───────────────────────────────────────────
  return (
    <div className="product-card bg-white rounded-xl border border-border overflow-hidden group relative">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <Badge variant="sale" className="text-[10px]">
              {product.saleBadge?.label || "SALE"} -{discountPercent}%
            </Badge>
          )}
          {product.badges.filter(b => b.active && b.type !== "sale").slice(0, 2).map((badge) => (
            <Badge key={badge.type} variant={badge.type as "sale" | "hot" | "new" | "featured" | "trending" | "bestseller" | "top-rated"} className="text-[10px]">
              {badge.type.toUpperCase().replace("-", " ")}
            </Badge>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
              isWishlisted ? "bg-red text-white" : "bg-white text-text-3 hover:bg-red hover:text-white"
            }`}
          >
            <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleCompare(product.id); }}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-text-3 hover:bg-blue hover:text-white transition-colors shadow-sm"
          >
            <GitCompareArrows size={14} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-text-3 hover:bg-blue hover:text-white transition-colors shadow-sm"
          >
            <Eye size={14} />
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full h-10 bg-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        {/* Brand */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center">
            <span className="text-[6px] font-bold text-text-4">{product.brand.name.charAt(0)}</span>
          </div>
          <span className="text-[10px] text-text-4">{product.brand.name}</span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm text-text-1 line-clamp-2 hover:text-blue transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}
            />
          ))}
          <span className="text-[10px] text-text-4 ml-0.5">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-base text-text-1">
            {formatPrice(displayPrice)}
          </span>
          {isOnSale && (
            <span className="text-xs text-text-4 line-through">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>
        {currency !== "NGN" && (
          <p className="text-[10px] text-text-4 mt-0.5">
            &#8776; &#8358;{displayPrice.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
        )}

        {/* Stock Indicator */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red"}`} />
          <span className="text-[10px] text-text-4">
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
