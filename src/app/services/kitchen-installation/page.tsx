"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChefHat,
  ArrowRight,
  ChevronRight,
  Check,
  Phone,
  Calendar,
  Flame,
  Snowflake,
  Sun,
  Upload,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const kitchenTypes = [
  {
    id: "indoor",
    name: "Indoor Kitchen",
    icon: Snowflake,
    description: "Complete indoor kitchen design, installation & renovation for homes, apartments, and commercial spaces.",
    features: ["Custom cabinetry", "Countertop installation", "Appliance fitting", "Plumbing & electrical", "Ventilation & extraction", "Tiling & backsplash"],
    startingPrice: 2500000,
  },
  {
    id: "outdoor",
    name: "Outdoor Kitchen",
    icon: Sun,
    description: "Weatherproof outdoor cooking spaces — BBQ islands, poolside kitchens, patio setups, and garden kitchens.",
    features: ["BBQ island construction", "Weatherproof materials", "Outdoor countertops", "Built-in grills", "Outdoor sinks & prep areas", "Lighting & cover"],
    startingPrice: 3500000,
  },
  {
    id: "commercial",
    name: "Commercial/Cooking",
    icon: Flame,
    description: "Industrial and commercial kitchen installations for restaurants, hotels, canteens, event centers, and catering businesses.",
    features: ["Commercial-grade equipment", "Stainless steel worktops", "Industrial ventilation", "Fire suppression systems", "Walk-in coolers", "Compliance & certification"],
    startingPrice: 8000000,
  },
];

const processSteps = [
  { step: 1, title: "Consultation & Brief", desc: "Tell us your vision — we assess your space, needs, and budget" },
  { step: 2, title: "Design & 3D Render", desc: "Our team creates detailed designs with 3D visualization of your kitchen" },
  { step: 3, title: "Quote & Deposit", desc: "Transparent pricing — pay a deposit to secure your project slot" },
  { step: 4, title: "Installation", desc: "Our field team executes with precision and quality materials" },
  { step: 5, title: "Inspection & Handover", desc: "Final walkthrough, quality check, and handover with warranty" },
];

const pastKitchens = [
  { name: "Modern L-Shape Kitchen — GRA, Port Harcourt", type: "indoor", year: "2025" },
  { name: "BBQ Island & Outdoor Bar — Lekki, Lagos", type: "outdoor", year: "2025" },
  { name: "Hotel Restaurant Kitchen — Owerri", type: "commercial", year: "2024" },
  { name: "Luxury Open-Plan Kitchen — Abuja", type: "indoor", year: "2024" },
  { name: "Rooftop Grill Setup — Victoria Island, Lagos", type: "outdoor", year: "2024" },
  { name: "School Canteen Kitchen — Uyo", type: "commercial", year: "2023" },
];

