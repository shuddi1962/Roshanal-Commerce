"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  TrendingUp, DollarSign, ShoppingCart, Users, Eye,
  Package, ArrowUpRight, ArrowDownRight, Smartphone, Monitor,
  Clock, MapPin, BarChart3,
} from "lucide-react";

const kpis = [
  { label: "Total Revenue", value: "₦45.2M", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
  { label: "Orders", value: "1,234", change: "+8.3%", trend: "up", icon: ShoppingCart, color: "text-blue", bg: "bg-blue/10" },
  { label: "Customers", value: "3,456", change: "+15.2%", trend: "up", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Avg Order Value", value: "₦36,650", change: "-2.1%", trend: "down", icon: Package, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Conversion Rate", value: "3.2%", change: "+0.4%", trend: "up", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  { label: "Page Views", value: "89.5K", change: "+22.1%", trend: "up", icon: Eye, color: "text-blue", bg: "bg-blue/10" },
];

const revenueData = [
  { month: "Sep", value: 28 }, { month: "Oct", value: 32 }, { month: "Nov", value: 38 },
  { month: "Dec", value: 52 }, { month: "Jan", value: 35 }, { month: "Feb", value: 41 },
  { month: "Mar", value: 45 },
];

const topProducts = [
  { name: "Hikvision 4CH DVR Kit", sales: 234, revenue: 11700000 },
  { name: "Yamaha 40HP Outboard", sales: 45, revenue: 9900000 },
  { name: "Access Control System", sales: 89, revenue: 6230000 },
  { name: "Fire Alarm Panel", sales: 156, revenue: 4680000 },
  { name: "Life Jacket Adult", sales: 312, revenue: 3120000 },
];

const topLocations = [
  { city: "Lagos", orders: 456, pct: 37 },
  { city: "Port Harcourt", orders: 312, pct: 25 },
  { city: "Abuja", orders: 198, pct: 16 },
  { city: "Warri", orders: 134, pct: 11 },
  { city: "Calabar", orders: 78, pct: 6 },
  { city: "Others", orders: 56, pct: 5 },
];

const trafficSources = [
  { source: "Direct", visits: 12500, pct: 35, color: "bg-blue" },
  { source: "Google Search", visits: 10200, pct: 28, color: "bg-green-500" },
  { source: "Social Media", visits: 7800, pct: 22, color: "bg-purple-500" },
  { source: "WhatsApp", visits: 3500, pct: 10, color: "bg-green-600" },
  { source: "Email", visits: 1800, pct: 5, color: "bg-yellow-500" },
];

const deviceStats = [
  { device: "Mobile", pct: 68, icon: Smartphone },
  { device: "Desktop", pct: 25, icon: Monitor },
  { device: "Tablet", pct: 7, icon: Monitor },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <AdminShell title="Analytics Dashboard" subtitle="Track store performance and visitor insights">
      <div className="space-y-6">
        {/* Period Selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[{ key: "7d", label: "7 Days" }, { key: "30d", label: "30 Days" }, { key: "90d", label: "90 Days" }, { key: "1y", label: "1 Year" }].map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${period === p.key ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>{p.label}</button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon size={16} className={kpi.color} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.trend === "up" ? "text-green-600" : "text-red"}`}>
                  {kpi.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-lg font-bold text-text-1">{kpi.value}</p>
              <p className="text-[10px] text-text-4 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Revenue Trend</h3>
              <p className="text-xs text-text-4">Monthly revenue in millions (₦)</p>
            </div>
            <BarChart3 size={18} className="text-text-4" />
          </div>
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-4 font-medium">₦{d.value}M</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-blue to-blue/60 transition-all" style={{ height: `${(d.value / maxRevenue) * 100}%` }} />
                <span className="text-[10px] text-text-4">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm mb-4">Top Products</h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue/10 text-blue text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-text-4">{p.sales} sales</p>
                  </div>
                  <p className="text-sm font-semibold">₦{(p.revenue / 1e6).toFixed(1)}M</p>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {trafficSources.map((t) => (
                <div key={t.source}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-2">{t.source}</span>
                    <span className="text-text-4">{t.visits.toLocaleString()} ({t.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><MapPin size={14} className="text-blue" /> Top Locations</h3>
            <div className="space-y-2">
              {topLocations.map((l) => (
                <div key={l.city} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{l.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue rounded-full" style={{ width: `${l.pct}%` }} />
                    </div>
                    <span className="text-xs text-text-4 w-16 text-right">{l.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {deviceStats.map((d) => (
                <div key={d.device} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <d.icon size={18} className="text-text-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{d.device}</span>
                      <span className="text-sm font-bold text-text-1">{d.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue rounded-full" style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue/5 rounded-lg text-xs text-text-3">
              <strong>Insight:</strong> 68% of your traffic comes from mobile devices. Ensure all product pages are optimized for mobile viewing.
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Clock size={14} className="text-green-600" />
            <span>Live Activity</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Visitors", value: "47" },
              { label: "Carts Active", value: "12" },
              { label: "Checkout In Progress", value: "4" },
              { label: "Orders Today", value: "23" },
            ].map((a) => (
              <div key={a.label} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-text-1">{a.value}</p>
                <p className="text-xs text-text-4">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
