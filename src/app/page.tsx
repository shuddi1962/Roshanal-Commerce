"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import HeroSlider from "@/components/banner/hero-slider";
import type { HeroSlide } from "@/components/banner/hero-slider";
import {
  ArrowRight,
  Shield,
  Flame,
  Fingerprint,
  Sun,
  Wifi,
  Monitor,
  Anchor,
  Ship,
  HardHat,
  Shovel,
  ChefHat,
  Cog,
  Zap,
  Clock,
  Phone,
  Wrench,
  Truck,
  Headphones,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import {
  categories,
  brands,
  products,
  featuredProducts,
  saleProducts,
  trendingProducts,
  newArrivals,
  bestSellers,
} from "@/lib/demo-data";

const heroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Professional Security Systems",
    subtitle: "Enterprise-grade CCTV, fire alarm & access control solutions for businesses and homes.",
    cta: "Shop Security",
    ctaLink: "/shop",
    secondaryCta: "Get a Quote",
    secondaryCtaLink: "/quote",
    gradient: "from-navy via-blue-900 to-blue-800",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&h=800&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Boat Building & Marine Solutions",
    subtitle: "Custom vessel design, marine engines & accessories from top global brands.",
    cta: "Explore Marine",
    ctaLink: "/services/boat-building",
    secondaryCta: "View Engines",
    secondaryCtaLink: "/category/boat-engines",
    gradient: "from-blue-900 via-navy to-blue-800",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=800&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Kitchen Installation Services",
    subtitle: "Indoor, outdoor & commercial kitchen solutions. Professional installation nationwide.",
    cta: "Get a Quote",
    ctaLink: "/services/kitchen-installation",
    secondaryCta: "Our Services",
    secondaryCtaLink: "/services",
    gradient: "from-navy via-blue-800 to-navy",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=800&fit=crop&q=80",
  },
];

import type { LucideIcon } from "lucide-react";

