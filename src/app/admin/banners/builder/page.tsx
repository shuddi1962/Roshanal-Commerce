"use client";

import { useState, useEffect } from "react";
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
  Search,
  Package,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import HeroSlider, { type BannerTransition, type HeroSlide } from "@/components/banner/hero-slider";
import { insforge } from "@/lib/insforge";

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

interface DBProduct {
  id: string;
  name: string;
  images?: string;
  regular_price?: number;
  sale_price?: number;
}

const gradientPresets = [
  "from-navy via-blue-900 to-blue-800",
  "from-blue-900 via-navy to-blue-800",
  "from-navy via-blue-800 to-navy",
  "from-red-900 via-red-800 to-red-700",
  "from-emerald-900 via-emerald-800 to-emerald-700",
  "from-purple-900 via-purple-800 to-purple-700",
  "from-amber-900 via-amber-800 to-amber-700",
  "from-slate-900 via-slate-800 to-slate-700",
];

const aiPromptTemplates = [
  "Flash sale banner with urgency countdown and bold pricing",
  "New arrivals showcase with premium product photography",
  "Holiday seasonal promo with festive colors and discounts",
  "Category spotlight highlighting top products",
  "Free shipping promotion with minimal clean design",
  "Bundle deal banner with grouped product display",
];

export default function BannerBuilderPage() {
  const [selectedTransition, setSelectedTransition] = useState<BannerTransition>("fade");
  const [interval, setInterval] = useState(6000);
  const [autoPlay, setAutoPlay] = useState(true);
  const [slides, setSlides] = useState(demoSlides);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [creationMode, setCreationMode] = useState<"manual" | "upload" | "ai">("manual");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Upload mode
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Product selection for AI/manual
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<DBProduct[]>([]);
  const [showProductPicker, setShowProductPicker] = useState(false);

  // AI mode
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(gradientPresets[0]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await insforge.database.from("products").select("id,name,images,regular_price,sale_price").limit(100);
      if (data) setProducts(data);
    } catch (e) {
      console.error("Failed to load products:", e);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (file: File) => {
    const base64 = await fileToBase64(file);
    setUploadedImage(base64);
    setSlides([...slides, {
      id: String(Date.now()),
      title: file.name.replace(/\.[^.]+$/, ""),
      subtitle: "Custom uploaded banner",
      cta: "Shop Now",
      ctaLink: "/shop",
      gradient: "from-navy to-blue-900",
      image: base64,
    }]);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = { slides, transition: selectedTransition, interval, autoPlay };
      const { data: existing } = await insforge.database.from("settings").select("*").eq("key", "banner_builder");
      if (existing && existing.length > 0) {
        await insforge.database.from("settings").update({ value: JSON.stringify(payload), updated_at: new Date().toISOString() }).eq("key", "banner_builder");
      } else {
        await insforge.database.from("settings").insert({ key: "banner_builder", value: JSON.stringify(payload) });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save:", e);
      alert("Failed to save banner configuration.");
    } finally {
      setSaving(false);
    }
  };

  const generateProductBanner = () => {
    if (selectedProducts.length === 0) return;
    setAiGenerating(true);
    setTimeout(() => {
      const prodNames = selectedProducts.map(p => p.name).join(", ");
      const firstProduct = selectedProducts[0];
      const price = firstProduct.sale_price || firstProduct.regular_price;
      let images: string[] = [];
      try {
        if (firstProduct.images) images = JSON.parse(firstProduct.images);
      } catch { /* ignore */ }
      const newSlide: HeroSlide = {
        id: String(Date.now()),
        title: selectedProducts.length === 1 ? firstProduct.name : `${selectedProducts.length} Products Bundle Deal`,
        subtitle: selectedProducts.length === 1
          ? `Now ${price ? "₦" + Number(price).toLocaleString() : "available"} — ${aiPrompt || "Limited time offer!"}`
          : `Featuring: ${prodNames.slice(0, 80)}${prodNames.length > 80 ? "..." : ""}`,
        cta: "Shop Now",
        ctaLink: "/shop",
        gradient: selectedGradient,
        image: images.length > 0 ? images[0] : undefined,
      };
      setSlides([...slides, newSlide]);
      setAiGenerating(false);
      setSelectedProducts([]);
      setAiPrompt("");
    }, 1500);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

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
          <Button size="sm" onClick={handleSaveAll} disabled={saving}>
            {saving ? <Loader2 size={14} className="mr-1 animate-spin" /> : saved ? <Check size={14} className="mr-1" /> : <Save size={14} className="mr-1" />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
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
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { mode: "manual" as const, label: "Manual", icon: Palette },
                  { mode: "upload" as const, label: "Upload", icon: Upload },
                  { mode: "ai" as const, label: "AI Product", icon: Sparkles },
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

              {/* Upload Mode */}
              {creationMode === "upload" && (
                <div className="space-y-3">
                  <label className="block w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-blue/50 hover:bg-blue-50/30 transition-all">
                    <Upload size={24} className="mx-auto text-text-4 mb-2" />
                    <p className="text-xs font-semibold text-text-2">Click to upload banner image</p>
                    <p className="text-[10px] text-text-4 mt-1">PNG, JPG, WebP — max 5MB</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                  </label>
                  {uploadedImage && (
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover" />
                      <button onClick={() => setUploadedImage(null)} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70">
                        <X size={12} />
                      </button>
                      <p className="text-[10px] text-green-600 font-semibold p-2 bg-green-50">Added to slides</p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Product Banner Mode */}
              {creationMode === "ai" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold text-text-2 mb-1 block">Select Products</label>
                    <button onClick={() => setShowProductPicker(true)} className="w-full h-9 px-3 rounded-lg border border-border text-xs text-left text-text-3 hover:border-blue/50 flex items-center gap-2">
                      <Package size={12} />
                      {selectedProducts.length > 0 ? `${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""} selected` : "Choose products for banner..."}
                    </button>
                    {selectedProducts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedProducts.map(p => (
                          <span key={p.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue text-[10px] rounded-full font-medium">
                            {p.name.slice(0, 20)}{p.name.length > 20 ? "..." : ""}
                            <button onClick={() => setSelectedProducts(selectedProducts.filter(sp => sp.id !== p.id))}><X size={8} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-text-2 mb-1 block">Banner Style / Prompt</label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe the banner style you want..."
                      className="w-full h-16 px-3 py-2 rounded-lg border border-border text-xs resize-none focus:outline-none focus:border-blue"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {aiPromptTemplates.slice(0, 3).map(t => (
                        <button key={t} onClick={() => setAiPrompt(t)} className="text-[9px] px-2 py-0.5 bg-off-white rounded-full text-text-3 hover:bg-blue-50 hover:text-blue">{t.slice(0, 30)}...</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-text-2 mb-1 block">Background Gradient</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {gradientPresets.map((g) => (
                        <button key={g} onClick={() => setSelectedGradient(g)} className={`h-8 rounded-lg bg-gradient-to-r ${g} border-2 transition-all ${selectedGradient === g ? "border-white ring-2 ring-blue" : "border-transparent"}`} />
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="w-full gap-2" onClick={generateProductBanner} disabled={selectedProducts.length === 0 || aiGenerating}>
                    {aiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {aiGenerating ? "Generating Banner..." : "Generate Product Banner"}
                  </Button>
                </div>
              )}

              {/* Manual Mode Hint */}
              {creationMode === "manual" && (
                <p className="text-[10px] text-text-4">Edit slides directly in the Slide Manager below. Add slides, change text, CTA links, and gradients.</p>
              )}
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
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-text-4 shrink-0">BG:</span>
                          {gradientPresets.slice(0, 6).map(g => (
                            <button key={g} onClick={() => { const newSlides = [...slides]; newSlides[index] = { ...slide, gradient: g }; setSlides(newSlides); }}
                              className={`w-5 h-5 rounded bg-gradient-to-r ${g} border ${slide.gradient === g ? "ring-1 ring-blue border-white" : "border-transparent"}`} />
                          ))}
                          <label className="ml-1 cursor-pointer">
                            <ImageIcon size={12} className="text-text-4 hover:text-blue" />
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const b64 = await fileToBase64(e.target.files[0]);
                                const newSlides = [...slides];
                                newSlides[index] = { ...slide, image: b64 };
                                setSlides(newSlides);
                              }
                            }} />
                          </label>
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

    {/* Product Picker Modal */}
    {showProductPicker && (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowProductPicker(false)}>
        <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-syne font-bold text-sm">Select Products for Banner</h3>
            <button onClick={() => setShowProductPicker(false)} className="text-text-4 hover:text-text-2"><X size={16} /></button>
          </div>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
              <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredProducts.length > 0 ? filteredProducts.map(p => {
              const isSelected = selectedProducts.some(sp => sp.id === p.id);
              let thumb = "";
              try { if (p.images) { const imgs = JSON.parse(p.images); if (imgs[0]) thumb = imgs[0]; } } catch { /* ignore */ }
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (isSelected) setSelectedProducts(selectedProducts.filter(sp => sp.id !== p.id));
                    else setSelectedProducts([...selectedProducts, p]);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${isSelected ? "bg-blue-50 border border-blue/30" : "hover:bg-off-white border border-transparent"}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-off-white shrink-0 overflow-hidden flex items-center justify-center">
                    {thumb ? <img src={thumb} alt={p.name} className="w-full h-full object-cover" /> : <Package size={16} className="text-text-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-1 truncate">{p.name}</p>
                    {p.regular_price && <p className="text-[10px] text-text-4">₦{Number(p.regular_price).toLocaleString()}</p>}
                  </div>
                  {isSelected && <Check size={14} className="text-blue shrink-0" />}
                </button>
              );
            }) : (
              <p className="text-center text-sm text-text-4 py-8">No products found</p>
            )}
          </div>
          <div className="flex items-center justify-between p-4 border-t border-border">
            <span className="text-xs text-text-4">{selectedProducts.length} selected</span>
            <Button size="sm" onClick={() => setShowProductPicker(false)}>Done</Button>
          </div>
        </div>
      </div>
    )}
    </AdminShell>
  );
}
