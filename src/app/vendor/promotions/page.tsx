"use client";

import { useState } from "react";
import Link from "next/link";
import { Percent, Plus, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react";

const demoCoupons = [
  { id: 1, code: "VENDOR10", type: "percentage", value: 10, minOrder: 20000, usageLimit: 100, used: 34, active: true, expires: "2024-06-30" },
  { id: 2, code: "SAVE5K", type: "fixed", value: 5000, minOrder: 50000, usageLimit: 50, used: 12, active: true, expires: "2024-12-31" },
  { id: 3, code: "FREESHIP", type: "free_shipping", value: 0, minOrder: 30000, usageLimit: 200, used: 89, active: false, expires: "2024-03-31" },
];

export default function VendorPromotionsPage() {
  const [coupons, setCoupons] = useState(demoCoupons);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", usageLimit: "", expires: "" });

  const toggle = (id: number) => setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const remove = (id: number) => { if (confirm("Delete coupon?")) setCoupons((prev) => prev.filter((c) => c.id !== id)); };
  const addCoupon = () => {
    if (!form.code) { alert("Coupon code required."); return; }
    setCoupons((prev) => [...prev, { id: Date.now(), code: form.code.toUpperCase(), type: form.type, value: Number(form.value) || 0, minOrder: Number(form.minOrder) || 0, usageLimit: Number(form.usageLimit) || 100, used: 0, active: true, expires: form.expires || "2025-12-31" }]);
    setForm({ code: "", type: "percentage", value: "", minOrder: "", usageLimit: "", expires: "" }); setShowAdd(false);
    alert("Coupon created!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Promotions</h1><p className="text-sm text-gray-500">{coupons.length} coupons</p></div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><Plus size={16} /> Create Coupon</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {showAdd && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h3 className="font-semibold text-sm">New Coupon</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input placeholder="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg font-mono uppercase" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg">
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
              {form.type !== "free_shipping" && <input placeholder={form.type === "percentage" ? "Discount %" : "Amount (₦)"} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />}
              <input placeholder="Min Order (₦)" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input placeholder="Usage Limit" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <button onClick={addCoupon} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg">Create</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 text-sm rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        {coupons.map((c) => (
          <div key={c.id} className={`bg-white rounded-xl p-5 border ${c.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Tag size={20} className="text-purple-600" /></div>
                <div>
                  <p className="font-mono font-bold text-lg">{c.code}</p>
                  <p className="text-xs text-gray-400">{c.type === "percentage" ? `${c.value}% off` : c.type === "fixed" ? `₦${c.value.toLocaleString()} off` : "Free shipping"} · Min order ₦{c.minOrder.toLocaleString()} · Expires {c.expires}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-2">
                  <p className="text-sm font-semibold">{c.used}/{c.usageLimit}</p>
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${(c.used / c.usageLimit) * 100}%` }} /></div>
                </div>
                <button onClick={() => toggle(c.id)}>{c.active ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} className="text-gray-400" />}</button>
                <button onClick={() => remove(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-600" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
