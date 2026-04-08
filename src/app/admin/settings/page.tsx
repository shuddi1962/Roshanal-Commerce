"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const apiKeys = [
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

const paymentMethods = [
  { friendly: "Credit/Debit Card", gateway: "Paystack", enabled: true },
  { friendly: "Bank Transfer", gateway: "Paystack", enabled: true },
  { friendly: "USSD", gateway: "Paystack", enabled: true },
  { friendly: "Mobile Money", gateway: "Flutterwave", enabled: false },
  { friendly: "Crypto", gateway: "NowPayments", enabled: false },
  { friendly: "Wallet", gateway: "Platform Wallet", enabled: true },
  { friendly: "Pay on Delivery", gateway: "COD", enabled: true },
  { friendly: "International Card", gateway: "Stripe", enabled: true },
];

const campaigns = [
  { name: "New Year Sale", start: "2026-01-01", end: "2026-01-15", color: "#FFD700", active: false },
  { name: "Valentine's Day", start: "2026-02-10", end: "2026-02-14", color: "#FF69B4", active: false },
  { name: "Easter Sale", start: "2026-04-01", end: "2026-04-07", color: "#90EE90", active: true },
  { name: "Independence Day", start: "2026-10-01", end: "2026-10-07", color: "#008000", active: false },
  { name: "Black Friday", start: "2026-11-27", end: "2026-11-30", color: "#000000", active: false },
  { name: "Christmas Sale", start: "2026-12-15", end: "2026-12-31", color: "#FF0000", active: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showKey, setShowKey] = useState<string | null>(null);

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
                    activeTab === tab.id
                      ? "bg-blue text-white font-medium"
                      : "text-text-3 hover:bg-off-white"
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
                  <input defaultValue="Roshanal Global" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Legal Name</label>
                  <input defaultValue="Roshanal Global Infotech Limited" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Trading Name</label>
                  <input defaultValue="Roshanal Global" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Business Registration (RC)</label>
                  <input placeholder="RC-XXXXXXX" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">VAT Rate (%)</label>
                  <input defaultValue="7.5" type="number" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">NCDMB/NOGICJQS Number</label>
                  <input placeholder="Optional" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Address</label>
                  <input defaultValue="42 Ada George Road, Port Harcourt, Rivers State, Nigeria" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">RS</div>
                    <Button variant="outline" size="sm">Upload Logo</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Favicon</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue flex items-center justify-center text-white text-xs font-bold">R</div>
                    <Button variant="outline" size="sm">Upload Favicon</Button>
                  </div>
                </div>
              </div>
              <Button className="mt-5 gap-2"><Save size={14} /> Save Settings</Button>
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
                  <ToggleRight size={28} className="text-blue" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-1">Show NGN Equivalent</p>
                    <p className="text-xs text-text-4">Show ₦ amount below converted prices</p>
                  </div>
                  <ToggleRight size={28} className="text-blue" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Rate Update Frequency</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                      <option>Every 1 hour</option>
                      <option>Every 30 minutes</option>
                      <option>Every 6 hours</option>
                      <option>Every 24 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Admin Markup Buffer (%)</label>
                    <input defaultValue="2.5" type="number" step="0.5" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Fallback Currency</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                      <option>NGN (₦)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Supported Currencies</label>
                  <div className="flex flex-wrap gap-2">
                    {["NGN", "USD", "GBP", "EUR", "GHS", "AED", "CAD", "AUD", "ZAR", "KES", "JPY", "CNY"].map((cur) => (
                      <label key={cur} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm cursor-pointer hover:border-blue">
                        <input type="checkbox" defaultChecked className="rounded" />
                        {cur}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="mt-5 gap-2"><Save size={14} /> Save</Button>
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
                            {showKey === api.name ? api.key : "••••••••••••"}
                          </span>
                          <button onClick={() => setShowKey(showKey === api.name ? null : api.name)} className="text-text-4 hover:text-text-2">
                            {showKey === api.name ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <Button variant="outline" size="sm">Update</Button>
                        </>
                      ) : (
                        <Button size="sm">Connect</Button>
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
                      <button key={color} className="w-10 h-10 rounded-lg border-2 border-border hover:border-blue transition-colors" style={{ backgroundColor: color }} />
                    ))}
                    <button className="w-10 h-10 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-text-4 hover:border-blue">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-3">Accent Color</label>
                  <div className="flex gap-2">
                    {["#1641C4", "#C8191C", "#059669", "#D97706", "#7C3AED", "#0891B2"].map((color) => (
                      <button key={color} className="w-10 h-10 rounded-lg border-2 border-border hover:border-blue transition-colors" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-3">Dashboard Layout</label>
                  <div className="flex gap-3">
                    {["Default", "Compact", "Wide", "Analytics Focus"].map((layout) => (
                      <button key={layout} className="px-3 py-2 rounded-lg border border-border text-sm text-text-3 hover:border-blue hover:text-blue transition-colors">
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="mt-5 gap-2"><Save size={14} /> Save Appearance</Button>
            </div>
          )}

          {/* Payment Gateways */}
          {activeTab === "payments" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-5">Payment Gateway Mapping</h3>
              <p className="text-xs text-text-4 mb-4">Map customer-friendly payment names to actual gateways</p>
              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div key={pm.friendly} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <button>
                        {pm.enabled ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-text-1">{pm.friendly}</p>
                        <p className="text-xs text-text-4">Gateway: {pm.gateway}</p>
                      </div>
                    </div>
                    <select className="h-9 px-3 rounded-lg border border-border text-sm">
                      <option>{pm.gateway}</option>
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
              <Button className="mt-5 gap-2"><Save size={14} /> Save Mapping</Button>
            </div>
          )}

          {/* Seasonal Campaigns */}
          {activeTab === "campaigns" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg text-text-1">Seasonal Campaigns</h3>
                <Button size="sm" className="gap-1.5"><Plus size={14} /> Add Campaign</Button>
              </div>
              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div key={camp.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: camp.color }} />
                      <div>
                        <p className="text-sm font-medium text-text-1">{camp.name}</p>
                        <p className="text-xs text-text-4">{camp.start} → {camp.end}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        camp.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"
                      }`}>
                        {camp.active ? "Active" : "Scheduled"}
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red hover:bg-red-50">
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg text-text-1 mb-5">Security Settings</h3>
                <div className="space-y-4">
                  {[
                    { name: "Two-Factor Authentication", desc: "Require 2FA for admin roles", enabled: true },
                    { name: "Fraud Detection", desc: "Auto-flag suspicious transactions", enabled: true },
                    { name: "IP Allowlist", desc: "Restrict admin access to specific IPs", enabled: false },
                    { name: "Brute-force Protection", desc: "Lock after 5 failed attempts", enabled: true },
                    { name: "Suspicious Login Alerts", desc: "Email on new device/location login", enabled: true },
                    { name: "SSL Auto-renewal", desc: "Auto-renew SSL certificate", enabled: true },
                  ].map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-text-1">{setting.name}</p>
                        <p className="text-xs text-text-4">{setting.desc}</p>
                      </div>
                      {setting.enabled ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                    </div>
                  ))}
                </div>
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
                      <Button variant={integration.connected ? "outline" : "default"} size="sm">
                        {integration.connected ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs show placeholder */}
          {["watermark", "banners", "notifications", "tax", "shipping", "legal"].includes(activeTab) && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-text-1 mb-4">
                {settingsTabs.find((t) => t.id === activeTab)?.label} Settings
              </h3>
              {activeTab === "watermark" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div><p className="text-sm font-medium text-text-1">Global Watermark</p><p className="text-xs text-text-4">Apply watermark to all product images</p></div>
                    <ToggleRight size={28} className="text-blue" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Position</label><select className="w-full h-10 px-3 rounded-lg border border-border text-sm"><option>Bottom Right</option><option>Bottom Left</option><option>Center</option><option>Top Right</option></select></div>
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Opacity (%)</label><input defaultValue="30" type="number" className="w-full h-10 px-3 rounded-lg border border-border text-sm" /></div>
                  </div>
                  <p className="text-xs text-text-4">Per-product and per-banner overrides available in their respective settings.</p>
                </div>
              )}
              {activeTab === "banners" && (
                <div className="space-y-3">
                  <p className="text-sm text-text-3 mb-3">Manage preset banner sizes. All selected sizes are generated simultaneously.</p>
                  {[
                    { name: "Hero Banner", size: "1920×600" },
                    { name: "Category Banner", size: "1200×400" },
                    { name: "Popup", size: "800×500" },
                    { name: "Social Square", size: "1080×1080" },
                    { name: "Social Portrait", size: "1080×1920" },
                    { name: "Social Landscape", size: "1200×628" },
                    { name: "Email Header", size: "600×200" },
                    { name: "Product Card", size: "400×300" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div><p className="text-sm font-medium text-text-1">{s.name}</p><p className="text-xs text-text-4">{s.size}</p></div>
                      <div className="flex gap-2"><Button variant="outline" size="sm">Edit</Button><Button variant="outline" size="sm" className="text-red"><Trash2 size={12} /></Button></div>
                    </div>
                  ))}
                  <Button variant="outline" className="gap-1.5"><Plus size={14} /> Add Custom Size</Button>
                </div>
              )}
              {activeTab === "tax" && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Default VAT Rate (%)</label><input defaultValue="7.5" type="number" className="w-full h-10 px-3 rounded-lg border border-border text-sm" /></div>
                    <div><label className="text-sm font-medium text-text-2 block mb-1.5">Tax Display</label><select className="w-full h-10 px-3 rounded-lg border border-border text-sm"><option>Inclusive (prices include VAT)</option><option>Exclusive (VAT added at checkout)</option></select></div>
                  </div>
                  <div><label className="text-sm font-medium text-text-2 block mb-1.5">Tax Exempt Products</label><p className="text-xs text-text-4">Configure per product in product settings.</p></div>
                </div>
              )}
              {activeTab === "shipping" && (
                <p className="text-sm text-text-3">Shipping zones, methods, carriers, delivery boys, and pickup points are managed in Operations → Shipping.</p>
              )}
              {activeTab === "notifications" && (
                <div className="space-y-3">
                  {["Add to Cart", "Order Placed", "Payment Confirmed", "Wishlist Added", "Coupon Applied", "Review Submitted", "Newsletter Signup", "Return Requested", "Account Created", "Quote Sent", "Affiliate Commission"].map((n) => (
                    <div key={n} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-sm text-text-1">{n}</span>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-4 flex items-center gap-1"><input type="checkbox" defaultChecked /> Popup</label>
                        <label className="text-xs text-text-4 flex items-center gap-1"><input type="checkbox" defaultChecked /> Email</label>
                        <label className="text-xs text-text-4 flex items-center gap-1"><input type="checkbox" /> SMS</label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "legal" && (
                <div className="space-y-3">
                  {["Privacy Policy", "Terms of Service", "Returns Policy", "Shipping Policy", "Cookie Policy"].map((page) => (
                    <div key={page} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div><p className="text-sm font-medium text-text-1">{page}</p><p className="text-xs text-text-4">Editable via Page Builder · Renameable</p></div>
                      <Button variant="outline" size="sm">Edit Page</Button>
                    </div>
                  ))}
                </div>
              )}
              <Button className="mt-5 gap-2"><Save size={14} /> Save</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
