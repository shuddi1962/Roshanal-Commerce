"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/admin-shell";
import { Image, Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const demoBanners = [
  { id: 1, title: "Summer Sale 2024", position: "Hero Slider", image: "/banners/summer.jpg", link: "/deals", active: true, clicks: 1245, views: 8900, startDate: "2024-03-01", endDate: "2024-06-30" },
  { id: 2, title: "New Marine Products", position: "Hero Slider", image: "/banners/marine.jpg", link: "/shop/marine", active: true, clicks: 890, views: 5600, startDate: "2024-02-15", endDate: "2024-12-31" },
  { id: 3, title: "Free Shipping Weekend", position: "Promo Bar", image: "/banners/shipping.jpg", link: "/shop", active: false, clicks: 456, views: 3200, startDate: "2024-03-08", endDate: "2024-03-10" },
  { id: 4, title: "Boat Engine Special", position: "Category Banner", image: "/banners/engines.jpg", link: "/category/boat-engines", active: true, clicks: 678, views: 4100, startDate: "2024-01-01", endDate: "2024-12-31" },
  { id: 5, title: "Safety Equipment Sale", position: "Sidebar", image: "/banners/safety.jpg", link: "/safety", active: true, clicks: 234, views: 1800, startDate: "2024-03-01", endDate: "2024-04-30" },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(demoBanners);

  const toggleBanner = (id: number) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  };

  const deleteBanner = (id: number) => {
    if (confirm("Delete this banner?")) setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <AdminShell title="Banner Management" subtitle="Manage promotional banners across the store">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Banners", value: banners.filter((b) => b.active).length },
              { label: "Total Clicks", value: banners.reduce((a, b) => a + b.clicks, 0).toLocaleString() },
              { label: "Total Views", value: banners.reduce((a, b) => a + b.views, 0).toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-text-4">{s.label}</p>
                <p className="text-xl font-bold text-text-1">{s.value}</p>
              </div>
            ))}
          </div>
          <Link href="/admin/banners/builder" className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600">
            <Plus size={16} /> Create Banner
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Banner", "Position", "Status", "Clicks", "Views", "CTR", "Schedule", "Actions"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Image size={16} className="text-text-4" /></div>
                      <span className="font-medium">{banner.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-3">{banner.position}</td>
                  <td className="p-4">
                    <button onClick={() => toggleBanner(banner.id)} className="flex items-center gap-1">
                      {banner.active ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-text-4" />}
                      <span className={`text-xs ${banner.active ? "text-green-600" : "text-text-4"}`}>{banner.active ? "Active" : "Inactive"}</span>
                    </button>
                  </td>
                  <td className="p-4 font-semibold">{banner.clicks.toLocaleString()}</td>
                  <td className="p-4">{banner.views.toLocaleString()}</td>
                  <td className="p-4 font-medium text-blue">{((banner.clicks / banner.views) * 100).toFixed(1)}%</td>
                  <td className="p-4 text-xs text-text-4">{banner.startDate} — {banner.endDate}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => alert(`Preview: ${banner.title}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                      <Link href="/admin/banners/builder" className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></Link>
                      <button onClick={() => deleteBanner(banner.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
