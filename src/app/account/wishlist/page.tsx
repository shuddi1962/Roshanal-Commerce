"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Share2, Grid, List, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/demo-data";
import { useUIStore } from "@/store/ui-store";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useUIStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-700 text-2xl text-text-1">My Wishlist</h1>
          <p className="text-sm text-text-3 mt-1">{wishlistProducts.length} saved items</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border ${viewMode === "grid" ? "border-blue bg-blue-50 text-blue" : "border-border text-text-4"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border ${viewMode === "list" ? "border-blue bg-blue-50 text-blue" : "border-border text-text-4"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-border py-20 text-center">
          <Heart className="w-16 h-16 text-text-4/30 mx-auto mb-4" />
          <h3 className="font-syne font-600 text-lg text-text-1 mb-2">Your wishlist is empty</h3>
          <p className="text-sm text-text-3 mb-6 max-w-sm mx-auto">
            Browse our products and tap the heart icon to save items you love.
          </p>
          <Link href="/shop">
            <Button variant="default">
              Browse Products <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-border overflow-hidden group hover:border-blue/20 transition-colors">
              <div className="aspect-square bg-off-white relative">
                <div className="absolute inset-0 flex items-center justify-center text-text-4 font-mono text-xs">
                  {product.sku}
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-4 h-4 text-red fill-red" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-text-3 mb-1">{product.brand.name}</p>
                <Link href={`/product/${product.slug}`} className="font-syne font-600 text-sm text-text-1 hover:text-blue line-clamp-2 mb-2 block">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-syne font-700 text-blue">
                    ₦{(product.salePrice || product.regularPrice).toLocaleString()}
                  </span>
                  {product.salePrice && (
                    <span className="text-xs text-text-4 line-through">
                      ₦{product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="flex-1">
                    <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                  </Button>
                  <button className="p-2 border border-border rounded-lg hover:bg-off-white text-text-3">
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4 hover:border-blue/20 transition-colors">
              <div className="w-20 h-20 bg-off-white rounded-lg flex-shrink-0 flex items-center justify-center text-text-4 font-mono text-[10px]">
                {product.sku}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-3">{product.brand.name} · {product.category.name}</p>
                <Link href={`/product/${product.slug}`} className="font-syne font-600 text-sm text-text-1 hover:text-blue block truncate">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-syne font-700 text-blue text-sm">
                    ₦{(product.salePrice || product.regularPrice).toLocaleString()}
                  </span>
                  {product.salePrice && (
                    <span className="text-xs text-text-4 line-through">₦{product.regularPrice.toLocaleString()}</span>
                  )}
                  <span className="text-xs text-success">In Stock</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm">
                  <ShoppingCart className="w-3 h-3 mr-1" /> Add
                </Button>
                <button onClick={() => toggleWishlist(product.id)} className="p-2 text-text-4 hover:text-red">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
