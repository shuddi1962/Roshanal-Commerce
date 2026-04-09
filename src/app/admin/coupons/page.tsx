"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Ticket, Plus, Search, Edit, Trash2, Copy,
  Percent, DollarSign, TrendingUp,
} from "lucide-react";

const demoCoupons = [
  { id: 1, code: "WELCOME10", type: "percentage" as const, value: 10, minOrder: 5000, maxDiscount: 2000, usageLimit: 1000, usedCount: 342, startDate: "2024-01-01", endDate: "2024-12-31", status: "active", applies: "All Products", perUser: 1 },
  { id: 2, code: "MARINE20", type: "percentage" as const, value: 20, minOrder: 50000, maxDiscount: 15000, usageLimit: 200, usedCount: 87, startDate: "2024-03-01", endDate: "2024-06-30", status: "active", applies: "Marine Category", perUser: 2 },
  { id: 3, code: "FLAT5K", type: "fixed" as const, value: 5000, minOrder: 25000, maxDiscount: null, usageLimit: 500, usedCount: 500, startDate: "2024-01-15", endDate: "2024-04-15", status: "exhausted", applies: "All Products", perUser: 1 },
  { id: 4, code: "SECURITY15", type: "percentage" as const, value: 15, minOrder: 30000, maxDiscount: 10000, usageLimit: 300, usedCount: 45, startDate: "2024-04-01", endDate: "2024-09-30", status: "active", applies: "Security Category", perUser: 3 },
  { id: 5, code: "FREESHIP", type: "free_shipping" as const, value: 0, minOrder: 15000, maxDiscount: null, usageLimit: null, usedCount: 1250, startDate: "2024-01-01", endDate: "2024-12-31", status: "active", applies: "All Products", perUser: 5 },
  { id: 6, code: "FLASH50", type: "percentage" as const, value: 50, minOrder: 100000, maxDiscount: 50000, usageLimit: 50, usedCount: 12, startDate: "2024-03-15", endDate: "2024-03-16", status: "expired", applies: "Selected Products", perUser: 1 },
];

export default function AdminCouponsPage() {
  const [tab, setTab] = useState<"list" | "create">("list");
  const [search, setSearch] = useState("");
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percentage", value: 10, minOrder: 0, maxDiscount: 0, usageLimit: 0, perUser: 1, startDate: "", endDate: "", applies: "all" });

  return (
    <AdminShell title="Coupons & Discounts" subtitle="Create and manage promotional coupons">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Coupons", value: demoCoupons.filter((c) => c.status === "active").length, icon: Ticket, color: "text-green-600" },
            { label: "Total Uses", value: demoCoupons.reduce((a, c) => a + c.usedCount, 0).toLocaleString(), icon: TrendingUp, color: "text-blue" },
            { label: "Avg Discount", value: "₦3.2K", icon: Percent, color: "text-purple-600" },
            { label: "Revenue Protected", value: "₦1.2M", icon: DollarSign, color: "text-green-600" },
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
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(["list", "create"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
                {t === "list" ? "All Coupons" : "Create New"}
              </button>
            ))}
          </div>
          {tab === "list" && (
            <button onClick={() => setTab("create")} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
              <Plus size={16} /> New Coupon
            </button>
          )}
        </div>

        {tab === "list" && (
          <>
            <div className="relative max-w-sm">
              <input type="text" placeholder="Search coupons..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Code", "Type", "Value", "Min Order", "Usage", "Applies To", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {demoCoupons.filter((c) => !search || c.code.toLowerCase().includes(search.toLowerCase())).map((coupon) => (
                    <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-blue/10 text-blue px-2 py-1 rounded font-mono font-medium">{coupon.code}</code>
                          <button className="text-text-4 hover:text-blue"><Copy size={12} /></button>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-text-3">{coupon.type.replace("_", " ")}</td>
                      <td className="p-4 font-medium">{coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? `₦${coupon.value.toLocaleString()}` : "Free"}</td>
                      <td className="p-4 text-text-3">₦{coupon.minOrder.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="text-text-3">{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}</div>
                        {coupon.usageLimit && (
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1">
                            <div className="h-full bg-blue rounded-full" style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }} />
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-text-4">{coupon.applies}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          coupon.status === "active" ? "bg-green-100 text-green-700" :
                          coupon.status === "exhausted" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                        }`}>{coupon.status}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "create" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-2xl">
            <h3 className="font-semibold text-base mb-4">Create Coupon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-3 mb-1 block">Coupon Code</label>
                <input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg font-mono" placeholder="e.g. SUMMER20" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Discount Type</label>
                <select value={newCoupon.type} onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Discount Value</label>
                <input type="number" value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Minimum Order (₦)</label>
                <input type="number" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Max Discount (₦)</label>
                <input type="number" value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" placeholder="0 = unlimited" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Usage Limit</label>
                <input type="number" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" placeholder="0 = unlimited" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Per User Limit</label>
                <input type="number" value={newCoupon.perUser} onChange={(e) => setNewCoupon({ ...newCoupon, perUser: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Applies To</label>
                <select value={newCoupon.applies} onChange={(e) => setNewCoupon({ ...newCoupon, applies: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg">
                  <option value="all">All Products</option>
                  <option value="category">Specific Category</option>
                  <option value="products">Selected Products</option>
                  <option value="brands">Specific Brands</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Start Date</label>
                <input type="date" value={newCoupon.startDate} onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">End Date</label>
                <input type="date" value={newCoupon.endDate} onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              </div>
            </div>
            <button className="mt-5 w-full h-11 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <Ticket size={16} /> Create Coupon
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
