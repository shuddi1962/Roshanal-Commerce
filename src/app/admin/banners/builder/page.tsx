"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  Sparkles,
  Monitor,
  Smartphone,
  Clock,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import HeroSlider, { type BannerTransition, type HeroSlide } from "@/components/banner/hero-slider";

const allTransitions: { value: BannerTransition; label: string; description: string }[] = [
  { value: "fade", label: "Fade", description: "Smooth opacity crossfade between slides" },
  { value: "slide-left", label: "Slide Left", description: "Slides enter from right, exit to left" },
  { value: "slide-right", label: "Slide Right", description: "Slides enter from left, exit to right" },
  { value: "slide-up", label: "Slide Up", description: "Slides enter from bottom, exit upward" },
  { value: "slide-down", label: "Slide Down", description: "Slides enter from top, exit downward" },
  { value: "zoom-in", label: "Zoom In", description: "New slide zooms in from smaller size" },
  { value: "zoom-out", label: "Zoom Out", description: "New slide zooms in from larger size" },
  { value: "flip-horizontal", label: "Flip Horizontal", description: "3D card flip on Y-axis" },
  { value: "flip-vertical", label: "Flip Vertical", description: "3D card flip on X-axis" },
  { value: "rotate", label: "Rotate", description: "Slides rotate with slight scale effect" },
  { value: "blur", label: "Blur", description: "Gaussian blur transition between slides" },
  { value: "swipe", label: "Swipe", description: "Fast swipe with subtle skew effect" },
  { value: "curtain", label: "Curtain", description: "Curtain reveal from one side" },
  { value: "bounce", label: "Bounce", description: "Spring-based bouncy entrance" },
  { value: "elastic", label: "Elastic", description: "Elastic spring with overshoot" },
];

const demoSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Professional Security Systems",
    subtitle: "Enterprise-Grade CCTV, Fire Alarm & Access Control",
    cta: "Shop Security",
    ctaLink: "/category/surveillance",
    gradient: "from-navy via-blue-900 to-blue-800",
  },
  {
    id: "2",
    title: "Boat Building & Marine Solutions",
    subtitle: "Custom Vessel Design, Marine Engines & Accessories",
    cta: "Explore Marine",
    ctaLink: "/services/boat-building",
    gradient: "from-blue-900 via-navy to-blue-800",
  },
  {
    id: "3",
    title: "Kitchen Installation Services",
    subtitle: "Indoor, Outdoor & Commercial Kitchen Solutions",
    cta: "Get a Quote",
    ctaLink: "/services/kitchen-installation",
    gradient: "from-navy via-blue-800 to-navy",
  },
];

const bannerSizes = [
  { name: "Hero", w: 1920, h: 600, checked: true },
  { name: "Category", w: 1200, h: 400, checked: false },
  { name: "Popup", w: 800, h: 500, checked: false },
  { name: "Square (Social)", w: 1080, h: 1080, checked: false },
  { name: "Portrait (Stories)", w: 1080, h: 1920, checked: false },
  { name: "Landscape (Social)", w: 1200, h: 628, checked: false },
  { name: "Email Header", w: 600, h: 200, checked: false },
  { name: "Product Card", w: 400, h: 300, checked: false },
];

