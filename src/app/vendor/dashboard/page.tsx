"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  Store,
  Truck,
  Megaphone,
  ImageIcon,
  Eye,
  Plus,
  Palette,
  CreditCard,
  Bell,
  ChevronDown,
  Target,
  MousePointer,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const vendorNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/vendor/dashboard", active: true },
  { label: "Products", icon: Package, href: "/vendor/products" },
  { label: "Orders", icon: ShoppingCart, href: "/vendor/orders" },
  { label: "Earnings", icon: DollarSign, href: "/vendor/earnings" },
  { label: "Shop Settings", icon: Store, href: "/vendor/shop" },
  { label: "Shipping", icon: Truck, href: "/vendor/shipping" },
  { label: "Promotions", icon: Megaphone, href: "/vendor/promotions" },
  { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
  { label: "Settings", icon: Settings, href: "/vendor/settings" },
];

const adPricingModels = [
  { value: "duration", label: "Duration", desc: "Pay for a set time period (days/weeks/months)", icon: CalendarDays },
  { value: "cpc", label: "CPC", desc: "Cost Per Click — pay only when users click", icon: MousePointer },
  { value: "cpm", label: "CPM", desc: "Cost Per 1,000 Impressions — pay per views", icon: Eye },
  { value: "cpa", label: "CPA", desc: "Cost Per Action — pay when users take action", icon: Target },
];

const adTypes = [
  { value: "featured", label: "Featured Product", desc: "Appears in featured sections on homepage" },
  { value: "banner", label: "Banner Ad", desc: "Display banner across category or shop pages" },
  { value: "sponsored", label: "Sponsored Listing", desc: "Boosted position in search results" },
  { value: "promoted", label: "Promoted Product", desc: "Highlighted in related product sections" },
];

const shopLayouts = [
  { value: "multi-product", label: "Multi-Product Grid", desc: "Grid layout showing all your products" },
  { value: "single-product", label: "Single Product Focus", desc: "One hero product with others below" },
  { value: "grid", label: "Masonry Grid", desc: "Pinterest-style staggered grid" },
  { value: "list", label: "List View", desc: "Detailed list with descriptions" },
  { value: "custom", label: "Custom Layout", desc: "Fully custom page builder layout" },
];

