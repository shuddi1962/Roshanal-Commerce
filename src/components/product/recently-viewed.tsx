"use client";

import { useUIStore } from "@/store/ui-store";
import { products as allProducts } from "@/lib/demo-data";
import Link from "next/link";
import { useCurrencyStore } from "@/store/currency-store";
import { Eye, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function RecentlyViewed() {
  const { recentlyViewed } = useUIStore();
  const { formatPrice, convert } = useCurrencyStore();
  const { addItem } = useCartStore();

  // Match recently viewed IDs to demo products
  const viewed = recentlyViewed
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8);

  if (viewed.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-1">Recently Viewed</h2>
            <p className="text-sm text-text-3 mt-0.5">Products you&apos;ve been browsing</p>
          </div>
          <Link href="/shop" className="text-sm text-blue hover:underline font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {viewed.map((product) => {
            if (!product) return null;
            const price = convert(product.salePrice || product.regularPrice);
            const comparePrice = product.salePrice ? convert(product.regularPrice) : null;

            return (
              <div key={product.id} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-medium transition-shadow">
                <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-off-white overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-text-4 text-xs">
                    {product.images?.[0]?.alt || product.name}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye size={20} className="text-white drop-shadow" />
                  </div>
                </Link>
                <div className="p-3">
                  <h3 className="text-xs font-medium text-text-2 line-clamp-2 leading-snug mb-1.5">
                    <Link href={`/product/${product.slug}`} className="hover:text-blue transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-text-1">{formatPrice(price)}</span>
                    {comparePrice && (
                      <span className="text-[10px] text-text-4 line-through">{formatPrice(comparePrice)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(product)}
                    className="mt-2 w-full py-1.5 rounded-lg bg-blue/5 text-blue text-[11px] font-semibold hover:bg-blue hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart size={12} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
