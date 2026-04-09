"use client";

import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { products } from "@/lib/demo-data";
import { X, ShoppingCart, Star, MapPin, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const categoryImages: Record<string, string> = {
  surveillance: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop",
  "fire-alarm": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=300&fit=crop",
  "access-control": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&fit=crop",
  "boat-engines": "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=300&h=300&fit=crop",
  "safety-equipment": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=300&fit=crop",
  networking: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=300&fit=crop",
  "kitchen-equipment": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
  "marine-accessories": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop",
};

const specRows = [
  "Brand",
  "Category",
  "Price",
  "Rating",
  "Stock Status",
  "SKU",
  "Type",
];

export default function ComparePage() {
  const { compareItems, toggleCompare } = useUIStore();
  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const compareProducts = compareItems
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (compareProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <GitCompareArrows size={56} className="mx-auto text-text-4 mb-4" />
        <h2 className="font-bold text-xl text-text-1 mb-2">No Products to Compare</h2>
        <p className="text-sm text-text-3 mb-6 max-w-sm mx-auto">
          Add products to compare by clicking the compare icon on product cards.
        </p>
        <Link href="/shop">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const getSpec = (product: (typeof products)[0], row: string) => {
    switch (row) {
      case "Brand": return product.brand.name;
      case "Category": return product.category.name;
      case "Price": return formatPrice(product.salePrice || product.regularPrice);
      case "Rating": return `${product.rating.toFixed(1)} (${product.reviewCount} reviews)`;
      case "Stock Status": {
        const total = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
        return total > 0 ? `In Stock (${total})` : "Out of Stock";
      }
      case "SKU": return product.sku;
      case "Type": return product.type;
      default: return "—";
    }
  };

  return (
    <div>
      <h1 className="font-bold text-2xl text-text-1 mb-6">
        Compare Products ({compareProducts.length}/4)
      </h1>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="w-[120px] p-4 text-left text-sm font-medium text-text-4 border-b border-border bg-off-white sticky left-0">
                Feature
              </th>
              {compareProducts.map((product) => (
                <th key={product.id} className="p-4 border-b border-border text-center min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-50 text-red flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <div className="w-24 h-24 mx-auto rounded-lg bg-gray-50 overflow-hidden relative mb-3">
                      <Image
                        src={product.images[0]?.url || categoryImages[product.category.slug] || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-text-1 hover:text-blue line-clamp-2">
                      {product.name}
                    </Link>
                    <div className="mt-2">
                      <span className="font-bold text-blue">
                        {formatPrice(product.salePrice || product.regularPrice)}
                      </span>
                      {product.salePrice && (
                        <span className="text-xs text-text-4 line-through ml-1">
                          {formatPrice(product.regularPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 gap-1.5"
                      onClick={() => addItem(product)}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row) => (
              <tr key={row} className="border-b border-border last:border-0">
                <td className="p-4 text-sm font-medium text-text-3 bg-off-white sticky left-0">
                  {row}
                </td>
                {compareProducts.map((product) => (
                  <td key={product.id} className="p-4 text-sm text-text-1 text-center">
                    {row === "Rating" ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{getSpec(product, row)}</span>
                      </div>
                    ) : row === "Stock Status" ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        product.inventory.reduce((s, i) => s + i.quantity, 0) > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red"
                      }`}>
                        {getSpec(product, row)}
                      </span>
                    ) : (
                      getSpec(product, row)
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {/* Location inventory */}
            <tr className="border-b border-border">
              <td className="p-4 text-sm font-medium text-text-3 bg-off-white sticky left-0">
                Stock by Location
              </td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-1">
                    {product.inventory.map((inv) => (
                      <div key={inv.locationId} className="flex items-center justify-center gap-1.5 text-xs text-text-3">
                        <MapPin size={10} /> {inv.locationName}: <span className="font-medium text-text-1">{inv.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
