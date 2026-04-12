"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Store, Search, Eye, Edit, CheckCircle2,
  Ban, TrendingUp, DollarSign, Package, Mail, X, Save,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Vendor {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
  commission: number;
  status: string;
  joined: string;
}

const seedVendors: Omit<Vendor, "id">[] = [
  { name: "Marine Supplies NG", owner: "Chidi Okafor", email: "chidi@marine.ng", phone: "+234 801 234 5678", products: 45, orders: 234, revenue: 8500000, rating: 4.7, commission: 12, status: "active", joined: "2023-06-15" },
  { name: "SafeGuard Systems", owner: "Emeka Nwosu", email: "emeka@safeguard.com", phone: "+234 802 345 6789", products: 32, orders: 178, revenue: 6200000, rating: 4.5, commission: 10, status: "active", joined: "2023-08-20" },
  { name: "Kitchen Pro Lagos", owner: "Amina Bello", email: "amina@kitchenpro.ng", phone: "+234 803 456 7890", products: 28, orders: 156, revenue: 4800000, rating: 4.2, commission: 15, status: "active", joined: "2023-10-01" },
  { name: "Delta Boat Works", owner: "Tunde Adebayo", email: "tunde@deltaboats.com", phone: "+234 804 567 8901", products: 12, orders: 45, revenue: 15000000, rating: 4.9, commission: 8, status: "active", joined: "2023-05-10" },
  { name: "Fire Safety Plus", owner: "Grace Eze", email: "grace@firesafety.ng", phone: "+234 805 678 9012", products: 18, orders: 89, revenue: 3200000, rating: 3.8, commission: 12, status: "pending", joined: "2024-03-01" },
  { name: "Quick Electronics", owner: "Ibrahim Musa", email: "ibrahim@quickelec.com", phone: "+234 806 789 0123", products: 0, orders: 0, revenue: 0, rating: 0, commission: 12, status: "suspended", joined: "2024-01-15" },
];

