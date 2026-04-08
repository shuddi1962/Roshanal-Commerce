"use client";

import Link from "next/link";
import { GitCompare, X, ShoppingCart, ArrowRight, Star, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/demo-data";
import { useUIStore } from "@/store/ui-store";

export default function ComparePage() {
  const { compareItems, toggleCompare } = useUIStore();
  const compareProducts = products.filter((p) => compareItems.includes(p.id));

  if (compareProducts.length === 0) {
    return (
      <div className="bg-off-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <GitCompare className="w-16 h-16 text-text-4/30 mx-auto mb-4" />
          <h1 className="font-syne font-700 text-2xl text-text-1 mb-2">No Products to Compare</h1>
          <p className="text-text-3 mb-6 max-w-md mx-auto">
            Add products to compare by clicking the compare icon on any product card. You can compare up to 4 products.
          </p>
          <Link href="/shop">
            <Button variant="default">
              Browse Products <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const specKeys = ["Resolution", "Power Supply", "Storage", "Connectivity", "Warranty", "Dimensions", "Weight", "Operating Temp"];

  return (
    <div className="bg-off-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link>
          <span>/</span>
          <span className="text-text-1 font-medium">Compare Products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-syne font-700 text-2xl text-text-1 mb-6">
          Compare Products ({compareProducts.length})
        </h1>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              {/* Product Images & Names */}
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left w-40 text-sm font-medium text-text-3 bg-off-white/50">Product</th>
                  {compareProducts.map((product) => (
                    <th key={product.id} className="p-4 text-center relative">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-off-white hover:bg-red-50 flex items-center justify-center group"
                      >
                        <X className="w-3 h-3 text-text-4 group-hover:text-red" />
                      </button>
                      <div className="w-28 h-28 bg-off-white rounded-lg mx-auto mb-3 flex items-center justify-center text-text-4 font-mono text-[10px]">
                        {product.sku}
                      </div>
                      <Link href={`/product/${product.slug}`} className="font-syne font-600 text-sm text-text-1 hover:text-blue line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="text-xs text-text-3 mt-1">{product.brand.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b border-border">
                  <td className="p-4 text-sm font-medium text-text-3 bg-off-white/50">Price</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="font-syne font-700 text-blue">
                        ₦{(product.salePrice || product.regularPrice).toLocaleString()}
                      </span>
                      {product.salePrice && (
                        <span className="block text-xs text-text-4 line-through mt-1">
                          ₦{product.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Rating */}
                <tr className="border-b border-border">
                  <td className="p-4 text-sm font-medium text-text-3 bg-off-white/50">Rating</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-text-1">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-text-4">({product.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Category */}
                <tr className="border-b border-border">
                  <td className="p-4 text-sm font-medium text-text-3 bg-off-white/50">Category</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center text-sm text-text-2">
                      {product.category.name}
                    </td>
                  ))}
                </tr>
                {/* Availability */}
                <tr className="border-b border-border">
                  <td className="p-4 text-sm font-medium text-text-3 bg-off-white/50">Availability</td>
                  {compareProducts.map((product) => {
                    const totalStock = product.inventory.reduce((a, b) => a + b.quantity, 0);
                    return (
                      <td key={product.id} className="p-4 text-center">
                        {totalStock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-success text-sm">
                            <Check className="w-3 h-3" /> In Stock ({totalStock})
                          </span>
                        ) : (
                          <span className="text-red text-sm">Out of Stock</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {/* Specs */}
                {specKeys.map((spec) => (
                  <tr key={spec} className="border-b border-border">
                    <td className="p-4 text-sm font-medium text-text-3 bg-off-white/50">{spec}</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center text-sm text-text-2">
                        {product.specifications?.[spec] || <Minus className="w-4 h-4 text-text-4 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Actions */}
                <tr>
                  <td className="p-4 bg-off-white/50" />
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <Button variant="default" size="sm" className="w-full max-w-[200px]">
                        <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
