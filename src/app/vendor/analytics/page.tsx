"use client";

import Link from "next/link";
import { BarChart3, TrendingUp, Eye, ShoppingCart, Users, Package } from "lucide-react";

const stats = [
  { label: "Total Views", value: "12,450", change: "+18%", icon: Eye, color: "text-blue-600" },
  { label: "Conversions", value: "342", change: "+12%", icon: ShoppingCart, color: "text-green-600" },
  { label: "Unique Visitors", value: "8,920", change: "+22%", icon: Users, color: "text-purple-600" },
  { label: "Products Sold", value: "156", change: "+8%", icon: Package, color: "text-orange-600" },
];

const topProducts = [
  { name: "Yamaha 200HP Outboard Engine", views: 2340, orders: 12, revenue: 54000000 },
  { name: "Hikvision 4CH CCTV Kit", views: 1890, orders: 45, revenue: 8325000 },
  { name: "Fire Extinguisher 9kg", views: 1456, orders: 89, revenue: 1335000 },
  { name: "Commercial Gas Cooker", views: 1120, orders: 8, revenue: 2800000 },
  { name: "Marine GPS Navigator", views: 890, orders: 15, revenue: 4200000 },
];

const trafficSources = [
  { source: "Direct", visits: 3400, pct: 38 },
  { source: "Search", visits: 2800, pct: 31 },
  { source: "Social", visits: 1500, pct: 17 },
  { source: "Referral", visits: 890, pct: 10 },
  { source: "Email", visits: 330, pct: 4 },
];

const weeklyData = [
  { day: "Mon", views: 1200, orders: 18 },
  { day: "Tue", views: 1450, orders: 22 },
  { day: "Wed", views: 1100, orders: 15 },
  { day: "Thu", views: 1680, orders: 28 },
  { day: "Fri", views: 1900, orders: 35 },
  { day: "Sat", views: 2200, orders: 42 },
  { day: "Sun", views: 1400, orders: 20 },
];

export default function VendorAnalyticsPage() {
  const maxViews = Math.max(...weeklyData.map((d) => d.views));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Analytics</h1><p className="text-sm text-gray-500">Last 30 days performance</p></div>
          <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><TrendingUp size={12} />{s.change}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart3 size={16} /> Weekly Traffic</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400">{d.views}</span>
                <div className="w-full bg-purple-500 rounded-t-lg transition-all" style={{ height: `${(d.views / maxViews) * 100}%` }} />
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-sm mb-4">Top Products</h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.views} views · {p.orders} orders</p>
                  </div>
                  <span className="text-sm font-semibold">₦{(p.revenue / 1e6).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-sm mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {trafficSources.map((t) => (
                <div key={t.source}>
                  <div className="flex justify-between text-xs mb-1"><span>{t.source}</span><span className="text-gray-400">{t.visits} ({t.pct}%)</span></div>
                  <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${t.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