export default function BannerBuilderPage() {
  const [selectedTransition, setSelectedTransition] = useState<BannerTransition>("fade");
  const [interval, setInterval] = useState(6000);
  const [autoPlay, setAutoPlay] = useState(true);
  const [slides, setSlides] = useState(demoSlides);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [creationMode, setCreationMode] = useState<"manual" | "upload" | "ai">("manual");

  return (
    <AdminShell title="Banner Builder" subtitle="Create and manage banners">
    <div>
      {/* Top Bar */}
      <div className="bg-white border-b border-border h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-text-3 hover:text-text-1">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-syne font-bold text-sm text-text-1">Banner Builder</h1>
            <p className="text-[10px] text-text-4">Create and manage hero banners with transition effects</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye size={14} className="mr-1" /> Preview
          </Button>
          <Button size="sm">
            <Save size={14} className="mr-1" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Settings */}
          <div className="space-y-6">
            {/* Creation Mode */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-syne font-bold text-sm mb-3">Creation Method</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: "manual" as const, label: "Manual", icon: Palette },
                  { mode: "upload" as const, label: "Upload", icon: Upload },
                  { mode: "ai" as const, label: "AI Generate", icon: Sparkles },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.mode}
                      onClick={() => setCreationMode(m.mode)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        creationMode === m.mode
                          ? "border-blue bg-blue-50"
                          : "border-border hover:border-blue/50"
                      }`}
                    >
                      <Icon size={18} className={`mx-auto mb-1 ${creationMode === m.mode ? "text-blue" : "text-text-4"}`} />
                      <span className="text-[10px] font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transition Selector */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-syne font-bold text-sm mb-1">Slide Transition</h3>
              <p className="text-[10px] text-text-4 mb-3">Choose how slides animate between each other</p>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {allTransitions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTransition(t.value)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTransition === t.value
                        ? "border-blue bg-blue-50"
                        : "border-border hover:border-blue/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-syne font-bold text-xs">{t.label}</span>
                      {selectedTransition === t.value && (
                        <span className="text-[9px] bg-blue text-white px-1.5 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-4 mt-0.5">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-syne font-bold text-sm mb-3 flex items-center gap-2">
                <Clock size={14} /> Timing
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Slide Duration (ms)</label>
                  <input
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value))}
                    min={2000}
                    max={15000}
                    step={500}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border focus:outline-none focus:border-blue"
                  />
                  <p className="text-[10px] text-text-4 mt-1">{interval / 1000} seconds per slide</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-text-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="rounded"
                  />
                  Auto-play slides
                </label>
              </div>
            </div>

            {/* Banner Sizes */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-syne font-bold text-sm mb-3 flex items-center gap-2">
                <ImageIcon size={14} /> Sizes to Generate
              </h3>
              <div className="space-y-2">
                {bannerSizes.map((size) => (
                  <label key={size.name} className="flex items-center justify-between text-xs text-text-2 cursor-pointer p-2 hover:bg-off-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={size.checked} className="rounded" />
                      {size.name}
                    </div>
                    <span className="text-[10px] text-text-4 font-mono">{size.w}x{size.h}</span>
                  </label>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <p className="text-[10px] text-text-4 mb-1">Custom Size</p>
                  <div className="flex items-center gap-2">
                    <input placeholder="W" className="w-16 h-7 px-2 text-[10px] rounded border border-border" />
                    <span className="text-text-4 text-xs">x</span>
                    <input placeholder="H" className="w-16 h-7 px-2 text-[10px] rounded border border-border" />
                    <span className="text-[10px] text-text-4">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center + Right: Preview & Slide Manager */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Preview */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-sm">Live Preview</h3>
                <div className="flex items-center gap-1 bg-off-white rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Monitor size={14} className={previewMode === "desktop" ? "text-blue" : "text-text-4"} />
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Smartphone size={14} className={previewMode === "mobile" ? "text-blue" : "text-text-4"} />
                  </button>
                </div>
              </div>
              <div className={`mx-auto transition-all ${previewMode === "mobile" ? "max-w-[375px]" : "w-full"}`}>
                <HeroSlider
                  slides={slides}
                  transition={selectedTransition}
                  interval={interval}
                  autoPlay={autoPlay}
                  height={previewMode === "mobile" ? "280px" : "360px"}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-[10px] text-text-4">
                  Transition: <strong className="text-blue">{allTransitions.find((t) => t.value === selectedTransition)?.label}</strong>
                </span>
                <span className="text-text-4">·</span>
                <span className="text-[10px] text-text-4">{interval / 1000}s interval</span>
                <span className="text-text-4">·</span>
                <span className="text-[10px] text-text-4">{slides.length} slides</span>
              </div>
            </div>

            {/* Slide Manager */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-sm">Slides ({slides.length})</h3>
                <Button size="sm" variant="outline" onClick={() => setSlides([...slides, {
                  id: String(slides.length + 1),
                  title: "New Slide",
                  subtitle: "Edit this slide content",
                  cta: "Shop Now",
                  ctaLink: "/shop",
                  gradient: "from-navy to-blue-900",
                }])}>
                  <Plus size={14} className="mr-1" /> Add Slide
                </Button>
              </div>
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="border border-border rounded-xl p-4 hover:border-blue/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <button className="mt-2 text-text-4 cursor-grab">
                        <GripVertical size={16} />
                      </button>
                      <div className="w-24 h-16 rounded-lg bg-gradient-to-r shrink-0 flex items-center justify-center relative overflow-hidden"
                        style={{ background: `linear-gradient(to right, var(--navy), var(--blue))` }}
                      >
                        <span className="text-white text-[8px] font-syne font-bold">Slide {index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          value={slide.title}
                          onChange={(e) => {
                            const newSlides = [...slides];
                            newSlides[index] = { ...slide, title: e.target.value };
                            setSlides(newSlides);
                          }}
                          className="w-full h-8 px-2 text-xs font-syne font-bold rounded border border-border focus:outline-none focus:border-blue"
                        />
                        <input
                          value={slide.subtitle}
                          onChange={(e) => {
                            const newSlides = [...slides];
                            newSlides[index] = { ...slide, subtitle: e.target.value };
                            setSlides(newSlides);
                          }}
                          className="w-full h-8 px-2 text-[10px] rounded border border-border focus:outline-none focus:border-blue"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={slide.cta}
                            onChange={(e) => {
                              const newSlides = [...slides];
                              newSlides[index] = { ...slide, cta: e.target.value };
                              setSlides(newSlides);
                            }}
                            placeholder="CTA Text"
                            className="h-7 px-2 text-[10px] rounded border border-border focus:outline-none focus:border-blue"
                          />
                          <input
                            value={slide.ctaLink}
                            onChange={(e) => {
                              const newSlides = [...slides];
                              newSlides[index] = { ...slide, ctaLink: e.target.value };
                              setSlides(newSlides);
                            }}
                            placeholder="CTA Link"
                            className="h-7 px-2 text-[10px] rounded border border-border focus:outline-none focus:border-blue font-mono"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setSlides(slides.filter((_, i) => i !== index))}
                        className="text-text-4 hover:text-red transition-colors p-1"
                        disabled={slides.length <= 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminShell>
  );
}
