"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Tag,
  ChevronRight,
  MapPin,
  Shield,
  Truck,
  Gift,
  ArrowRight,
  Package,
  AlertTriangle,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { products } from "@/lib/demo-data";
import ProductCard from "@/components/product/product-card";

const branches = [
  { id: "phc", name: "Port Harcourt" },
  { id: "lagos", name: "Lagos" },
  { id: "abuja", name: "Abuja" },
];

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const { formatPrice, currency } = useCurrencyStore();

  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = getTotal();
  const giftWrapFee = giftWrap ? 2500 : 0;
  const shippingEstimate = subtotal > 100000 ? 0 : 4500;
  const discount = couponDiscount;
  const total = subtotal - discount + shippingEstimate + giftWrapFee;

  const handleApplyCoupon = () => {
    setCouponError("");
    if (couponCode.toUpperCase() === "WELCOME10") {
      setCouponDiscount(subtotal * 0.1);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "ROSHANAL5") {
      setCouponDiscount(subtotal * 0.05);
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  // Upsell products (items not in cart)
  const cartProductIds = items.map((i) => i.product.id);
  const upsellProducts = products.filter((p) => !cartProductIds.includes(p.id) && p.featured).slice(0, 4);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue/20 border-t-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="max-w-[1440px] mx-auto px-6 py-16 text-center">
          <div className="w-24 h-24 mx-auto bg-off-white rounded-full flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-text-4" />
          </div>
          <h1 className="font-syne font-bold text-2xl text-text-1 mb-2">Your Cart is Empty</h1>
          <p className="text-sm text-text-3 mb-8">Looks like you haven&apos;t added any products yet.</p>
          <Link href="/shop">
            <Button className="font-syne font-bold">
              Continue Shopping <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>

          {/* Suggestions */}
          <div className="mt-16">
            <h2 className="font-syne font-bold text-xl mb-6">You Might Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {products.filter((p) => p.featured).slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-text-4">
            <Link href="/" className="hover:text-blue transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop" className="hover:text-blue transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-text-2 font-semibold">Cart ({getItemCount()} items)</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-syne font-bold text-2xl text-text-1">Shopping Cart</h1>
          <button onClick={clearCart} className="text-xs text-text-4 hover:text-red transition-colors flex items-center gap-1">
            <Trash2 size={12} /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isOnSale = item.product.salePrice && item.product.salePrice < item.product.regularPrice;
              const displayPrice = isOnSale ? item.product.salePrice! : item.product.regularPrice;
              const discountPercent = isOnSale
                ? Math.round(((item.product.regularPrice - item.product.salePrice!) / item.product.regularPrice) * 100)
                : 0;
              const lineTotal = displayPrice * item.quantity;

              return (
                <div key={`${item.product.id}-${item.variant?.id || ""}`} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/product/${item.product.slug}`} className="w-24 h-24 md:w-32 md:h-32 bg-off-white rounded-xl shrink-0 relative overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-off-white flex items-center justify-center">
                        <span className="text-[10px] text-text-4 font-mono">{item.product.sku}</span>
                      </div>
                      {isOnSale && item.product.saleBadge && (
                        <Badge variant="sale" className="absolute top-1.5 left-1.5 text-[8px]">
                          -{discountPercent}%
                        </Badge>
                      )}
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/product/${item.product.slug}`}>
                            <h3 className="font-syne font-bold text-sm text-text-1 hover:text-blue transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-[10px] text-text-4 mt-0.5">{item.product.brand.name} · {item.product.category.name}</p>
                          {item.variant && (
                            <p className="text-[10px] text-blue mt-0.5">Variant: {item.variant.name}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="text-text-4 hover:text-red transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-syne font-bold text-base text-text-1">{formatPrice(displayPrice)}</span>
                        {isOnSale && (
                          <span className="text-xs text-text-4 line-through">{formatPrice(item.product.regularPrice)}</span>
                        )}
                      </div>

                      {/* Branch Selector & Quantity */}
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {/* Branch */}
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-text-4" />
                          <select
                            value={item.branchId}
                            className="h-7 px-2 text-[10px] rounded-lg border border-border focus:outline-none focus:border-blue"
                          >
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                            className="w-8 h-7 flex items-center justify-center text-text-3 hover:bg-off-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center text-xs font-bold border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                            className="w-8 h-7 flex items-center justify-center text-text-3 hover:bg-off-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="ml-auto font-syne font-bold text-sm text-text-1">
                          {formatPrice(lineTotal)}
                        </span>
                      </div>

                      {/* Move to Wishlist */}
                      <button className="text-[10px] text-text-4 hover:text-blue transition-colors mt-2 flex items-center gap-1">
                        <Heart size={10} /> Move to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Countdown Banner for Sale Items */}
            {items.some((i) => i.product.salePrice) && (
              <div className="bg-red/5 border border-red/20 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle size={18} className="text-red shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red">Sale prices may expire soon!</p>
                  <p className="text-[10px] text-text-3">Complete your order to lock in the discounted prices.</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border p-5 sticky top-4">
              <h3 className="font-syne font-bold text-sm mb-4">Order Summary</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-3">Subtotal ({getItemCount()} items)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> Coupon ({couponCode.toUpperCase()})
                    </span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-text-3">Shipping</span>
                  <span className={`font-semibold ${shippingEstimate === 0 ? "text-success" : ""}`}>
                    {shippingEstimate === 0 ? "FREE" : formatPrice(shippingEstimate)}
                  </span>
                </div>

                {giftWrap && (
                  <div className="flex justify-between">
                    <span className="text-text-3 flex items-center gap-1"><Gift size={12} /> Gift Wrap</span>
                    <span className="font-semibold">{formatPrice(giftWrapFee)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-2.5 mt-2.5">
                  <div className="flex justify-between">
                    <span className="font-syne font-bold text-text-1">Total</span>
                    <span className="font-syne font-bold text-lg text-text-1">{formatPrice(total)}</span>
                  </div>
                  {currency !== "NGN" && (
                    <p className="text-[10px] text-text-4 text-right mt-0.5">≈ ₦{total.toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-text-2 mb-1.5 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                    placeholder="Enter code"
                    className="flex-1 h-9 px-3 text-xs rounded-lg border border-border focus:outline-none focus:border-blue"
                  />
                  <Button size="sm" variant="outline" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>
                    Apply
                  </Button>
                </div>
                {couponError && <p className="text-[10px] text-red mt-1">{couponError}</p>}
                {couponApplied && <p className="text-[10px] text-success mt-1">Coupon applied! You save {formatPrice(discount)}</p>}
                <p className="text-[9px] text-text-4 mt-1">Try: WELCOME10 or ROSHANAL5</p>
              </div>

              {/* Gift Wrap */}
              <label className="flex items-center gap-2 mt-3 text-xs text-text-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded accent-blue"
                />
                <Gift size={12} className="text-text-4" />
                Add gift wrapping (₦2,500)
              </label>

              {/* Free Shipping Progress */}
              {shippingEstimate > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-[10px] text-blue font-semibold">
                    Add {formatPrice(100000 - subtotal)} more for FREE shipping!
                  </p>
                  <div className="w-full h-1.5 bg-blue/20 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-blue rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / 100000) * 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout" className="block mt-4">
                <Button className="w-full h-11 font-syne font-bold">
                  Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>

              <Link href="/shop" className="block text-center text-xs text-blue hover:underline mt-3">
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border">
                <div className="text-center">
                  <Shield size={16} className="mx-auto text-text-4 mb-1" />
                  <p className="text-[9px] text-text-4">Secure Checkout</p>
                </div>
                <div className="text-center">
                  <Truck size={16} className="mx-auto text-text-4 mb-1" />
                  <p className="text-[9px] text-text-4">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <Package size={16} className="mx-auto text-text-4 mb-1" />
                  <p className="text-[9px] text-text-4">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upsell Section */}
        {upsellProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-syne font-bold text-xl mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upsellProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
