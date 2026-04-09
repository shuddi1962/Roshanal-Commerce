"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Heart, Star, MapPin, Check, Truck } from "lucide-react";
import { useCurrencyStore } from "@/store/currency-store";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import type { Product } from "@/types";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const { formatPrice, convert } = useCurrencyStore();
  const { addItem } = useCartStore();
  const { toggleWishlist } = useUIStore();

  if (!product) return null;

  const price = convert(product.regularPrice);
  const comparePrice = product.salePrice ? convert(product.salePrice) : null;
  const displayPrice = comparePrice || price;
  const originalPrice = comparePrice ? price : null;
  const discount = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-soft transition-colors"
            >
              <X size={18} className="text-text-2" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square bg-off-white flex items-center justify-center p-8">
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}
                <div className="text-text-4 text-sm text-center">
                  {product.images?.[0]?.alt || product.name}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col">
                {/* Brand & Category */}
                <div className="flex items-center gap-2 mb-2">
                  {product.brand && (
                    <span className="text-[10px] bg-blue/10 text-blue font-semibold px-2 py-0.5 rounded-full">{product.brand.name}</span>
                  )}
                  <span className="text-[10px] text-text-4">{product.category.name}</span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-text-1 leading-snug mb-2">{product.name}</h2>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s <= Math.round(product.rating!) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-3">({product.reviewCount || 0} reviews)</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-text-1">{formatPrice(displayPrice)}</span>
                  {originalPrice && (
                    <span className="text-sm text-text-4 line-through">{formatPrice(originalPrice)}</span>
                  )}
                </div>

                {/* Short description */}
                <p className="text-sm text-text-3 leading-relaxed mb-4 line-clamp-3">
                  {product.shortDescription || "Premium quality product from Roshanal Global. Available for immediate delivery."}
                </p>

                {/* Stock status */}
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-success" />
                    <span className="text-success font-medium">In Stock</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-3">
                    <Truck size={14} />
                    <span>Ships within 24hrs</span>
                  </div>
                </div>

                {/* Location availability */}
                {product.inventory && product.inventory.length > 0 && (
                  <div className="mb-4 p-3 bg-off-white rounded-xl">
                    <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider mb-2">Available at</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.inventory.map((loc) => (
                        <span key={loc.locationId} className="flex items-center gap-1 text-[11px] text-text-2 bg-white px-2 py-1 rounded-lg border border-border">
                          <MapPin size={10} className="text-blue" />
                          {loc.locationName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-off-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-off-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-10 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { setWishlisted(!wishlisted); toggleWishlist(product.id); }}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                      wishlisted ? "bg-red/10 border-red/30 text-red" : "border-border text-text-4 hover:text-red hover:border-red/30"
                    }`}
                  >
                    <Heart size={16} className={wishlisted ? "fill-red" : ""} />
                  </button>
                </div>

                {/* View full details link */}
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="mt-3 text-center text-xs text-blue hover:underline font-medium"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
