"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Key,
  Palette,
  Image,
  Calendar,
  Bell,
  CreditCard,
  Truck,
  FileText,
  Shield,
  Link2,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge";

const settingsTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "geo", label: "Geo & Currency", icon: Globe },
  { id: "api", label: "API Vault", icon: Key },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "watermark", label: "Watermark", icon: Image },
  { id: "banners", label: "Banner Sizes", icon: Image },
  { id: "campaigns", label: "Seasonal Campaigns", icon: Calendar },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "tax", label: "Tax & VAT", icon: FileText },
  { id: "payments", label: "Payment Gateways", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "legal", label: "Legal Pages", icon: FileText },
  { id: "security", label: "Security", icon: Shield },
  { id: "google", label: "Google", icon: Link2 },
  { id: "bing", label: "Bing", icon: Link2 },
];

const defaultApiKeys = [
  { name: "Paystack", category: "Payments", connected: true, key: "sk_live_****...8f3a" },
  { name: "Stripe", category: "Payments", connected: true, key: "sk_live_****...2d4e" },
  { name: "Flutterwave", category: "Payments", connected: false, key: "" },
  { name: "Squad.co", category: "Payments", connected: false, key: "" },
  { name: "NowPayments", category: "Payments", connected: false, key: "" },
  { name: "OpenRouter", category: "AI", connected: true, key: "sk-or-****...7b1c" },
  { name: "Vapi.ai", category: "AI", connected: true, key: "vapi_****...3e5f" },
  { name: "Open Exchange Rates", category: "Currency", connected: true, key: "oer_****...9a2b" },
  { name: "ipapi.co", category: "Geo", connected: true, key: "Free tier (no key)" },
  { name: "Mapbox", category: "Maps", connected: true, key: "pk.****...4c8d" },
  { name: "Termii", category: "SMS", connected: true, key: "TLR****...1e2f" },
  { name: "OneSignal", category: "Push", connected: false, key: "" },
  { name: "Apify", category: "Scraping", connected: true, key: "apify_****...6g7h" },
  { name: "Kie.ai", category: "Video", connected: false, key: "" },
  { name: "Google Analytics", category: "Analytics", connected: true, key: "G-XXXXXXXXXX" },
  { name: "Google Indexing API", category: "SEO", connected: true, key: "Service Account" },
  { name: "Bing Webmaster", category: "SEO", connected: false, key: "" },
];

const defaultPaymentMethods = [
  { friendly: "Credit/Debit Card", gateway: "Paystack", enabled: true },
  { friendly: "Bank Transfer", gateway: "Paystack", enabled: true },
  { friendly: "USSD", gateway: "Paystack", enabled: true },
  { friendly: "Mobile Money", gateway: "Flutterwave", enabled: false },
  { friendly: "Crypto", gateway: "NowPayments", enabled: false },
  { friendly: "Wallet", gateway: "Platform Wallet", enabled: true },
  { friendly: "Pay on Delivery", gateway: "COD", enabled: true },
  { friendly: "International Card", gateway: "Stripe", enabled: true },
];

const defaultCampaigns = [
  { name: "New Year Sale", start: "2026-01-01", end: "2026-01-15", color: "#FFD700", active: false },
  { name: "Valentine's Day", start: "2026-02-10", end: "2026-02-14", color: "#FF69B4", active: false },
  { name: "Easter Sale", start: "2026-04-01", end: "2026-04-07", color: "#90EE90", active: true },
  { name: "Independence Day", start: "2026-10-01", end: "2026-10-07", color: "#008000", active: false },
  { name: "Black Friday", start: "2026-11-27", end: "2026-11-30", color: "#000000", active: false },
  { name: "Christmas Sale", start: "2026-12-15", end: "2026-12-31", color: "#FF0000", active: false },
];

