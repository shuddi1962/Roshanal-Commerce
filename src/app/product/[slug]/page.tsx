"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  GitCompareArrows,
  Share2,
  MapPin,
  Truck,
  Shield,
  Package,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Clock,
  MessageSquare,
  ThumbsUp,
  PlayCircle,
  AlertTriangle,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrencyStore } from "@/store/currency-store";
import { products } from "@/lib/demo-data";
import ProductCard from "@/components/product/product-card";

// Demo reviews
const demoReviews = [
  { id: "1", author: "Chidi Nwosu", rating: 5, date: "2026-03-12", title: "Excellent quality", body: "Very satisfied with the build quality. Arrived well packaged and works as described. Roshanal team was very helpful during setup.", helpful: 14, verified: true },
  { id: "2", author: "Amaka Obi", rating: 4, date: "2026-02-28", title: "Good product, fast shipping", body: "Product is solid. Delivery from Port Harcourt was within 2 days. Minor issue with instructions but customer support helped.", helpful: 8, verified: true },
  { id: "3", author: "Ibrahim Yusuf", rating: 5, date: "2026-02-15", title: "Professional grade equipment", body: "Using this for our office security system. Installation was straightforward. Highly recommend for commercial use.", helpful: 22, verified: true },
  { id: "4", author: "Grace Adeyemi", rating: 3, date: "2026-01-20", title: "Decent but pricey", body: "Quality is fine but a bit expensive compared to what you find in Computer Village. That said, the warranty support is worth the premium.", helpful: 5, verified: false },
];