const categoryData: { slug: string; icon: LucideIcon; image: string }[] = [
  { slug: "surveillance", icon: Shield, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop" },
  { slug: "fire-alarm", icon: Flame, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=300&fit=crop" },
  { slug: "access-control", icon: Fingerprint, image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&fit=crop" },
  { slug: "solar-systems", icon: Sun, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=300&fit=crop" },
  { slug: "networking", icon: Wifi, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=300&fit=crop" },
  { slug: "ict-equipment", icon: Monitor, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop" },
  { slug: "marine-accessories", icon: Anchor, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop" },
  { slug: "boat-engines", icon: Ship, image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=300&h=300&fit=crop" },
  { slug: "safety-equipment", icon: HardHat, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=300&fit=crop" },
  { slug: "dredging-equipment", icon: Shovel, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop" },
  { slug: "kitchen-equipment", icon: ChefHat, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop" },
  { slug: "ups-inverters", icon: Cog, image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=300&h=300&fit=crop" },
];

const productTabs = [
  { id: "trending", label: "Trending", products: trendingProducts },
  { id: "bestsellers", label: "Best Sellers", products: bestSellers },
  { id: "featured", label: "Featured", products: featuredProducts },
  { id: "new", label: "New Arrivals", products: newArrivals },
  { id: "sale", label: "On Sale", products: saleProducts },
];

const services = [
  { name: "CCTV Installation", slug: "cctv-installation", icon: Shield, desc: "Professional surveillance setup", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop" },
  { name: "Fire Alarm", slug: "fire-alarm", icon: Flame, desc: "Fire detection & safety systems", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop" },
  { name: "Access Control", slug: "access-control", icon: Fingerprint, desc: "Biometric & card access", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop" },
  { name: "Kitchen Installation", slug: "kitchen-installation", icon: ChefHat, desc: "Indoor, outdoor & commercial", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
  { name: "Boat Building", slug: "boat-building", icon: Ship, desc: "Custom marine vessel design", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop" },
  { name: "Dredging Services", slug: "dredging", icon: Shovel, desc: "Project-based dredging", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop" },
  { name: "Maintenance", slug: "maintenance", icon: Wrench, desc: "Equipment maintenance & repair", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop" },
  { name: "Consultation", slug: "consultation", icon: Phone, desc: "Expert technical consultation", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop" },
];

const trustFeatures = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₦100,000" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: Headphones, title: "24/7 Support", desc: "AI + human agents" },
  { icon: CreditCard, title: "Easy Returns", desc: "30-day return policy" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("featured");
  const currentTab = productTabs.find((t) => t.id === activeTab) || productTabs[2];

  return (
    <div>
      {/* Trust Bar */}
      <div className="bg-white border-b border-border">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trustFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-1">{f.title}</p>
                    <p className="text-[11px] text-text-4">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HERO SECTION - Full Width */}
      <section className="w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <HeroSlider
                slides={heroSlides}
                transition="fade"
                interval={6000}
                autoPlay
                showArrows
                showDots
                height="480px"
              />
            </div>

            {/* Mini Featured Cards */}
            <div className="hidden xl:flex flex-col gap-4 w-[280px]">
              {featuredProducts.slice(0, 2).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex-1 bg-white rounded-xl border border-border p-4 hover:shadow-medium transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-[90px] bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                      <Image
                        src={categoryData.find(c => c.slug === product.category.slug)?.image || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <h3 className="font-semibold text-xs text-text-1 line-clamp-2 leading-tight">{product.name}</h3>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-base text-blue">
                      ₦{(product.salePrice || product.regularPrice).toLocaleString()}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-text-4 line-through ml-2">
                        ₦{product.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SLIDER */}
      <section className="py-10">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-2xl text-text-1 tracking-tight">Shop by Category</h2>
              <p className="text-sm text-text-4 mt-1">Browse our wide range of products</p>
            </div>
            <Link href="/shop" className="text-sm text-blue font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-12 gap-3">
            {categories.map((cat) => {
              const catInfo = categoryData.find((c) => c.slug === cat.slug);
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group text-center"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-gray-100">
                    <Image
                      src={catInfo?.image || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop"}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition-colors" />
                  </div>
                  <p className="text-[11px] font-semibold text-text-2 line-clamp-2 leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-text-4">{cat.productCount} items</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT TABS */}
      <section className="py-10 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-2xl text-text-1 tracking-tight">Featured Products</h2>
            <Link href="/shop" className="text-sm text-blue font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Shop All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex gap-1 mb-6 overflow-x-auto hide-scrollbar pt-1">
            {productTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue text-white shadow-sm"
                    : "bg-gray-100 text-text-3 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(currentTab.products.length > 0 ? currentTab.products : featuredProducts).slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="py-10 border-y border-border">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <h2 className="font-bold text-xl text-text-1 mb-6 text-center tracking-tight">Trusted by Leading Brands</h2>
          <div className="overflow-hidden">
            <div className="flex animate-marquee gap-8 items-center">
              {[...brands, ...brands].map((brand, i) => (
                <Link
                  key={`${brand.id}-${i}`}
                  href={`/brands`}
                  className="shrink-0 w-[140px] h-[60px] bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:border-blue hover:shadow-soft transition-all px-4"
                >
                  <span className="font-bold text-sm text-text-3">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLASH SALE BANNER - Full Width Background Image */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&h=500&fit=crop&q=80"
          alt="Flash Sale"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-700/90 via-red-600/80 to-transparent" />
        <div className="relative w-full max-w-[1440px] mx-auto px-4 py-14 lg:py-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={20} className="text-yellow-300" />
              <span className="text-yellow-300 font-bold text-sm uppercase tracking-widest">
                Flash Sale
              </span>
            </div>
            <h2 className="font-bold text-3xl lg:text-5xl text-white tracking-tight leading-tight">Up to 40% Off Security Systems</h2>
            <p className="text-white/70 mt-3 text-base">
              Limited time offer on premium CCTV cameras, NVR systems, and accessories.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
                <Clock size={16} className="text-white" />
                <span className="font-mono text-sm text-white font-medium">03 : 14 : 52 : 07</span>
              </div>
              <Link href="/deals" className="text-sm font-semibold text-white hover:underline flex items-center gap-1">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-14 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl lg:text-3xl text-text-1 tracking-tight">Professional Services</h2>
            <p className="text-text-3 text-sm mt-2 max-w-md mx-auto">Expert installation, maintenance & consultation services across Nigeria and beyond</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group rounded-xl overflow-hidden relative h-[200px] md:h-[240px]"
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-sm text-white">{service.name}</h3>
                  <p className="text-[11px] text-white/60 mt-0.5">{service.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-300 group-hover:text-white transition-colors">
                    Learn More <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOAT ENGINES SPOTLIGHT */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=800&fit=crop&q=80"
          alt="Boat Engines"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative w-full max-w-[1440px] mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-bold text-2xl text-white tracking-tight">Boat Engines</h2>
              <p className="text-white/50 text-sm mt-1">Yamaha, Mercury, Suzuki & more — all horsepower ranges</p>
            </div>
            <Link href="/category/boat-engines" className="inline-flex items-center justify-center rounded-lg text-sm font-semibold h-10 px-5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
              View All <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products
              .filter((p) => p.category.slug === "boat-engines")
              .slice(0, 4)
              .map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 hover:bg-white/15 transition-all group"
                >
                  <div className="w-full aspect-[4/3] bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                    <Image
                      src="https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=300&fit=crop"
                      alt={product.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] text-blue-300">{product.brand.name}</p>
                  <h3 className="font-semibold text-sm text-white line-clamp-2 mt-1 leading-tight">{product.name}</h3>
                  <div className="mt-2">
                    <span className="font-bold text-sm text-white">
                      ₦{(product.salePrice || product.regularPrice).toLocaleString()}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-white/40 line-through ml-2">
                        ₦{product.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* PROMO SPLIT BANNERS */}
      <section className="py-6">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/services/boat-building" className="relative rounded-xl overflow-hidden h-[200px] md:h-[240px] group">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop"
                alt="Boat Building"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-8">
                <Ship size={28} className="text-blue-300 mb-2" />
                <h3 className="font-bold text-xl text-white">Custom Boat Building</h3>
                <p className="text-white/60 text-sm mt-1.5 max-w-[260px]">Design your dream vessel with 3D visualization.</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-300 group-hover:text-white transition-colors">
                  Start Design <ArrowRight size={14} />
                </span>
              </div>
            </Link>
            <Link href="/services/kitchen-installation" className="relative rounded-xl overflow-hidden h-[200px] md:h-[240px] group">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop"
                alt="Kitchen Installation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-8">
                <ChefHat size={28} className="text-red-300 mb-2" />
                <h3 className="font-bold text-xl text-white">Kitchen Installation</h3>
                <p className="text-white/60 text-sm mt-1.5 max-w-[260px]">Indoor, outdoor & commercial kitchen solutions.</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-red-300 group-hover:text-white transition-colors">
                  Book Consultation <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* MARINE ACCESSORIES */}
      <section className="py-10 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-text-1 tracking-tight">Marine Accessories</h2>
            <Link href="/shop" className="text-sm text-blue font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products
              .filter((p) => p.category.slug === "marine-accessories" || p.category.slug === "boat-engines")
              .slice(0, 5)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* SAFETY EQUIPMENT */}
      <section className="py-10">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-text-1 tracking-tight">Safety Equipment</h2>
            <Link href="/safety" className="text-sm text-blue font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter((p) => p.category.slug === "safety-equipment")
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA - Full Width with Image */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=600&fit=crop&q=80"
          alt="Newsletter"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-navy/90" />
        <div className="relative w-full max-w-[1440px] mx-auto px-4 py-16 text-center">
          <h2 className="font-bold text-2xl lg:text-3xl text-white tracking-tight">Join 50,000+ Professionals</h2>
          <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
            Get exclusive deals, new product alerts, and industry insights delivered weekly.
          </p>
          <div className="flex max-w-md mx-auto mt-6 gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue backdrop-blur-sm"
            />
            <Button variant="cta" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
