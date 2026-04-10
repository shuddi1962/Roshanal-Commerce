"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { Megaphone, Eye, CheckCircle2, XCircle, DollarSign, TrendingUp, Clock } from "lucide-react";

const demoAds = [
  { id: 1, vendor: "Lagos Marine Tech", product: "Yamaha 200HP Engine", type: "Featured Listing", bid: 15000, status: "active", impressions: 4500, clicks: 234, startDate: "2024-03-01", endDate: "2024-03-31" },
  { id: 2, vendor: "SafeHome Nigeria", product: "Hikvision 8CH Kit", type: "Homepage Banner", bid: 25000, status: "pending", impressions: 0, clicks: 0, startDate: "2024-03-15", endDate: "2024-04-15" },
  { id: 3, vendor: "Kitchen Pro Solutions", product: "Commercial Hood System", type: "Category Spotlight", bid: 10000, status: "active", impressions: 2100, clicks: 98, startDate: "2024-02-20", endDate: "2024-03-20" },
  { id: 4, vendor: "Delta Boat Works", product: "Custom Fishing Boat", type: "Featured Listing", bid: 20000, status: "rejected", impressions: 0, clicks: 0, startDate: "2024-03-10", endDate: "2024-04-10" },
  { id: 5, vendor: "Fire Safety Plus", product: "Fire Alarm Bundle", type: "Search Boost", bid: 8000, status: "expired", impressions: 3200, clicks: 156, startDate: "2024-01-01", endDate: "2024-02-28" },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-400",
};

export default function AdminVendorAdsPage() {
  const [ads, setAds] = useState(demoAds);
  const [filter, setFilter] = useState("all");

  const filtered = ads.filter((a) => filter === "all" || a.status === filter);
  const totalRevenue = ads.filter((a) => a.status === "active").reduce((s, a) => s + a.bid, 0);

  const handleApprove = (id: number) => {
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "active" } : a));
    alert("Ad approved and now live!");
  };

  const handleReject = (id: number) => {
    if (confirm("Reject this ad?")) setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a));
  };

  return (
    <AdminShell title="Vendor Ads" subtitle="Manage vendor-sponsored listings and advertisements">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Ads", value: ads.filter((a) => a.status === "active").length, icon: Megaphone, color: "text-green-600" },
            { label: "Pending Review", value: ads.filter((a) => a.status === "pending").length, icon: Clock, color: "text-yellow-600" },
            { label: "Ad Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-blue" },
            { label: "Total Clicks", value: ads.reduce((s, a) => s + a.clicks, 0), icon: TrendingUp, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {["all", "active", "pending", "rejected", "expired"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs rounded-lg border capitalize ${filter === f ? "bg-blue text-white border-blue" : "bg-white border-gray-200 text-text-3"}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[ad.status]}`}>{ad.status}</span>
                    <span className="text-xs text-text-4">{ad.type}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-text-1">{ad.product}</h4>
                  <p className="text-xs text-text-4">by {ad.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-text-1">₦{ad.bid.toLocaleString()}</p>
                  <p className="text-[10px] text-text-4">{ad.startDate} — {ad.endDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-text-4">
                  <span>{ad.impressions.toLocaleString()} impressions</span>
                  <span>{ad.clicks} clicks</span>
                  <span>{ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0"}% CTR</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => alert(`Preview ad: ${ad.product}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                  {ad.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(ad.id)} className="p-1.5 hover:bg-green-50 rounded-lg"><CheckCircle2 size={14} className="text-green-600" /></button>
                      <button onClick={() => handleReject(ad.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><XCircle size={14} className="text-red" /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
