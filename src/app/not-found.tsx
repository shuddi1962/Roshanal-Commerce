"use client";

import Link from "next/link";
import { Search, Home, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/demo-data";

export default function NotFound() {
  const recentProducts = products.slice(0, 4);

  return (
    <div className="bg-off-white min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="font-syne font-900 text-[120px] sm:text-[160px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue/20 to-blue/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue/10 rounded-full flex items-center justify-center animate-pulse">
              <Search className="w-8 h-8 text-blue" />
            </div>
          </div>
        </div>

        <h2 className="font-syne font-700 text-2xl text-text-1 mb-3">
          Page Not Found
        </h2>
        <p className="text-text-3 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
            <input
              type="text"
              placeholder="Search for products, categories, brands..."
              className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link href="/">
            <Button variant="default" size="sm">
              <Home className="w-3 h-3 mr-1" /> Go Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="sm">
              <ShoppingBag className="w-3 h-3 mr-1" /> Browse Shop
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="sm">
              <Phone className="w-3 h-3 mr-1" /> Contact Us
            </Button>
          </Link>
        </div>

        {/* Popular Products */}
        <div>
          <h3 className="font-syne font-600 text-sm text-text-3 mb-4">Popular Right Now</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="bg-white rounded-lg border border-border p-3 hover:border-blue/30 transition-colors group"
              >
                <div className="w-full aspect-square bg-off-white rounded-md mb-2 flex items-center justify-center text-text-4 font-mono text-[8px]">
                  {product.sku}
                </div>
                <p className="font-syne font-600 text-xs text-text-1 group-hover:text-blue line-clamp-2">
                  {product.name}
                </p>
                <p className="font-syne font-700 text-xs text-blue mt-1">
                  ₦{(product.salePrice || product.regularPrice).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