export default function AdminVendorsPage() {
  const [tab, setTab] = useState<"vendors" | "payouts" | "settings">("vendors");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [settings, setSettings] = useState({ default_commission: 12, min_payout: 10000, payout_frequency: "Monthly", auto_approve: false, vendor_shipping: true, vendor_seo: false, product_approval: true });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const { data, error } = await insforge.database.from("vendors").select("*").order("name");
      if (error) throw error;
      if (data && data.length > 0) setVendors(data);
      else {
        for (const v of seedVendors) await insforge.database.from("vendors").insert(v);
        const { data: seeded } = await insforge.database.from("vendors").select("*");
        if (seeded) setVendors(seeded);
      }
      const { data: settingsData } = await insforge.database.from("settings").select("*").eq("key", "vendor_settings");
      if (settingsData?.[0]?.value) setSettings(settingsData[0].value);
    } catch {
      setVendors(seedVendors.map((v, i) => ({ ...v, id: String(i + 1) })));
    } finally { setLoading(false); }
  };

  const updateVendorStatus = async (id: string, status: string) => {
    try {
      await insforge.database.from("vendors").update({ status }).eq("id", id);
      setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    } catch (err) { console.error(err); }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await insforge.database.from("settings").upsert({ key: "vendor_settings", value: settings });
    } catch (err) { console.error(err); } finally { setSavingSettings(false); }
  };

  const filtered = vendors.filter((v) => {
    if (filter !== "all" && v.status !== filter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.owner.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = vendors.reduce((a, v) => a + v.revenue, 0);
  const totalCommission = vendors.reduce((a, v) => a + (v.revenue * v.commission / 100), 0);

  return (
    <AdminShell title="Vendor Management" subtitle="Manage marketplace vendors and commissions">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Vendors", value: vendors.length, icon: Store, color: "text-blue" },
            { label: "Vendor Revenue", value: `₦${(totalRevenue / 1e6).toFixed(1)}M`, icon: TrendingUp, color: "text-green-600" },
            { label: "Commission Earned", value: `₦${(totalCommission / 1e6).toFixed(1)}M`, icon: DollarSign, color: "text-purple-600" },
            { label: "Total Products", value: vendors.reduce((a, v) => a + v.products, 0), icon: Package, color: "text-blue" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["vendors", "payouts", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 text-text-4 text-sm">Loading...</div>
        ) : (
          <>
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
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/20 to-blue/5 flex items-center justify-center"><Store size={20} className="text-blue" /></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm text-text-1">{vendor.name}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${vendor.status === "active" ? "bg-green-100 text-green-700" : vendor.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{vendor.status}</span>
                            </div>
                            <p className="text-xs text-text-4">{vendor.owner} · {vendor.email} · Joined {vendor.joined}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewVendor(vendor)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-text-4" /></button>
                          <button onClick={() => window.open(`mailto:${vendor.email}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Mail size={16} className="text-text-4" /></button>
                          {vendor.status === "active" && <button onClick={() => { if (confirm("Suspend this vendor?")) updateVendorStatus(vendor.id, "suspended"); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Ban size={16} className="text-red" /></button>}
                          {vendor.status === "pending" && <button onClick={() => updateVendorStatus(vendor.id, "active")} className="p-1.5 hover:bg-green-50 rounded-lg"><CheckCircle2 size={16} className="text-green-600" /></button>}
                          {vendor.status === "suspended" && <button onClick={() => updateVendorStatus(vendor.id, "active")} className="p-1.5 hover:bg-green-50 rounded-lg"><CheckCircle2 size={16} className="text-green-600" /></button>}
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
                  {vendors.filter((v) => v.status === "active" && v.revenue > 0).map((v) => {
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
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <label className="text-sm text-text-2">Default Commission Rate (%)</label>
                  <input type="number" value={settings.default_commission} onChange={(e) => setSettings({ ...settings, default_commission: +e.target.value })} className="w-24 h-9 px-3 text-sm border border-gray-200 rounded-lg text-right" />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <label className="text-sm text-text-2">Minimum Payout Amount (₦)</label>
                  <input type="number" value={settings.min_payout} onChange={(e) => setSettings({ ...settings, min_payout: +e.target.value })} className="w-24 h-9 px-3 text-sm border border-gray-200 rounded-lg text-right" />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <label className="text-sm text-text-2">Payout Frequency</label>
                  <select value={settings.payout_frequency} onChange={(e) => setSettings({ ...settings, payout_frequency: e.target.value })} className="h-9 px-3 text-sm border border-gray-200 rounded-lg">
                    <option>Weekly</option><option>Bi-weekly</option><option>Monthly</option>
                  </select>
                </div>
                {[
                  { key: "auto_approve" as const, label: "Auto-approve Vendors" },
                  { key: "vendor_shipping" as const, label: "Allow Vendor Shipping" },
                  { key: "vendor_seo" as const, label: "Vendor Can Edit SEO" },
                  { key: "product_approval" as const, label: "Vendor Product Approval Required" },
                ].map((s) => (
                  <div key={s.key} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <label className="text-sm text-text-2">{s.label}</label>
                    <button onClick={() => setSettings({ ...settings, [s.key]: !settings[s.key] })} className={`w-10 h-5 rounded-full transition-colors ${settings[s.key] ? "bg-blue" : "bg-gray-300"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${settings[s.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
                <button onClick={saveSettings} disabled={savingSettings} className="w-full h-10 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-2">
                  <Save size={14} /> {savingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Vendor Modal */}
      {viewVendor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewVendor(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{viewVendor.name}</h2>
              <button onClick={() => setViewVendor(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-4">Owner:</span><p className="font-medium">{viewVendor.owner}</p></div>
                <div><span className="text-text-4">Email:</span><p className="font-medium text-xs">{viewVendor.email}</p></div>
                <div><span className="text-text-4">Phone:</span><p className="font-medium">{viewVendor.phone}</p></div>
                <div><span className="text-text-4">Joined:</span><p className="font-medium">{viewVendor.joined}</p></div>
                <div><span className="text-text-4">Products:</span><p className="font-semibold">{viewVendor.products}</p></div>
                <div><span className="text-text-4">Orders:</span><p className="font-semibold">{viewVendor.orders}</p></div>
                <div><span className="text-text-4">Revenue:</span><p className="font-semibold text-green-600">₦{viewVendor.revenue.toLocaleString()}</p></div>
                <div><span className="text-text-4">Commission:</span><p className="font-semibold">{viewVendor.commission}%</p></div>
                <div><span className="text-text-4">Rating:</span><p className="font-semibold">{viewVendor.rating > 0 ? `${viewVendor.rating} / 5` : "N/A"}</p></div>
                <div><span className="text-text-4">Status:</span><p><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${viewVendor.status === "active" ? "bg-green-100 text-green-700" : viewVendor.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{viewVendor.status}</span></p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
