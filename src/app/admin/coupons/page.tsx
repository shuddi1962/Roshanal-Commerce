"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Ticket, Plus, Search, Edit, Trash2, Copy,
  Percent, DollarSign, TrendingUp, Save,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  min_order: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  per_user: number;
  start_date: string;
  end_date: string;
  status: string;
  applies: string;
}

const seedCoupons: Omit<Coupon, "id">[] = [
  { code: "WELCOME10", type: "percentage", value: 10, min_order: 5000, max_discount: 2000, usage_limit: 1000, used_count: 342, per_user: 1, start_date: "2024-01-01", end_date: "2024-12-31", status: "active", applies: "All Products" },
  { code: "MARINE20", type: "percentage", value: 20, min_order: 50000, max_discount: 15000, usage_limit: 200, used_count: 87, per_user: 2, start_date: "2024-03-01", end_date: "2024-06-30", status: "active", applies: "Marine Category" },
  { code: "FLAT5K", type: "fixed", value: 5000, min_order: 25000, max_discount: null, usage_limit: 500, used_count: 500, per_user: 1, start_date: "2024-01-15", end_date: "2024-04-15", status: "exhausted", applies: "All Products" },
  { code: "SECURITY15", type: "percentage", value: 15, min_order: 30000, max_discount: 10000, usage_limit: 300, used_count: 45, per_user: 3, start_date: "2024-04-01", end_date: "2024-09-30", status: "active", applies: "Security Category" },
  { code: "FREESHIP", type: "free_shipping", value: 0, min_order: 15000, max_discount: null, usage_limit: null, used_count: 1250, per_user: 5, start_date: "2024-01-01", end_date: "2024-12-31", status: "active", applies: "All Products" },
  { code: "FLASH50", type: "percentage", value: 50, min_order: 100000, max_discount: 50000, usage_limit: 50, used_count: 12, per_user: 1, start_date: "2024-03-15", end_date: "2024-03-16", status: "expired", applies: "Selected Products" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "create">("list");
  const [search, setSearch] = useState("");
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "", type: "percentage", value: 10, min_order: 0, max_discount: 0,
    usage_limit: 0, per_user: 1, start_date: "", end_date: "", applies: "All Products",
  });

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    try {
      const { data, error } = await insforge.database.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setCoupons(data);
      } else {
        for (const c of seedCoupons) await insforge.database.from("coupons").insert(c);
        const { data: seeded } = await insforge.database.from("coupons").select("*");
        if (seeded) setCoupons(seeded);
      }
    } catch (err) {
      console.error("Coupons load error:", err);
      setCoupons(seedCoupons.map((c, i) => ({ ...c, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  const saveCoupon = async () => {
    if (!form.code) return;
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.value,
        min_order: form.min_order,
        max_discount: form.max_discount || null,
        usage_limit: form.usage_limit || null,
        per_user: form.per_user,
        start_date: form.start_date,
        end_date: form.end_date,
        applies: form.applies,
      };

      if (editCoupon) {
        await insforge.database.from("coupons").update(payload).eq("id", editCoupon.id);
        setCoupons((prev) => prev.map((c) => c.id === editCoupon.id ? { ...c, ...payload } : c));
        setEditCoupon(null);
        setTab("list");
      } else {
        const { data } = await insforge.database.from("coupons").insert({ ...payload, used_count: 0, status: "active" }).select();
        if (data) setCoupons((prev) => [data[0], ...prev]);
        setTab("list");
      }
      resetForm();
    } catch (err) {
      console.error("Save coupon error:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await insforge.database.from("coupons").delete().eq("id", id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete coupon error:", err);
    }
  };

  const startEdit = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setForm({
      code: coupon.code, type: coupon.type, value: coupon.value, min_order: coupon.min_order,
      max_discount: coupon.max_discount || 0, usage_limit: coupon.usage_limit || 0,
      per_user: coupon.per_user, start_date: coupon.start_date, end_date: coupon.end_date,
      applies: coupon.applies,
    });
    setTab("create");
  };

  const resetForm = () => {
    setForm({ code: "", type: "percentage", value: 10, min_order: 0, max_discount: 0, usage_limit: 0, per_user: 1, start_date: "", end_date: "", applies: "All Products" });
    setEditCoupon(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const filtered = coupons.filter((c) => !search || c.code?.toLowerCase().includes(search.toLowerCase()));
  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const totalUses = coupons.reduce((a, c) => a + (c.used_count || 0), 0);

  return (
    <AdminShell title="Coupons & Discounts" subtitle="Create and manage promotional coupons">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Coupons", value: activeCoupons, icon: Ticket, color: "text-green-600" },
            { label: "Total Uses", value: totalUses.toLocaleString(), icon: TrendingUp, color: "text-blue" },
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
              <button key={t} onClick={() => { setTab(t); if (t === "create" && !editCoupon) resetForm(); }} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
                {t === "list" ? "All Coupons" : editCoupon ? "Edit Coupon" : "Create New"}
              </button>
            ))}
          </div>
          {tab === "list" && (
            <button onClick={() => { resetForm(); setTab("create"); }} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
              <Plus size={16} /> New Coupon
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-4 text-sm">Loading coupons...</div>
        ) : (
          <>
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
                      {filtered.length === 0 ? (
                        <tr><td colSpan={8} className="p-8 text-center text-text-4">No coupons found</td></tr>
                      ) : filtered.map((coupon) => (
                        <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-blue/10 text-blue px-2 py-1 rounded font-mono font-medium">{coupon.code}</code>
                              <button onClick={() => copyCode(coupon.code)} className="text-text-4 hover:text-blue" title="Copy code"><Copy size={12} /></button>
                            </div>
                          </td>
                          <td className="p-4 capitalize text-text-3">{coupon.type?.replace("_", " ")}</td>
                          <td className="p-4 font-medium">{coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? `₦${(coupon.value || 0).toLocaleString()}` : "Free"}</td>
                          <td className="p-4 text-text-3">₦{(coupon.min_order || 0).toLocaleString()}</td>
                          <td className="p-4">
                            <div className="text-text-3">{coupon.used_count || 0}{coupon.usage_limit ? `/${coupon.usage_limit}` : ""}</div>
                            {coupon.usage_limit && (
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1">
                                <div className="h-full bg-blue rounded-full" style={{ width: `${Math.min(((coupon.used_count || 0) / coupon.usage_limit) * 100, 100)}%` }} />
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
                              <button onClick={() => startEdit(coupon)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit"><Edit size={14} className="text-text-4" /></button>
                              <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red" /></button>
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base">{editCoupon ? "Edit Coupon" : "Create Coupon"}</h3>
                  {editCoupon && (
                    <button onClick={() => { resetForm(); setTab("list"); }} className="text-xs text-text-4 hover:text-text-1">Cancel Edit</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Coupon Code</label>
                    <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:border-blue" placeholder="e.g. SUMMER20" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Discount Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₦)</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Discount Value</label>
                    <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Minimum Order (₦)</label>
                    <input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Max Discount (₦)</label>
                    <input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="0 = unlimited" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Usage Limit</label>
                    <input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="0 = unlimited" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Per User Limit</label>
                    <input type="number" value={form.per_user} onChange={(e) => setForm({ ...form, per_user: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Applies To</label>
                    <select value={form.applies} onChange={(e) => setForm({ ...form, applies: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                      <option value="All Products">All Products</option>
                      <option value="Marine Category">Marine Category</option>
                      <option value="Security Category">Security Category</option>
                      <option value="Selected Products">Selected Products</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Start Date</label>
                    <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">End Date</label>
                    <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                  </div>
                </div>
                <button
                  onClick={saveCoupon}
                  disabled={saving || !form.code}
                  className="mt-5 w-full h-11 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editCoupon ? (
                    <><Save size={16} /> Update Coupon</>
                  ) : (
                    <><Ticket size={16} /> Create Coupon</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