export default function VendorDashboard() {
  const [activeAdTab, setActiveAdTab] = useState("create");
  const [selectedAdType, setSelectedAdType] = useState("");
  const [selectedPricingModel, setSelectedPricingModel] = useState("");
  const [shopLayout, setShopLayout] = useState("multi-product");

  return (
    <div className="flex h-screen bg-off-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <div>
            <div className="font-syne font-bold text-xs text-text-1">Vendor Hub</div>
            <div className="text-[9px] text-text-4">TechMarine Store</div>
          </div>
        </div>

        <nav className="flex-1 py-2">
          {vendorNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-xs transition-colors ${
                  item.active ? "bg-purple-50 text-purple-700 font-semibold" : "text-text-3 hover:bg-off-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="bg-off-white rounded-lg p-3 text-center">
            <p className="text-[10px] text-text-4">Your Commission Rate</p>
            <p className="font-syne font-bold text-xl text-purple-700">12%</p>
            <p className="text-[10px] text-text-4 mt-1">Platform fee per sale</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border h-14 flex items-center justify-between px-6 shrink-0">
          <h1 className="font-syne font-bold text-lg text-text-1">Vendor Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 hover:bg-off-white rounded-lg">
              <Bell size={18} className="text-text-3" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">TM</span>
              </div>
              <span className="text-xs font-semibold">TechMarine</span>
              <ChevronDown size={14} className="text-text-4" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Sales", value: "₦4,250,000", change: "+18.5%", icon: DollarSign, color: "bg-purple-100 text-purple-700" },
              { label: "Orders", value: "156", change: "+12.3%", icon: ShoppingCart, color: "bg-blue-100 text-blue" },
              { label: "Products", value: "48", change: "+3", icon: Package, color: "bg-success/10 text-success" },
              { label: "Shop Views", value: "2,340", change: "+25.1%", icon: Eye, color: "bg-orange-100 text-warning" },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg ${kpi.color} flex items-center justify-center`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] text-success font-semibold flex items-center gap-0.5">
                      <TrendingUp size={10} /> {kpi.change}
                    </span>
                  </div>
                  <p className="font-syne font-bold text-lg text-text-1">{kpi.value}</p>
                  <p className="text-[10px] text-text-4">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Shop Customization */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-sm flex items-center gap-2">
                  <Palette size={16} className="text-purple-600" /> Shop Layout
                </h3>
                <Link href="/vendor/shop" className="text-xs text-purple-600 hover:underline">Full Settings</Link>
              </div>
              <div className="space-y-2">
                {shopLayouts.map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => setShopLayout(layout.value)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      shopLayout === layout.value
                        ? "border-purple-600 bg-purple-50"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <p className="font-syne font-bold text-xs">{layout.label}</p>
                    <p className="text-[10px] text-text-4 mt-0.5">{layout.desc}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Shop Banner</label>
                  <div className="h-20 bg-off-white rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-purple-300">
                    <span className="text-xs text-text-4 flex items-center gap-1"><ImageIcon size={14} /> Upload Banner</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Shop Logo</label>
                  <div className="w-16 h-16 bg-off-white rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-purple-300">
                    <ImageIcon size={16} className="text-text-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-sm flex items-center gap-2">
                  <Truck size={16} className="text-purple-600" /> Your Shipping Methods
                </h3>
                <Button size="sm" variant="outline"><Plus size={14} className="mr-1" /> Add Method</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Standard Delivery", type: "flat-rate", cost: "₦3,500", days: "3–5 days", zones: "Nationwide", active: true },
                  { name: "Express Delivery", type: "flat-rate", cost: "₦7,000", days: "1–2 days", zones: "Lagos, PHC, Abuja", active: true },
                  { name: "Free Shipping", type: "free", cost: "Free", days: "5–7 days", zones: "Orders over ₦50k", active: true },
                  { name: "International", type: "weight-based", cost: "Calculated", days: "7–14 days", zones: "Global", active: false },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-off-white rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-syne font-bold text-xs">{method.name}</p>
                        <span className="text-[8px] bg-white px-1.5 py-0.5 rounded text-text-4 font-mono">{method.type}</span>
                      </div>
                      <p className="text-[10px] text-text-4 mt-0.5">{method.cost} · {method.days} · {method.zones}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={method.active} className="sr-only peer" />
                      <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vendor Advertising */}
          <div className="bg-white rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-sm flex items-center gap-2">
                <Megaphone size={16} className="text-purple-600" /> Promote Your Products
              </h3>
              <div className="flex gap-1 bg-off-white rounded-lg p-0.5">
                <button
                  onClick={() => setActiveAdTab("create")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeAdTab === "create" ? "bg-white shadow-sm text-purple-700" : "text-text-4"}`}
                >
                  Create Ad
                </button>
                <button
                  onClick={() => setActiveAdTab("active")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeAdTab === "active" ? "bg-white shadow-sm text-purple-700" : "text-text-4"}`}
                >
                  Active Ads (2)
                </button>
                <button
                  onClick={() => setActiveAdTab("history")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeAdTab === "history" ? "bg-white shadow-sm text-purple-700" : "text-text-4"}`}
                >
                  History
                </button>
              </div>
            </div>

            {activeAdTab === "create" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Ad Type */}
                <div>
                  <h4 className="font-syne font-bold text-xs mb-3">1. Select Ad Type</h4>
                  <div className="space-y-2">
                    {adTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedAdType(type.value)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedAdType === type.value
                            ? "border-purple-600 bg-purple-50"
                            : "border-border hover:border-purple-300"
                        }`}
                      >
                        <p className="font-syne font-bold text-xs">{type.label}</p>
                        <p className="text-[10px] text-text-4 mt-0.5">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Model */}
                <div>
                  <h4 className="font-syne font-bold text-xs mb-3">2. Select Pricing Model</h4>
                  <div className="space-y-2">
                    {adPricingModels.map((model) => {
                      const Icon = model.icon;
                      return (
                        <button
                          key={model.value}
                          onClick={() => setSelectedPricingModel(model.value)}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                            selectedPricingModel === model.value
                              ? "border-purple-600 bg-purple-50"
                              : "border-border hover:border-purple-300"
                          }`}
                        >
                          <Icon size={16} className={selectedPricingModel === model.value ? "text-purple-600 mt-0.5" : "text-text-4 mt-0.5"} />
                          <div>
                            <p className="font-syne font-bold text-xs">{model.label}</p>
                            <p className="text-[10px] text-text-4 mt-0.5">{model.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-text-2 mb-1 block">Select Product</label>
                      <select className="w-full h-9 px-3 text-xs rounded-lg border border-border">
                        <option>Choose product to promote...</option>
                        <option>Yamaha F150 Outboard Engine</option>
                        <option>Marine LED Navigation Kit</option>
                        <option>Bilge Pump 2000 GPH</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-2 mb-1 block">Budget (₦)</label>
                      <input type="number" placeholder="e.g. 50000" className="w-full h-9 px-3 text-xs rounded-lg border border-border" />
                    </div>
                    {selectedPricingModel === "duration" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-text-4 mb-0.5 block">Start Date</label>
                          <input type="date" className="w-full h-9 px-3 text-xs rounded-lg border border-border" />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-4 mb-0.5 block">End Date</label>
                          <input type="date" className="w-full h-9 px-3 text-xs rounded-lg border border-border" />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-text-2 mb-1 block">Ad Creative (optional)</label>
                      <div className="h-20 bg-off-white rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-purple-300">
                        <span className="text-xs text-text-4 flex items-center gap-1"><ImageIcon size={14} /> Upload Image</span>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <CreditCard size={14} className="mr-2" /> Pay & Launch Ad
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeAdTab === "active" && (
              <div className="space-y-3">
                {[
                  { product: "Yamaha F150 Outboard", type: "Featured", model: "CPC", budget: "₦50,000", spent: "₦23,400", impressions: 12500, clicks: 342, status: "Active" },
                  { product: "Marine LED Nav Kit", type: "Sponsored", model: "Duration", budget: "₦30,000", spent: "₦30,000", impressions: 8900, clicks: 156, status: "Active" },
                ].map((ad, i) => (
                  <div key={i} className="p-4 bg-off-white rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-syne font-bold text-xs">{ad.product}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">{ad.type}</span>
                        <span className="text-[9px] bg-blue-100 text-blue px-1.5 py-0.5 rounded-full font-semibold">{ad.model}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-text-4">
                        <span>Budget: {ad.budget}</span>
                        <span>Spent: {ad.spent}</span>
                        <span>{ad.impressions.toLocaleString()} views</span>
                        <span>{ad.clicks} clicks</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-success/10 text-success px-2 py-1 rounded-full font-semibold">{ad.status}</span>
                      <Button size="sm" variant="outline">Pause</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeAdTab === "history" && (
              <div className="text-center py-8">
                <Megaphone size={32} className="text-text-4/30 mx-auto mb-2" />
                <p className="text-xs text-text-4">Past ad campaigns will appear here</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-sm">Recent Orders</h3>
              <Link href="/vendor/orders" className="text-xs text-purple-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {[
                { id: "VND-0124", customer: "John O.", product: "Yamaha F150", amount: "₦4,500,000", status: "Processing" },
                { id: "VND-0123", customer: "Grace N.", product: "Marine LED Kit", amount: "₦45,000", status: "Shipped" },
                { id: "VND-0122", customer: "David C.", product: "Bilge Pump", amount: "₦27,500", status: "Delivered" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-mono font-semibold">{order.id}</p>
                    <p className="text-[10px] text-text-4">{order.customer} — {order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-syne font-bold">{order.amount}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                      order.status === "Processing" ? "bg-blue/10 text-blue"
                      : order.status === "Shipped" ? "bg-purple-100 text-purple-700"
                      : "bg-success/10 text-success"
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