const defaultSecuritySettings = [
  { name: "Two-Factor Authentication", desc: "Require 2FA for admin roles", enabled: true },
  { name: "Fraud Detection", desc: "Auto-flag suspicious transactions", enabled: true },
  { name: "IP Allowlist", desc: "Restrict admin access to specific IPs", enabled: false },
  { name: "Brute-force Protection", desc: "Lock after 5 failed attempts", enabled: true },
  { name: "Suspicious Login Alerts", desc: "Email on new device/location login", enabled: true },
  { name: "SSL Auto-renewal", desc: "Auto-renew SSL certificate", enabled: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showKey, setShowKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // State for all settings
  const [general, setGeneral] = useState({
    storeName: "Roshanal Global",
    legalName: "Roshanal Global Infotech Limited",
    tradingName: "Roshanal Global",
    rcNumber: "",
    vatRate: "7.5",
    ncdmbNumber: "",
    address: "42 Ada George Road, Port Harcourt, Rivers State, Nigeria",
  });

  const [geo, setGeo] = useState({
    geoDetection: true,
    showNgnEquivalent: true,
    rateFrequency: "Every 1 hour",
    markupBuffer: "2.5",
    fallbackCurrency: "NGN",
    supportedCurrencies: ["NGN", "USD", "GBP", "EUR", "GHS", "AED", "CAD", "AUD", "ZAR", "KES", "JPY", "CNY"],
  });

  const [apiKeys, setApiKeys] = useState(defaultApiKeys);
  const [appearance, setAppearance] = useState({ sidebarColor: "#0C1A36", accentColor: "#1641C4", layout: "Default" });
  const [paymentMethods, setPaymentMethods] = useState(defaultPaymentMethods);
  const [campaigns, setCampaigns] = useState(defaultCampaigns);
  const [securitySettings, setSecuritySettings] = useState(defaultSecuritySettings);
  const [apiEditModal, setApiEditModal] = useState<{ name: string; key: string } | null>(null);
  const [newApiKey, setNewApiKey] = useState("");

  const [watermark, setWatermark] = useState({ enabled: true, position: "Bottom Right", opacity: "30" });
  const [tax, setTax] = useState({ vatRate: "7.5", taxDisplay: "Inclusive (prices include VAT)" });
  const [notifications, setNotifications] = useState<Record<string, { popup: boolean; email: boolean; sms: boolean }>>({});

  const notificationTypes = ["Add to Cart", "Order Placed", "Payment Confirmed", "Wishlist Added", "Coupon Applied", "Review Submitted", "Newsletter Signup", "Return Requested", "Account Created", "Quote Sent", "Affiliate Commission"];

  useEffect(() => {
    const defaults: Record<string, { popup: boolean; email: boolean; sms: boolean }> = {};
    notificationTypes.forEach((n) => { defaults[n] = { popup: true, email: true, sms: false }; });
    loadSettings(defaults);
  }, []);

  const loadSettings = async (defaultNotifs: Record<string, { popup: boolean; email: boolean; sms: boolean }>) => {
    try {
      const { data } = await insforge.database.from("settings").select("*");
      if (data) {
        for (const row of data) {
          const val = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
          switch (row.key) {
            case "general": setGeneral(val); break;
            case "geo": setGeo(val); break;
            case "api_keys": setApiKeys(val); break;
            case "appearance": setAppearance(val); break;
            case "payment_methods": setPaymentMethods(val); break;
            case "campaigns": setCampaigns(val); break;
            case "security": setSecuritySettings(val); break;
            case "watermark": setWatermark(val); break;
            case "tax": setTax(val); break;
            case "notifications": setNotifications(val); break;
          }
        }
      }
      if (!notifications || Object.keys(notifications).length === 0) {
        setNotifications(defaultNotifs);
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
      setNotifications(defaultNotifs);
    }
  };

  const saveSettings = async (key: string, value: unknown) => {
    setSaving(true);
    try {
      const { data: existing } = await insforge.database.from("settings").select("*").eq("key", key);
      if (existing && existing.length > 0) {
        await insforge.database.from("settings").update({ value: JSON.stringify(value), updated_at: new Date().toISOString() }).eq("key", key);
      } else {
        await insforge.database.from("settings").insert({ key, value: JSON.stringify(value) });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save:", e);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const SaveButton = ({ settingKey, value }: { settingKey: string; value: unknown }) => (
    <Button className="mt-5 gap-2" onClick={() => saveSettings(settingKey, value)} disabled={saving}>
      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      {saved ? "Saved!" : "Save Settings"}
    </Button>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl text-text-1">Settings</h1>

      <div className="flex gap-6">
        {/* Settings Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id ? "bg-blue text-white font-medium" : "text-text-3 hover:bg-off-white"
                  }`}
                >
                  <Icon size={15} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          {/* General */}
          {activeTab === "general" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-5">General Settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Store Name</label>
                  <input value={general.storeName} onChange={(e) => setGeneral({ ...general, storeName: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Legal Name</label>
                  <input value={general.legalName} onChange={(e) => setGeneral({ ...general, legalName: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Trading Name</label>
                  <input value={general.tradingName} onChange={(e) => setGeneral({ ...general, tradingName: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Business Registration (RC)</label>
                  <input value={general.rcNumber} onChange={(e) => setGeneral({ ...general, rcNumber: e.target.value })} placeholder="RC-XXXXXXX" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">VAT Rate (%)</label>
                  <input value={general.vatRate} onChange={(e) => setGeneral({ ...general, vatRate: e.target.value })} type="number" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">NCDMB/NOGICJQS Number</label>
                  <input value={general.ncdmbNumber} onChange={(e) => setGeneral({ ...general, ncdmbNumber: e.target.value })} placeholder="Optional" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Address</label>
                  <input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">RS</div>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm">Upload Logo</Button>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) alert("Logo uploaded: " + e.target.files[0].name); }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Favicon</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue flex items-center justify-center text-white text-xs font-bold">R</div>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm">Upload Favicon</Button>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) alert("Favicon uploaded: " + e.target.files[0].name); }} />
                    </label>
                  </div>
                </div>
              </div>
              <SaveButton settingKey="general" value={general} />
            </div>
          )}

          {/* Geo & Currency */}
          {activeTab === "geo" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-5">Geolocation & Currency</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-1">Enable Geo-detection</p>
                    <p className="text-xs text-text-4">Auto-detect visitor country and city via ipapi.co</p>
                  </div>
                  <button onClick={() => setGeo({ ...geo, geoDetection: !geo.geoDetection })}>
                    {geo.geoDetection ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-1">Show NGN Equivalent</p>
                    <p className="text-xs text-text-4">Show Naira amount below converted prices</p>
                  </div>
                  <button onClick={() => setGeo({ ...geo, showNgnEquivalent: !geo.showNgnEquivalent })}>
                    {geo.showNgnEquivalent ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Rate Update Frequency</label>
                    <select value={geo.rateFrequency} onChange={(e) => setGeo({ ...geo, rateFrequency: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                      <option>Every 1 hour</option>
                      <option>Every 30 minutes</option>
                      <option>Every 6 hours</option>
                      <option>Every 24 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Admin Markup Buffer (%)</label>
                    <input value={geo.markupBuffer} onChange={(e) => setGeo({ ...geo, markupBuffer: e.target.value })} type="number" step="0.5" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Fallback Currency</label>
                    <select value={geo.fallbackCurrency} onChange={(e) => setGeo({ ...geo, fallbackCurrency: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                      <option value="NGN">NGN (Naira)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Supported Currencies</label>
                  <div className="flex flex-wrap gap-2">
                    {["NGN", "USD", "GBP", "EUR", "GHS", "AED", "CAD", "AUD", "ZAR", "KES", "JPY", "CNY"].map((cur) => (
                      <label key={cur} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm cursor-pointer hover:border-blue">
                        <input
                          type="checkbox"
                          checked={geo.supportedCurrencies.includes(cur)}
                          onChange={(e) => {
                            if (e.target.checked) setGeo({ ...geo, supportedCurrencies: [...geo.supportedCurrencies, cur] });
                            else setGeo({ ...geo, supportedCurrencies: geo.supportedCurrencies.filter((c) => c !== cur) });
                          }}
                          className="rounded"
                        />
                        {cur}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <SaveButton settingKey="geo" value={geo} />
            </div>
          )}

          {/* API Vault */}
          {activeTab === "api" && (
            <div className="bg-white rounded-xl border border-border">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-lg text-text-1 flex items-center gap-2">
                  <Key size={18} /> API Vault
                </h3>
                <p className="text-xs text-text-4 mt-1">AES-256 encrypted. Never stored in .env or HTML.</p>
              </div>
              <div className="divide-y divide-border">
                {apiKeys.map((api) => (
                  <div key={api.name} className="flex items-center justify-between px-5 py-4 hover:bg-off-white transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${api.connected ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <p className="text-sm font-medium text-text-1">{api.name}</p>
                        <p className="text-xs text-text-4">{api.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {api.connected ? (
                        <>
                          <span className="text-xs font-mono text-text-4">
                            {showKey === api.name ? api.key : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                          </span>
                          <button onClick={() => setShowKey(showKey === api.name ? null : api.name)} className="text-text-4 hover:text-text-2">
                            {showKey === api.name ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <Button variant="outline" size="sm" onClick={() => { setApiEditModal({ name: api.name, key: api.key }); setNewApiKey(api.key); }}>Update</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => { setApiEditModal({ name: api.name, key: "" }); setNewApiKey(""); }}>Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-5">Admin Appearance</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-3">Sidebar Color</label>
                  <div className="flex gap-2">
                    {["#0C1A36", "#1641C4", "#1E293B", "#1F2937", "#312E81", "#831843"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAppearance({ ...appearance, sidebarColor: color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-colors ${appearance.sidebarColor === color ? "border-blue ring-2 ring-blue/30" : "border-border hover:border-blue"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-3">Accent Color</label>
                  <div className="flex gap-2">
                    {["#1641C4", "#C8191C", "#059669", "#D97706", "#7C3AED", "#0891B2"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAppearance({ ...appearance, accentColor: color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-colors ${appearance.accentColor === color ? "border-blue ring-2 ring-blue/30" : "border-border hover:border-blue"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-3">Dashboard Layout</label>
                  <div className="flex gap-3">
                    {["Default", "Compact", "Wide", "Analytics Focus"].map((layout) => (
                      <button
                        key={layout}
                        onClick={() => setAppearance({ ...appearance, layout })}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${appearance.layout === layout ? "border-blue text-blue bg-blue/5 font-medium" : "border-border text-text-3 hover:border-blue hover:text-blue"}`}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <SaveButton settingKey="appearance" value={appearance} />
            </div>
          )}

          {/* Payment Gateways */}
          {activeTab === "payments" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-5">Payment Gateway Mapping</h3>
              <p className="text-xs text-text-4 mb-4">Map customer-friendly payment names to actual gateways</p>
              <div className="space-y-3">
                {paymentMethods.map((pm, idx) => (
                  <div key={pm.friendly} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <button onClick={() => {
                        const updated = [...paymentMethods];
                        updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                        setPaymentMethods(updated);
                      }}>
                        {pm.enabled ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-text-1">{pm.friendly}</p>
                        <p className="text-xs text-text-4">Gateway: {pm.gateway}</p>
                      </div>
                    </div>
                    <select
                      value={pm.gateway}
                      onChange={(e) => {
                        const updated = [...paymentMethods];
                        updated[idx] = { ...updated[idx], gateway: e.target.value };
                        setPaymentMethods(updated);
                      }}
                      className="h-9 px-3 rounded-lg border border-border text-sm"
                    >
                      <option>Paystack</option>
                      <option>Stripe</option>
                      <option>Flutterwave</option>
                      <option>Squad.co</option>
                      <option>NowPayments</option>
                      <option>Platform Wallet</option>
                      <option>COD</option>
                    </select>
                  </div>
                ))}
              </div>
              <SaveButton settingKey="payment_methods" value={paymentMethods} />
            </div>
          )}

          {/* Seasonal Campaigns */}
          {activeTab === "campaigns" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg text-text-1">Seasonal Campaigns</h3>
                <Button size="sm" className="gap-1.5" onClick={() => {
                  const name = prompt("Campaign name:");
                  if (name) {
                    setCampaigns([...campaigns, { name, start: "", end: "", color: "#1641C4", active: false }]);
                  }
                }}><Plus size={14} /> Add Campaign</Button>
              </div>
              <div className="space-y-3">
                {campaigns.map((camp, idx) => (
                  <div key={camp.name + idx} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: camp.color }} />
                      <div>
                        <p className="text-sm font-medium text-text-1">{camp.name}</p>
                        <p className="text-xs text-text-4">{camp.start || "Not set"} &rarr; {camp.end || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        const updated = [...campaigns];
                        updated[idx] = { ...updated[idx], active: !updated[idx].active };
                        setCampaigns(updated);
                      }}>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full cursor-pointer ${
                          camp.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"
                        }`}>
                          {camp.active ? "Active" : "Scheduled"}
                        </span>
                      </button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const start = prompt("Start date (YYYY-MM-DD):", camp.start);
                        const end = prompt("End date (YYYY-MM-DD):", camp.end);
                        if (start !== null && end !== null) {
                          const updated = [...campaigns];
                          updated[idx] = { ...updated[idx], start, end };
                          setCampaigns(updated);
                        }
                      }}>Edit</Button>
                      <Button variant="outline" size="sm" className="text-red hover:bg-red-50" onClick={() => {
                        setCampaigns(campaigns.filter((_, i) => i !== idx));
                      }}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <SaveButton settingKey="campaigns" value={campaigns} />
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg text-text-1 mb-5">Security Settings</h3>
                <div className="space-y-4">
                  {securitySettings.map((setting, idx) => (
                    <div key={setting.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-text-1">{setting.name}</p>
                        <p className="text-xs text-text-4">{setting.desc}</p>
                      </div>
                      <button onClick={() => {
                        const updated = [...securitySettings];
                        updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                        setSecuritySettings(updated);
                      }}>
                        {setting.enabled ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                      </button>
                    </div>
                  ))}
                </div>
                <SaveButton settingKey="security" value={securitySettings} />
              </div>
            </div>
          )}

          {/* Google / Bing */}
          {(activeTab === "google" || activeTab === "bing") && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-5">
                {activeTab === "google" ? "Google Integrations" : "Bing Integrations"}
              </h3>
              <div className="space-y-4">
                {(activeTab === "google"
                  ? [
                      { name: "Google Analytics 4", desc: "Track website analytics", connected: true, key: "G-XXXXXXXXXX" },
                      { name: "Google Search Console", desc: "Monitor search performance", connected: true, key: "Verified" },
                      { name: "Google My Business", desc: "Sync business info", connected: false, key: "" },
                      { name: "Google Indexing API", desc: "Instant URL indexing", connected: true, key: "Service Account" },
                      { name: "Google Shopping Feed", desc: "Auto XML product feed", connected: true, key: "Active" },
                    ]
                  : [
                      { name: "Bing Webmaster Tools", desc: "Site verification & indexing", connected: false, key: "" },
                      { name: "Bing Auto-Indexing", desc: "Submit URLs automatically", connected: false, key: "" },
                    ]
                ).map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${integration.connected ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <p className="text-sm font-medium text-text-1">{integration.name}</p>
                        <p className="text-xs text-text-4">{integration.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected && <span className="text-xs text-green-600 font-medium">{integration.key}</span>}
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => alert(`${integration.connected ? "Configure" : "Connect"} ${integration.name} — integration panel coming soon.`)}
                      >
                        {integration.connected ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs */}
          {["watermark", "banners", "notifications", "tax", "shipping", "legal"].includes(activeTab) && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-4">
                {settingsTabs.find((t) => t.id === activeTab)?.label} Settings
              </h3>
              {activeTab === "watermark" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div><p className="text-sm font-medium text-text-1">Global Watermark</p><p className="text-xs text-text-4">Apply watermark to all product images</p></div>
                    <button onClick={() => setWatermark({ ...watermark, enabled: !watermark.enabled })}>
                      {watermark.enabled ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Position</label><select value={watermark.position} onChange={(e) => setWatermark({ ...watermark, position: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm"><option>Bottom Right</option><option>Bottom Left</option><option>Center</option><option>Top Right</option></select></div>
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Opacity (%)</label><input value={watermark.opacity} onChange={(e) => setWatermark({ ...watermark, opacity: e.target.value })} type="number" className="w-full h-10 px-3 rounded-lg border border-border text-sm" /></div>
                  </div>
                </div>
              )}
              {activeTab === "banners" && (
                <div className="space-y-3">
                  <p className="text-sm text-text-3 mb-3">Manage preset banner sizes. All selected sizes are generated simultaneously.</p>
                  {[
                    { name: "Hero Banner", size: "1920x600" },
                    { name: "Category Banner", size: "1200x400" },
                    { name: "Popup", size: "800x500" },
                    { name: "Social Square", size: "1080x1080" },
                    { name: "Social Portrait", size: "1080x1920" },
                    { name: "Social Landscape", size: "1200x628" },
                    { name: "Email Header", size: "600x200" },
                    { name: "Product Card", size: "400x300" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div><p className="text-sm font-medium text-text-1">{s.name}</p><p className="text-xs text-text-4">{s.size}</p></div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { const newSize = prompt("New size:", s.size); if (newSize) alert("Updated to: " + newSize); }}>Edit</Button>
                        <Button variant="outline" size="sm" className="text-red" onClick={() => alert("Banner size removed")}><Trash2 size={12} /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="gap-1.5" onClick={() => { const name = prompt("Custom size name:"); if (name) alert("Added: " + name); }}><Plus size={14} /> Add Custom Size</Button>
                </div>
              )}
              {activeTab === "tax" && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Default VAT Rate (%)</label><input value={tax.vatRate} onChange={(e) => setTax({ ...tax, vatRate: e.target.value })} type="number" className="w-full h-10 px-3 rounded-lg border border-border text-sm" /></div>
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Tax Display</label><select value={tax.taxDisplay} onChange={(e) => setTax({ ...tax, taxDisplay: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm"><option>Inclusive (prices include VAT)</option><option>Exclusive (VAT added at checkout)</option></select></div>
                  </div>
                  <div><label className="text-sm font-medium text-text-2 block mb-1.5">Tax Exempt Products</label><p className="text-xs text-text-4">Configure per product in product settings.</p></div>
                </div>
              )}
              {activeTab === "shipping" && (
                <p className="text-sm text-text-3">Shipping zones, methods, carriers, delivery boys, and pickup points are managed in Operations &rarr; Shipping.</p>
              )}
              {activeTab === "notifications" && (
                <div className="space-y-3">
                  {notificationTypes.map((n) => (
                    <div key={n} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-sm text-text-1">{n}</span>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-4 flex items-center gap-1">
                          <input type="checkbox" checked={notifications[n]?.popup ?? true} onChange={(e) => setNotifications({ ...notifications, [n]: { ...notifications[n], popup: e.target.checked } })} /> Popup
                        </label>
                        <label className="text-xs text-text-4 flex items-center gap-1">
                          <input type="checkbox" checked={notifications[n]?.email ?? true} onChange={(e) => setNotifications({ ...notifications, [n]: { ...notifications[n], email: e.target.checked } })} /> Email
                        </label>
                        <label className="text-xs text-text-4 flex items-center gap-1">
                          <input type="checkbox" checked={notifications[n]?.sms ?? false} onChange={(e) => setNotifications({ ...notifications, [n]: { ...notifications[n], sms: e.target.checked } })} /> SMS
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "legal" && (
                <div className="space-y-3">
                  {["Privacy Policy", "Terms of Service", "Returns Policy", "Shipping Policy", "Cookie Policy"].map((page) => (
                    <div key={page} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div><p className="text-sm font-medium text-text-1">{page}</p><p className="text-xs text-text-4">Editable via Page Builder</p></div>
                      <Button variant="outline" size="sm" onClick={() => window.open("/admin/pages", "_blank")}>Edit Page</Button>
                    </div>
                  ))}
                </div>
              )}
              <SaveButton settingKey={activeTab} value={
                activeTab === "watermark" ? watermark :
                activeTab === "tax" ? tax :
                activeTab === "notifications" ? notifications :
                { tab: activeTab }
              } />
            </div>
          )}
        </div>
      </div>

      {/* API Key Edit Modal */}
      {apiEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setApiEditModal(null)}>
          <div className="bg-white rounded-2xl w-[450px] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-4">{apiEditModal.key ? "Update" : "Connect"} {apiEditModal.name}</h3>
            <div>
              <label className="text-sm font-medium text-text-2 block mb-1.5">API Key</label>
              <input
                type="text"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="Enter API key..."
                className="w-full h-10 px-3 rounded-lg border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue/20"
              />
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setApiEditModal(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => {
                setApiKeys(apiKeys.map((a) =>
                  a.name === apiEditModal.name ? { ...a, connected: !!newApiKey, key: newApiKey || "" } : a
                ));
                saveSettings("api_keys", apiKeys.map((a) =>
                  a.name === apiEditModal.name ? { ...a, connected: !!newApiKey, key: newApiKey || "" } : a
                ));
                setApiEditModal(null);
              }}>
                {apiEditModal.key ? "Update" : "Connect"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