const demoQA = [
  { id: "1", question: "Does this come with a warranty?", askedBy: "Customer", date: "2026-03-01", answer: "Yes, all our products come with a minimum 12-month manufacturer warranty. Extended warranty options are available at checkout.", answeredBy: "Roshanal Support", answerDate: "2026-03-01" },
  { id: "2", question: "Can I get this installed by your team?", askedBy: "Customer", date: "2026-02-20", answer: "Absolutely! We offer professional installation services across Port Harcourt, Lagos, and Abuja. Book a slot from the services page or add installation at checkout.", answeredBy: "Roshanal Support", answerDate: "2026-02-21" },
  { id: "3", question: "Is this compatible with existing systems?", askedBy: "Customer", date: "2026-02-10", answer: "Yes, this product follows industry standards and is compatible with most existing setups. Contact our tech team for specific compatibility questions.", answeredBy: "Roshanal Support", answerDate: "2026-02-10" },
];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug) || products[0];
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleWishlist, wishlistItems, toggleCompare } = useUIStore();
  const { formatPrice, currency } = useCurrencyStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "video" | "reviews" | "qa" | "shipping" | "warranty">("description");
  const [selectedBranch, setSelectedBranch] = useState("phc");
  const [reviewSort, setReviewSort] = useState<"newest" | "helpful" | "highest" | "lowest">("newest");

  const isOnSale = product.salePrice && product.salePrice < product.regularPrice;
  const discountPercent = isOnSale
    ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100)
    : 0;
  const displayPrice = isOnSale ? product.salePrice! : product.regularPrice;
  const isWishlisted = wishlistItems.includes(product.id);
  const totalStock = product.inventory.reduce((sum, loc) => sum + loc.quantity, 0);

  // Related products from same category
  const relatedProducts = products.filter((p) => p.category.id === product.category.id && p.id !== product.id).slice(0, 4);
  const upsellProducts = products.filter((p) => p.id !== product.id && p.regularPrice > product.regularPrice * 0.8).slice(0, 4);

  // Demo gallery images
  const galleryImages = [
    { id: "main", label: "Front View" },
    { id: "angle", label: "Angle View" },
    { id: "back", label: "Rear View" },
    { id: "box", label: "In Box" },
    { id: "detail", label: "Detail" },
  ];

  const tabs = [
    { key: "description" as const, label: "Description" },
    { key: "specs" as const, label: "Specifications" },
    { key: "video" as const, label: "Video" },
    { key: "reviews" as const, label: `Reviews (${demoReviews.length})` },
    { key: "qa" as const, label: `Q&A (${demoQA.length})` },
    { key: "shipping" as const, label: "Shipping" },
    { key: "warranty" as const, label: "Warranty" },
  ];

  const avgRating = demoReviews.reduce((sum, r) => sum + r.rating, 0) / demoReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: demoReviews.filter((r) => r.rating === stars).length,
    percent: (demoReviews.filter((r) => r.rating === stars).length / demoReviews.length) * 100,
  }));

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
            <Link href={`/category/${product.category.slug}`} className="hover:text-blue transition-colors">{product.category.name}</Link>
            <ChevronRight size={12} />
            <span className="text-text-2 font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Gallery */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl border border-border overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-off-white flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-white/80 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                    <span className="text-text-4 text-xs font-mono">{product.sku}</span>
                  </div>
                  <p className="text-sm text-text-3 font-syne font-bold">{galleryImages[selectedImage].label}</p>
                </div>
              </div>
              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 left-4">
                  <Badge variant="sale" className="text-sm px-3 py-1">
                    {product.saleBadge?.label || "SALE"} -{discountPercent}%
                  </Badge>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                {product.badges.filter(b => b.active && b.type !== "sale").map((badge) => (
                  <Badge key={badge.type} variant={badge.type as any} className="text-xs">
                    {badge.type.toUpperCase().replace("-", " ")}
                  </Badge>
                ))}
              </div>
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg">
                Hover to zoom
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                    selectedImage === idx ? "border-blue" : "border-border hover:border-blue/50"
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-off-white flex items-center justify-center">
                    <span className="text-[8px] text-text-4">{img.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-5">
            {/* Brand Card */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-off-white border border-border flex items-center justify-center">
                <span className="text-xs font-bold text-text-3">{product.brand.name.charAt(0)}</span>
              </div>
              <div>
                <Link href={`/brand/${product.brand.slug}`} className="text-xs font-syne font-bold text-blue hover:underline">
                  {product.brand.name}
                </Link>
                <p className="text-[10px] text-text-4">{product.brand.productCount} products</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                    isWishlisted ? "bg-red text-white border-red" : "border-border text-text-3 hover:border-red hover:text-red"
                  }`}
                >
                  <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => toggleCompare(product.id)}
                  className="w-9 h-9 rounded-lg border border-border text-text-3 hover:border-blue hover:text-blue flex items-center justify-center transition-colors"
                >
                  <GitCompareArrows size={16} />
                </button>
                <button className="w-9 h-9 rounded-lg border border-border text-text-3 hover:border-blue hover:text-blue flex items-center justify-center transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-syne font-bold text-2xl text-text-1 leading-tight">{product.name}</h1>
              <p className="text-sm text-text-3 mt-2">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                ))}
              </div>
              <span className="text-sm font-bold text-text-1">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-text-4">({product.reviewCount} reviews)</span>
              <span className="text-text-4">|</span>
              <span className="text-xs text-text-4">SKU: <span className="font-mono text-text-2">{product.sku}</span></span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-syne font-bold text-3xl text-text-1">{formatPrice(displayPrice)}</span>
                {isOnSale && (
                  <>
                    <span className="text-lg text-text-4 line-through">{formatPrice(product.regularPrice)}</span>
                    <Badge variant="sale" className="text-xs">Save {formatPrice(product.regularPrice - product.salePrice!)}</Badge>
                  </>
                )}
              </div>
              {currency !== "NGN" && (
                <p className="text-xs text-text-4 mt-1">≈ ₦{displayPrice.toLocaleString()}</p>
              )}
              {product.wholesalePrice && (
                <p className="text-xs text-blue mt-1">
                  Wholesale: {formatPrice(product.wholesalePrice)} (min. 10 units)
                </p>
              )}
            </div>

            {/* Multi-location Stock */}
            <div className="bg-white rounded-xl border border-border p-4">
              <h4 className="font-syne font-bold text-xs mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-blue" /> Stock by Location
              </h4>
              <div className="space-y-2">
                {product.inventory.map((loc) => (
                  <label
                    key={loc.locationId}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedBranch === loc.locationId
                        ? "border-blue bg-blue-50"
                        : "border-border hover:border-blue/30"
                    }`}
                    onClick={() => setSelectedBranch(loc.locationId)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="branch"
                        checked={selectedBranch === loc.locationId}
                        onChange={() => setSelectedBranch(loc.locationId)}
                        className="accent-blue"
                      />
                      <span className="text-xs font-semibold text-text-2">{loc.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        loc.quantity > loc.lowStockThreshold ? "bg-success" : loc.quantity > 0 ? "bg-yellow-500" : "bg-red"
                      }`} />
                      <span className="text-xs text-text-3">
                        {loc.quantity > 0 ? `${loc.quantity} in stock` : "Out of stock"}
                      </span>
                      {loc.quantity > 0 && loc.quantity <= loc.lowStockThreshold && (
                        <span className="text-[9px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">Low Stock</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-11 flex items-center justify-center text-text-3 hover:bg-off-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 h-11 text-center text-sm font-bold border-x border-border focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 flex items-center justify-center text-text-3 hover:bg-off-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                className="flex-1 h-11 font-syne font-bold"
                onClick={() => addItem(product, quantity, undefined, selectedBranch)}
                disabled={totalStock === 0}
              >
                <ShoppingCart size={16} className="mr-2" />
                {totalStock > 0 ? `Add to Cart — ${formatPrice(displayPrice * quantity)}` : "Out of Stock"}
              </Button>
            </div>

            {/* Buy Now */}
            <Button
              variant="outline"
              className="w-full h-11 font-syne font-bold"
              disabled={totalStock === 0}
              onClick={() => {
                addItem(product, quantity, undefined, selectedBranch);
                router.push("/checkout");
              }}
            >
              <Zap size={16} className="mr-2" /> Buy Now
            </Button>

            {/* Delivery Estimate */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-border p-3 text-center">
                <Truck size={18} className="mx-auto text-blue mb-1" />
                <p className="text-[10px] font-bold text-text-2">Free Delivery</p>
                <p className="text-[9px] text-text-4">Orders over ₦100k</p>
              </div>
              <div className="bg-white rounded-xl border border-border p-3 text-center">
                <RotateCcw size={18} className="mx-auto text-blue mb-1" />
                <p className="text-[10px] font-bold text-text-2">7-Day Returns</p>
                <p className="text-[9px] text-text-4">Easy return policy</p>
              </div>
              <div className="bg-white rounded-xl border border-border p-3 text-center">
                <Shield size={18} className="mx-auto text-blue mb-1" />
                <p className="text-[10px] font-bold text-text-2">Warranty</p>
                <p className="text-[9px] text-text-4">12-month coverage</p>
              </div>
            </div>

            {/* Delivery Estimate Box */}
            <div className="bg-white rounded-xl border border-border p-4">
              <h4 className="font-syne font-bold text-xs mb-2 flex items-center gap-2">
                <Clock size={14} className="text-blue" /> Estimated Delivery
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-3">Port Harcourt</span>
                  <span className="font-semibold text-success">1-2 business days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-3">Lagos / Abuja</span>
                  <span className="font-semibold text-text-2">2-4 business days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-3">Other States</span>
                  <span className="font-semibold text-text-2">3-7 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          {/* Tab Navigation */}
          <div className="border-b border-border overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-syne font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-blue text-blue"
                      : "border-transparent text-text-3 hover:text-text-1"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-2xl border border-t-0 border-border p-6">
            {/* Description */}
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h3 className="font-syne font-bold text-lg mb-3">Product Description</h3>
                <p className="text-sm text-text-2 leading-relaxed mb-4">{product.shortDescription}</p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-syne font-bold text-sm">Key Features</h4>
                    <ul className="space-y-2">
                      {["Professional-grade build quality", "Easy installation and setup", "Compatible with existing systems", "24/7 reliable operation", "Energy-efficient design", "Remote monitoring capable"].map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-text-2">
                          <Check size={14} className="text-success mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-syne font-bold text-sm">What&apos;s in the Box</h4>
                    <ul className="space-y-2">
                      {["1x Main unit", "1x Power adapter", "1x Mounting hardware kit", "1x Quick start guide", "1x Warranty card"].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-text-2">
                          <Package size={14} className="text-blue mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specs" && (
              <div>
                <h3 className="font-syne font-bold text-lg mb-4">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-0">
                  {[
                    ["Brand", product.brand.name],
                    ["Model", product.name],
                    ["SKU", product.sku],
                    ["Category", product.category.name],
                    ["Type", product.type],
                    ["Weight", "2.5 kg"],
                    ["Dimensions", "320 x 240 x 180 mm"],
                    ["Power", "12V DC / PoE"],
                    ["Operating Temp", "-30°C to 60°C"],
                    ["Certification", "CE, FCC, RoHS"],
                    ["Warranty", "12 months"],
                    ["Country of Origin", "China"],
                    ...(Object.entries(product.specifications || {})),
                  ].map(([key, value], idx) => (
                    <div key={key} className={`flex items-center py-2.5 px-3 text-sm ${idx % 2 === 0 ? "bg-off-white" : "bg-white"}`}>
                      <span className="w-[180px] text-text-3 font-semibold shrink-0">{key}</span>
                      <span className="text-text-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {activeTab === "video" && (
              <div className="text-center py-12">
                <div className="w-full max-w-2xl mx-auto aspect-video bg-navy rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle size={64} className="text-white/50 mx-auto mb-3" />
                    <p className="text-white/70 text-sm">Product video coming soon</p>
                    <p className="text-white/40 text-xs mt-1">Video reviews and demos will appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div>
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  {/* Summary */}
                  <div className="text-center">
                    <p className="font-syne font-bold text-5xl text-text-1">{avgRating.toFixed(1)}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < Math.floor(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                      ))}
                    </div>
                    <p className="text-xs text-text-4 mt-1">Based on {demoReviews.length} reviews</p>
                  </div>

                  {/* Distribution */}
                  <div className="space-y-1.5">
                    {ratingDistribution.map((d) => (
                      <div key={d.stars} className="flex items-center gap-2">
                        <span className="text-xs text-text-3 w-8">{d.stars} star</span>
                        <div className="flex-1 h-2 bg-off-white rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${d.percent}%` }} />
                        </div>
                        <span className="text-xs text-text-4 w-6">{d.count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Write Review */}
                  <div className="text-center">
                    <Button size="sm" className="font-syne font-bold">
                      <Star size={14} className="mr-1" /> Write a Review
                    </Button>
                    <p className="text-[10px] text-text-4 mt-2">Share your experience with this product</p>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <span className="text-xs text-text-3">{demoReviews.length} reviews</span>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as any)}
                    className="h-8 px-3 text-xs rounded-lg border border-border"
                  >
                    <option value="newest">Newest First</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {demoReviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue">{review.author.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-1">{review.author}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                                  ))}
                                </div>
                                {review.verified && (
                                  <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded">Verified Purchase</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-text-4">{review.date}</span>
                      </div>
                      <h5 className="font-syne font-bold text-sm mt-3">{review.title}</h5>
                      <p className="text-sm text-text-2 mt-1 leading-relaxed">{review.body}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button className="flex items-center gap-1 text-xs text-text-4 hover:text-blue transition-colors">
                          <ThumbsUp size={12} /> Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1 text-xs text-text-4 hover:text-blue transition-colors">
                          <MessageSquare size={12} /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Q&A */}
            {activeTab === "qa" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-syne font-bold text-lg">Questions & Answers</h3>
                  <Button size="sm" variant="outline">
                    <MessageSquare size={14} className="mr-1" /> Ask a Question
                  </Button>
                </div>
                <div className="space-y-4">
                  {demoQA.map((qa) => (
                    <div key={qa.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-blue bg-blue/10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">Q</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-text-1">{qa.question}</p>
                          <p className="text-[10px] text-text-4 mt-0.5">Asked by {qa.askedBy} on {qa.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mt-3 ml-10">
                        <span className="text-sm font-bold text-success bg-success/10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">A</span>
                        <div className="flex-1">
                          <p className="text-sm text-text-2 leading-relaxed">{qa.answer}</p>
                          <p className="text-[10px] text-text-4 mt-1">{qa.answeredBy} — {qa.answerDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping */}
            {activeTab === "shipping" && (
              <div>
                <h3 className="font-syne font-bold text-lg mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  {[
                    { zone: "Port Harcourt Metro", time: "Same day / Next day", cost: "Free over ₦50,000", icon: Zap },
                    { zone: "Rivers State", time: "1-2 business days", cost: "₦2,500", icon: Truck },
                    { zone: "Lagos / Abuja / Enugu", time: "2-4 business days", cost: "₦4,500", icon: Truck },
                    { zone: "Other Major Cities", time: "3-5 business days", cost: "₦6,000", icon: Package },
                    { zone: "Remote Areas", time: "5-7 business days", cost: "₦8,500", icon: MapPin },
                  ].map((zone) => {
                    const Icon = zone.icon;
                    return (
                      <div key={zone.zone} className="flex items-center gap-4 p-3 rounded-xl border border-border">
                        <Icon size={18} className="text-blue shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-text-1">{zone.zone}</p>
                          <p className="text-xs text-text-4">{zone.time}</p>
                        </div>
                        <span className="text-sm font-semibold text-text-2">{zone.cost}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                  <AlertTriangle size={14} className="text-blue mt-0.5 shrink-0" />
                  <p className="text-xs text-text-2">
                    Delivery times are estimates. Heavy or oversized items (boat engines, dredging equipment) may require special logistics. Contact us for a custom shipping quote.
                  </p>
                </div>
              </div>
            )}

            {/* Warranty */}
            {activeTab === "warranty" && (
              <div>
                <h3 className="font-syne font-bold text-lg mb-4">Warranty & Returns</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-syne font-bold text-sm flex items-center gap-2">
                      <Shield size={16} className="text-blue" /> Warranty Coverage
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "12-month manufacturer warranty included",
                        "Extended warranty available (24 or 36 months)",
                        "Covers manufacturing defects and component failure",
                        "Free repair or replacement within warranty period",
                        "Warranty valid at all Roshanal service centers",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-text-2">
                          <Check size={14} className="text-success mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-syne font-bold text-sm flex items-center gap-2">
                      <RotateCcw size={16} className="text-blue" /> Return Policy
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "7-day return window from delivery date",
                        "Item must be in original packaging",
                        "Free return shipping for defective items",
                        "Refund processed within 3-5 business days",
                        "Exchange available for different variant/model",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-text-2">
                          <Check size={14} className="text-success mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upsells — Frequently Bought Together */}
        {upsellProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-syne font-bold text-xl mb-6">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upsellProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-syne font-bold text-xl mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
