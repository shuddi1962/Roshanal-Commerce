"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Store, Search, Eye, Edit, CheckCircle2,
  Ban, TrendingUp, DollarSign, Package, Mail,
} from "lucide-react";

const demoVendors = [
  { id: 1, name: "Marine Supplies NG", owner: "Chidi Okafor", email: "chidi@marine.ng", phone: "+234 801 234 5678", products: 45, orders: 234, revenue: 8500000, rating: 4.7, commission: 12, status: "active", joined: "2023-06-15", logo: null },
  { id: 2, name: "SafeGuard Systems", owner: "Emeka Nwosu", email: "emeka@safeguard.com", phone: "+234 802 345 6789", products: 32, orders: 178, revenue: 6200000, rating: 4.5, commission: 10, status: "active", joined: "2023-08-20", logo: null },
  { id: 3, name: "Kitchen Pro Lagos", owner: "Amina Bello", email: "amina@kitchenpro.ng", phone: "+234 803 456 7890", products: 28, orders: 156, revenue: 4800000, rating: 4.2, commission: 15, status: "active", joined: "2023-10-01", logo: null },
  { id: 4, name: "Delta Boat Works", owner: "Tunde Adebayo", email: "tunde@deltaboats.com", phone: "+234 804 567 8901", products: 12, orders: 45, revenue: 15000000, rating: 4.9, commission: 8, status: "active", joined: "2023-05-10", logo: null },
  { id: 5, name: "Fire Safety Plus", owner: "Grace Eze", email: "grace@firesafety.ng", phone: "+234 805 678 9012", products: 18, orders: 89, revenue: 3200000, rating: 3.8, commission: 12, status: "pending", joined: "2024-03-01", logo: null },
  { id: 6, name: "Quick Electronics", owner: "Ibrahim Musa", email: "ibrahim@quickelec.com", phone: "+234 806 789 0123", products: 0, orders: 0, revenue: 0, rating: 0, commission: 12, status: "suspended", joined: "2024-01-15", logo: null },
];

export default function AdminVendorsPage() {
  const [tab, setTab] = useState<"vendors" | "payouts" | "settings">("vendors");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState(demoVendors);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

  const filtered = vendors.filter((v) => {
    if (filter !== "all" && v.status !== filter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.owner.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = vendors.reduce((a, v) => a + v.revenue, 0);
  const totalCommission = vendors.reduce((a, v) => a + (v.revenue * v.commission / 100), 0);

  const handleApprove = (id: number) => {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status: "active" } : v));
    alert("Vendor approved successfully!");
  };

  const handleSuspend = (id: number) => {
    if (confirm("Are you sure you want to suspend this vendor?")) {
      setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status: "suspended" } : v));
    }
  };

  return (
    <AdminShell title="Vendor Management" subtitle="Manage marketplace vendors and commissions">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Vendors", value: demoVendors.length, icon: Store, color: "text-blue" },
            { label: "Vendor Revenue", value: `₦${(totalRevenue / 1e6).toFixed(1)}M`, icon: TrendingUp, color: "text-green-600" },
            { label: "Commission Earned", value: `₦${(totalCommission / 1e6).toFixed(1)}M`, icon: DollarSign, color: "text-purple-600" },
            { label: "Total Products", value: demoVendors.reduce((a, v) => a + v.products, 0), icon: Package, color: "text-blue" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={16} className={s.color} />
                <span className="text-xs text-text-4">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["vendors", "payouts", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "vendors" && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input type="text" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
              </div>
              {["all", "active", "pending", "suspended"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs rounded-lg border capitalize ${filter === f ? "bg-blue text-white border-blue" : "bg-white border-gray-200 text-text-3"}`}>{f}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/20 to-blue/5 flex items-center justify-center">
                        <Store size={20} className="text-blue" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-text-1">{vendor.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            vendor.status === "active" ? "bg-green-100 text-green-700" :
                            vendor.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}>{vendor.status}</span>
                        </div>
                        <p className="text-xs text-text-4">{vendor.owner} · {vendor.email} · Joined {vendor.joined}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedVendor(selectedVendor === vendor.id ? null : vendor.id)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="View"><Eye size={16} className="text-text-4" /></button>
                      <button onClick={() => setSelectedVendor(vendor.id)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit"><Edit size={16} className="text-text-4" /></button>
                      <button onClick={() => { window.location.href = `mailto:${vendor.email}`; }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Email"><Mail size={16} className="text-text-4" /></button>
                      {vendor.status === "active" ? (
                        <button onClick={() => handleSuspend(vendor.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Suspend"><Ban size={16} className="text-red" /></button>
                      ) : vendor.status === "pending" ? (
                        <button onClick={() => handleApprove(vendor.id)} className="p-1.5 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle2 size={16} className="text-green-600" /></button>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: "Products", value: vendor.products },
                      { label: "Orders", value: vendor.orders },
                      { label: "Revenue", value: `₦${(vendor.revenue / 1e6).toFixed(1)}M` },
                      { label: "Commission", value: `${vendor.commission}%` },
                      { label: "Rating", value: vendor.rating > 0 ? `${vendor.rating} ★` : "N/A" },
                    ].map((m) => (
                      <div key={m.label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-text-4">{m.label}</p>
                        <p className="text-sm font-semibold text-text-1">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "payouts" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-base mb-4">Vendor Payouts</h3>
            <div className="space-y-3">
              {demoVendors.filter((v) => v.status === "active" && v.revenue > 0).map((v) => {
                const payout = v.revenue * (1 - v.commission / 100);
                return (
                  <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-text-1">{v.name}</p>
                      <p className="text-xs text-text-4">Commission: {v.commission}% · Revenue: ₦{v.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-600">₦{payout.toLocaleString()}</p>
                      <button className="text-xs text-blue hover:underline mt-1">Process Payout</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-xl space-y-5">
            <h3 className="font-semibold text-base">Marketplace Settings</h3>
            {[
              { label: "Default Commission Rate (%)", type: "number", value: "12" },
              { label: "Minimum Payout Amount (₦)", type: "number", value: "10000" },
              { label: "Payout Frequency", type: "select", options: ["Weekly", "Bi-weekly", "Monthly"] },
              { label: "Auto-approve Vendors", type: "toggle", checked: false },
              { label: "Allow Vendor Shipping", type: "toggle", checked: true },
              { label: "Vendor Can Edit SEO", type: "toggle", checked: false },
              { label: "Vendor Product Approval Required", type: "toggle", checked: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <label className="text-sm text-text-2">{s.label}</label>
                {s.type === "number" && <input type="number" defaultValue={s.value} className="w-24 h-9 px-3 text-sm border border-gray-200 rounded-lg text-right" />}
                {s.type === "select" && (
                  <select defaultValue={s.options?.[0]} className="h-9 px-3 text-sm border border-gray-200 rounded-lg">
                    {s.options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                )}
                {s.type === "toggle" && (
                  <button className={`w-10 h-5 rounded-full transition-colors ${s.checked ? "bg-blue" : "bg-gray-300"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${s.checked ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                )}
              </div>
            ))}
            <button className="w-full h-10 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600">Save Settings</button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
