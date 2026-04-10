"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { ToggleLeft, ToggleRight, Search, Save, Loader2 } from "lucide-react";
import { insforge } from "@/lib/insforge";

const defaultFeatures = [
  { id: "multi-currency", name: "Multi-Currency Support", description: "Allow customers to shop in different currencies", category: "Commerce", enabled: true },
  { id: "flash-sales", name: "Flash Sales", description: "Time-limited deals with countdown timers", category: "Commerce", enabled: true },
  { id: "wishlists", name: "Wishlists", description: "Let customers save products for later", category: "Commerce", enabled: true },
  { id: "compare", name: "Product Compare", description: "Side-by-side product comparison tool", category: "Commerce", enabled: true },
  { id: "reviews", name: "Product Reviews", description: "Customer reviews and ratings on products", category: "Commerce", enabled: true },
  { id: "loyalty", name: "Loyalty Program", description: "Points-based rewards for repeat customers", category: "Commerce", enabled: true },
  { id: "wallet", name: "Customer Wallet", description: "Store credit and wallet balance system", category: "Commerce", enabled: true },
  { id: "pos", name: "Point of Sale", description: "In-store POS terminal for walk-in sales", category: "Commerce", enabled: true },
  { id: "b2b-quotes", name: "B2B Quotes", description: "Request-for-quote system for businesses", category: "B2B", enabled: true },
  { id: "wholesale", name: "Wholesale Pricing", description: "Tiered pricing for bulk buyers", category: "B2B", enabled: true },
  { id: "vendor-marketplace", name: "Vendor Marketplace", description: "Multi-vendor marketplace with commissions", category: "Marketplace", enabled: true },
  { id: "vendor-ads", name: "Vendor Advertising", description: "Paid promotion slots for vendors", category: "Marketplace", enabled: false },
  { id: "ai-chat", name: "AI Chat Assistant", description: "AI-powered customer support chatbot", category: "AI", enabled: true },
  { id: "ai-recommendations", name: "AI Recommendations", description: "Personalized product recommendations", category: "AI", enabled: false },
  { id: "boat-configurator", name: "Boat Configurator", description: "Custom boat building configuration tool", category: "Specialty", enabled: true },
  { id: "field-team", name: "Field Team Management", description: "Technician dispatch and job scheduling", category: "Operations", enabled: true },
  { id: "delivery-tracking", name: "Delivery Tracking", description: "Real-time delivery rider tracking", category: "Operations", enabled: true },
  { id: "warranty", name: "Warranty Management", description: "Product warranty registration and claims", category: "Operations", enabled: true },
  { id: "social-proof", name: "Social Proof Popups", description: "Recent purchase notification popups", category: "Marketing", enabled: true },
  { id: "newsletter", name: "Newsletter Popup", description: "Email capture popup for new visitors", category: "Marketing", enabled: true },
  { id: "cookie-consent", name: "Cookie Consent", description: "GDPR-compliant cookie consent banner", category: "Compliance", enabled: true },
  { id: "pwa", name: "Progressive Web App", description: "Install as mobile app from browser", category: "Platform", enabled: true },
  { id: "dark-mode", name: "Dark Mode", description: "Dark theme option for the storefront", category: "Platform", enabled: false },
  { id: "multi-language", name: "Multi-Language", description: "Support for multiple languages", category: "Platform", enabled: false },
];

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState(defaultFeatures);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadFeatures = useCallback(async () => {
    try {
      const { data } = await insforge.database.from("settings").select("value").eq("key", "feature_flags").limit(1);
      if (data && data.length > 0 && data[0].value) {
        const saved = data[0].value as Record<string, boolean>;
        setFeatures((prev) => prev.map((f) => ({ ...f, enabled: saved[f.id] !== undefined ? saved[f.id] : f.enabled })));
      }
    } catch { /* use defaults */ }
    setLoaded(true);
  }, []);

  useEffect(() => { loadFeatures(); }, [loadFeatures]);

  const saveFeatures = async () => {
    setSaving(true);
    try {
      const value = Object.fromEntries(features.map((f) => [f.id, f.enabled]));
      const { data: existing } = await insforge.database.from("settings").select("key").eq("key", "feature_flags").limit(1);
      if (existing && existing.length > 0) {
        await insforge.database.from("settings").update({ value, updated_at: new Date().toISOString() }).eq("key", "feature_flags");
      } else {
        await insforge.database.from("settings").insert([{ key: "feature_flags", value }]);
      }
      alert("Feature flags saved!");
    } catch (err) {
      alert("Error saving: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  const categories = ["all", ...Array.from(new Set(features.map((f) => f.category)))];

  const filtered = features.filter((f) => {
    if (category !== "all" && f.category !== category) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggle = (id: string) => {
    setFeatures((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <AdminShell title="Feature Flags" subtitle="Enable or disable platform features">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
              <input type="text" placeholder="Search features..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue w-64" />
            </div>
            <span className="text-sm text-text-3"><span className="font-semibold text-text-1">{features.filter((f) => f.enabled).length}</span> of {features.length} enabled</span>
          </div>
          <button onClick={saveFeatures} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 text-xs rounded-lg border capitalize ${category === c ? "bg-blue text-white border-blue" : "bg-white border-gray-200 text-text-3"}`}>{c}</button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((feature) => (
            <div key={feature.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
              <button onClick={() => toggle(feature.id)}>
                {feature.enabled ? <ToggleRight size={28} className="text-green-600" /> : <ToggleLeft size={28} className="text-text-4" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-1">{feature.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-text-4">{feature.category}</span>
                </div>
                <p className="text-xs text-text-4 mt-0.5">{feature.description}</p>
              </div>
              <span className={`text-xs font-medium ${feature.enabled ? "text-green-600" : "text-text-4"}`}>{feature.enabled ? "Enabled" : "Disabled"}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