export default function KitchenInstallationPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-800 via-red-900 to-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-80 h-80 border border-white/20 rounded-full" />
          <div className="absolute bottom-10 left-20 w-48 h-48 border border-white/10 rounded-full" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 relative">
          <div className="flex items-center gap-2 text-red-300 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Kitchen Installation</span>
          </div>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/10 border border-white/20 text-white">
              <ChefHat size={12} className="mr-1" /> Indoor | Outdoor | Commercial
            </Badge>
            <h1 className="font-syne font-black text-4xl lg:text-5xl text-white leading-tight">
              Kitchen Installation Services
            </h1>
            <p className="text-white/60 text-lg mt-4 leading-relaxed">
              From modern indoor kitchens to outdoor BBQ islands and full commercial cooking facilities —
              we design, supply, and install complete kitchen solutions tailored to your space and needs.
            </p>
            <div className="flex gap-3 mt-8">
              <Button variant="cta" size="lg" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
                Book Consultation <ArrowRight size={16} className="ml-1" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Phone size={16} className="mr-2" /> Call Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Kitchen Types */}
      <section className="py-12">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">What We Install</h2>
            <p className="text-text-3 text-sm mt-2">Choose your kitchen type to explore options and get started</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {kitchenTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`text-left p-6 rounded-2xl border-2 transition-all ${
                    selectedType === type.id
                      ? "border-red bg-red-50 shadow-lg"
                      : "border-border bg-white hover:border-red/30 hover:shadow-md"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    selectedType === type.id ? "bg-red text-white" : "bg-off-white text-text-4"
                  } transition-colors`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-syne font-bold text-xl text-text-1">{type.name}</h3>
                  <p className="text-sm text-text-3 mt-2 leading-relaxed">{type.description}</p>
                  <ul className="mt-4 space-y-2">
                    {type.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-text-2">
                        <Check size={12} className="text-success shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-xs text-text-4">Starting from</p>
                    <p className="font-syne font-bold text-xl text-red">₦{type.startingPrice.toLocaleString()}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">How It Works</h2>
            <p className="text-text-3 text-sm mt-2">Our streamlined process from consultation to handover</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {processSteps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-off-white rounded-xl p-5 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-red text-white font-syne font-bold text-sm flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-syne font-bold text-sm">{s.title}</h3>
                  <p className="text-xs text-text-3 mt-2">{s.desc}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <ArrowRight size={16} className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-text-4 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — Past Kitchens */}
      <section className="py-12">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">Our Kitchen Portfolio</h2>
            <p className="text-text-3 text-sm mt-2">Browse our past installations — you can also upload your inspiration images</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastKitchens.map((kitchen, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-red-50 to-off-white flex items-center justify-center">
                  <ChefHat size={40} className="text-red/20 group-hover:text-red/40 transition-colors" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">{kitchen.year}</Badge>
                    <Badge variant={kitchen.type === "indoor" ? "default" : kitchen.type === "outdoor" ? "success" : "warning"} className="text-[10px] capitalize">
                      {kitchen.type}
                    </Badge>
                  </div>
                  <h3 className="font-syne font-bold text-sm text-text-1">{kitchen.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Your Images */}
          <div className="mt-6 border-2 border-dashed border-border rounded-xl p-8 text-center bg-white">
            <Upload size={32} className="text-text-4 mx-auto mb-3" />
            <h3 className="font-syne font-bold text-sm text-text-1">Have Inspiration Photos?</h3>
            <p className="text-xs text-text-3 mt-1">Upload your own kitchen images or inspiration photos for your project</p>
            <Button variant="outline" className="mt-4">
              <Upload size={14} className="mr-2" /> Upload Images
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">Book a Kitchen Consultation</h2>
            <p className="text-text-3 text-sm mt-2">Fill in the details and our team will reach out within 24 hours</p>
          </div>
          <div className="bg-off-white rounded-2xl p-6 lg:p-8 border border-border">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Full Name</label>
                <input className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue" placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Email</label>
                <input type="email" className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Phone Number</label>
                <input type="tel" className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue" placeholder="+234..." />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Kitchen Type</label>
                <select
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue"
                >
                  <option value="">Select type</option>
                  <option value="indoor">Indoor Kitchen</option>
                  <option value="outdoor">Outdoor Kitchen / BBQ</option>
                  <option value="commercial">Commercial / Restaurant</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-text-2 mb-1 block">Location / Address</label>
                <input className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue" placeholder="Where is the installation location?" />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Preferred Date</label>
                <input type="date" className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Budget Range</label>
                <select className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue">
                  <option>Select budget</option>
                  <option>Under ₦3M</option>
                  <option>₦3M – ₦5M</option>
                  <option>₦5M – ₦10M</option>
                  <option>₦10M – ₦20M</option>
                  <option>₦20M+</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-text-2 mb-1 block">Additional Notes</label>
                <textarea className="w-full h-24 px-3 py-2 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue resize-none" placeholder="Describe your ideal kitchen, any inspiration references, special requirements..." />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="cta" size="lg" className="flex-1">
                <Calendar size={16} className="mr-2" /> Book Consultation
              </Button>
              <Button variant="outline" size="lg" className="flex items-center justify-center gap-2">
                <Phone size={16} /> Call Us Direct
              </Button>
              <Button variant="outline" size="lg" className="flex items-center justify-center gap-2">
                <MessageSquare size={16} /> WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance */}
      <section className="py-10 bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="max-w-[1440px] mx-auto px-4 text-center">
          <ChefHat size={40} className="mx-auto mb-4 text-red-300" />
          <h2 className="font-syne font-bold text-2xl">Kitchen Maintenance Plans</h2>
          <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">
            Keep your kitchen in top condition with our scheduled maintenance service.
            Available for all kitchen types — residential and commercial.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link
              href="/services/maintenance"
              className="inline-flex items-center justify-center rounded-lg text-sm font-syne font-bold h-12 px-8 bg-white text-red hover:bg-off-white shadow-lg transition-all"
            >
              View Maintenance Plans <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
