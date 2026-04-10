"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  GripVertical, Eye, EyeOff, Settings, ChevronUp, ChevronDown,
  Image, ShoppingBag, Layers, Star, Megaphone, Tag, Truck,
  Zap, Users, MessageCircle, Save, RotateCcw, Monitor, Smartphone,
} from "lucide-react";

interface HomepageSection {
  id: string;
  name: string;
  icon: typeof Image;
  enabled: boolean;
  order: number;
  settings?: Record<string, unknown>;
}

const defaultSections: HomepageSection[] = [
  { id: "hero", name: "Hero Slider", icon: Image, enabled: true, order: 0 },
  { id: "notice", name: "Notice / Promo Bar", icon: Megaphone, enabled: true, order: 1 },
  { id: "categories", name: "Category Grid", icon: Layers, enabled: true, order: 2 },
  { id: "featured", name: "Featured Products", icon: Star, enabled: true, order: 3 },
  { id: "flash-sale", name: "Flash Sale Countdown", icon: Zap, enabled: true, order: 4 },
  { id: "brands", name: "Brand Marquee", icon: Tag, enabled: true, order: 5 },
  { id: "new-arrivals", name: "New Arrivals", icon: ShoppingBag, enabled: true, order: 6 },
  { id: "promo-banners", name: "Promo Banners (2-col)", icon: Image, enabled: true, order: 7 },
  { id: "best-sellers", name: "Best Sellers", icon: Star, enabled: true, order: 8 },
  { id: "marine", name: "Marine & Safety Section", icon: Truck, enabled: true, order: 9 },
  { id: "boat-engines", name: "Boat Engines Showcase", icon: ShoppingBag, enabled: true, order: 10 },
  { id: "services", name: "Professional Services", icon: Users, enabled: true, order: 11 },
  { id: "testimonials", name: "Customer Testimonials", icon: MessageCircle, enabled: false, order: 12 },
  { id: "blog", name: "Latest Blog Posts", icon: Layers, enabled: false, order: 13 },
  { id: "newsletter", name: "Newsletter Signup", icon: Megaphone, enabled: true, order: 14 },
  { id: "recently-viewed", name: "Recently Viewed", icon: Eye, enabled: true, order: 15 },
];

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState(defaultSections);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleSection = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setHasChanges(true);
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    setSections((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      if (direction === "up" && idx > 0) {
        const temp = sorted[idx].order;
        sorted[idx].order = sorted[idx - 1].order;
        sorted[idx - 1].order = temp;
      } else if (direction === "down" && idx < sorted.length - 1) {
        const temp = sorted[idx].order;
        sorted[idx].order = sorted[idx + 1].order;
        sorted[idx + 1].order = temp;
      }
      return sorted;
    });
    setHasChanges(true);
  };

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <AdminShell title="Homepage Builder" subtitle="Show, hide, and reorder homepage sections">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-3">
            <span className="font-semibold text-text-1">{enabledCount}</span> of {sections.length} sections active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 rounded-md transition-colors ${previewMode === "desktop" ? "bg-blue text-white" : "text-text-4"}`}
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 rounded-md transition-colors ${previewMode === "mobile" ? "bg-blue text-white" : "text-text-4"}`}
            >
              <Smartphone size={14} />
            </button>
          </div>
          <button
            onClick={() => { setSections(defaultSections); setHasChanges(false); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs text-text-3 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            disabled={!hasChanges}
            onClick={() => { setHasChanges(false); alert("Homepage layout saved successfully!"); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue text-white text-xs font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40"
          >
            <Save size={14} />
            Save Layout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Section List */}
        <div className="lg:col-span-2 space-y-2">
          {sorted.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className={`bg-white rounded-xl border transition-colors ${
                  selectedSection === section.id ? "border-blue shadow-soft" : "border-gray-200"
                } ${!section.enabled ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <GripVertical size={16} className="text-text-4 cursor-grab shrink-0" />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    section.enabled ? "bg-blue/10 text-blue" : "bg-gray-100 text-text-4"
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-1">{section.name}</p>
                    <p className="text-[10px] text-text-4">Section #{idx + 1}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSection(section.id, "up")}
                      disabled={idx === 0}
                      className="p-1.5 hover:bg-gray-50 rounded-lg disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp size={14} className="text-text-4" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, "down")}
                      disabled={idx === sorted.length - 1}
                      className="p-1.5 hover:bg-gray-50 rounded-lg disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={14} className="text-text-4" />
                    </button>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        section.enabled ? "hover:bg-green-50 text-green-600" : "hover:bg-red/10 text-red"
                      }`}
                    >
                      {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                      className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings size={14} className="text-text-4" />
                    </button>
                  </div>
                </div>

                {/* Settings Panel */}
                {selectedSection === section.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Display Title</label>
                        <input
                          type="text"
                          defaultValue={section.name}
                          className="mt-1 w-full h-9 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Products to Show</label>
                        <select className="mt-1 w-full h-9 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue bg-white">
                          <option>4</option>
                          <option>6</option>
                          <option>8</option>
                          <option>12</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Layout Style</label>
                        <select className="mt-1 w-full h-9 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue bg-white">
                          <option>Grid</option>
                          <option>Carousel</option>
                          <option>List</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Background</label>
                        <select className="mt-1 w-full h-9 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue bg-white">
                          <option>White</option>
                          <option>Off-White</option>
                          <option>Navy</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4">
          <h3 className="font-semibold text-sm text-text-1 mb-3 flex items-center gap-2">
            <Eye size={16} className="text-blue" />
            Live Preview
          </h3>
          <div className={`border border-gray-200 rounded-lg overflow-hidden bg-off-white ${
            previewMode === "mobile" ? "max-w-[280px] mx-auto" : ""
          }`}>
            {sorted.filter((s) => s.enabled).map((section) => (
              <div
                key={section.id}
                className="border-b border-dashed border-gray-200 last:border-0 p-2 hover:bg-blue/5 transition-colors cursor-pointer"
                onClick={() => setSelectedSection(section.id)}
              >
                <div className="flex items-center gap-1.5">
                  <section.icon size={10} className="text-text-4" />
                  <span className="text-[9px] text-text-3 font-medium">{section.name}</span>
                </div>
                <div className="mt-1 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-4 mt-3 text-center">
            Click a section to configure
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
