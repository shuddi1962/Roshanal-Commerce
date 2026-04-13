"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Shield, Search, Plus, Eye, CheckCircle2, Clock, AlertTriangle,
  Mail, X, Save,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Warranty {
  id: string;
  warranty_id: string;
  product: string;
  customer: string;
  email: string;
  serial: string;
  purchase_date: string;
  warranty_end: string;
  period: string;
  status: string;
  claims: number;
}

interface Claim {
  id: string;
  claim_id: string;
  warranty_id: string;
  product: string;
  customer: string;
  issue: string;
  date: string;
  status: string;
  resolution: string | null;
}

const seedWarranties: Omit<Warranty, "id">[] = [
  { warranty_id: "WR-001", product: "Hikvision 4CH DVR Kit", customer: "Chidi Okafor", email: "chidi@email.com", serial: "HKV-2024-001234", purchase_date: "2024-01-15", warranty_end: "2026-01-15", period: "2 years", status: "active", claims: 0 },
  { warranty_id: "WR-002", product: "Yamaha 40HP Outboard", customer: "Emeka Nwosu", email: "emeka@email.com", serial: "YAM-2024-005678", purchase_date: "2024-02-20", warranty_end: "2025-02-20", period: "1 year", status: "active", claims: 1 },
  { warranty_id: "WR-003", product: "Access Control System", customer: "Tunde Adebayo", email: "tunde@email.com", serial: "ACS-2023-009876", purchase_date: "2023-06-10", warranty_end: "2025-06-10", period: "2 years", status: "active", claims: 0 },
  { warranty_id: "WR-004", product: "Fire Alarm Panel", customer: "Grace Eze", email: "grace@email.com", serial: "FAP-2022-003456", purchase_date: "2022-08-05", warranty_end: "2024-08-05", period: "2 years", status: "expired", claims: 2 },
  { warranty_id: "WR-005", product: "Kitchen Hood 90cm", customer: "Amina Bello", email: "amina@email.com", serial: "KTH-2024-007890", purchase_date: "2024-03-01", warranty_end: "2025-03-01", period: "1 year", status: "active", claims: 0 },
];

const seedClaims: Omit<Claim, "id">[] = [
  { claim_id: "CL-001", warranty_id: "WR-002", product: "Yamaha 40HP Outboard", customer: "Emeka Nwosu", issue: "Engine overheating after 30 minutes of use", date: "2024-06-15", status: "resolved", resolution: "Replaced water pump impeller under warranty" },
  { claim_id: "CL-002", warranty_id: "WR-004", product: "Fire Alarm Panel", customer: "Grace Eze", issue: "False alarms triggering randomly", date: "2023-11-20", status: "resolved", resolution: "Firmware update applied, sensor recalibrated" },
  { claim_id: "CL-003", warranty_id: "WR-004", product: "Fire Alarm Panel", customer: "Grace Eze", issue: "Zone 3 not detecting smoke", date: "2024-05-10", status: "pending", resolution: null },
];

const warrantyPolicies = [
  { category: "Security Systems (CCTV, DVR, NVR)", period: "2 years", coverage: "Manufacturing defects, hardware failure" },
  { category: "Marine Engines (Yamaha, Outboard)", period: "1 year", coverage: "Engine defects, electrical issues" },
  { category: "Safety Equipment (Fire, Life Jackets)", period: "1 year", coverage: "Material defects, functional failure" },
  { category: "Access Control & Alarms", period: "2 years", coverage: "Hardware and software defects" },
  { category: "Kitchen Equipment", period: "1 year", coverage: "Motor and electrical defects" },
  { category: "Boat Building", period: "5 years", coverage: "Structural integrity, hull defects" },
];

export default function AdminWarrantyPage() {
  const [tab, setTab] = useState<"registrations" | "claims" | "policies">("registrations");
  const [search, setSearch] = useState("");
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product: "", customer: "", email: "", serial: "", purchase_date: "", period: "1 year" });
  const [saving, setSaving] = useState(false);
  const [viewWarranty, setViewWarranty] = useState<Warranty | null>(null);
  const [resolveModal, setResolveModal] = useState<Claim | null>(null);
  const [resolution, setResolution] = useState("");

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [wRes, cRes] = await Promise.all([
        insforge.database.from("warranties").select("*").order("purchase_date", { ascending: false }),
        insforge.database.from("warranty_claims").select("*").order("date", { ascending: false }),
      ]);
      if (wRes.data && wRes.data.length > 0) setWarranties(wRes.data);
      else {
        for (const w of seedWarranties) await insforge.database.from("warranties").insert(w);
        const { data } = await insforge.database.from("warranties").select("*");
        if (data) setWarranties(data);
      }
      if (cRes.data && cRes.data.length > 0) setClaims(cRes.data);
      else {
        for (const c of seedClaims) await insforge.database.from("warranty_claims").insert(c);
        const { data } = await insforge.database.from("warranty_claims").select("*");
        if (data) setClaims(data);
      }
    } catch {
      setWarranties(seedWarranties.map((w, i) => ({ ...w, id: String(i + 1) })));
      setClaims(seedClaims.map((c, i) => ({ ...c, id: String(i + 1) })));
    } finally { setLoading(false); }
  };

  const registerWarranty = async () => {
    setSaving(true);
    try {
      const periodYears = parseInt(form.period) || 1;
      const pDate = new Date(form.purchase_date);
      const endDate = new Date(pDate);
      endDate.setFullYear(endDate.getFullYear() + periodYears);
      const warranty_id = `WR-${String(warranties.length + 1).padStart(3, "0")}`;
      const payload = { ...form, warranty_id, warranty_end: endDate.toISOString().split("T")[0], status: "active", claims: 0 };
      const { data } = await insforge.database.from("warranties").insert(payload).select();
      if (data) setWarranties((prev) => [data[0], ...prev]);
      setShowModal(false);
      setForm({ product: "", customer: "", email: "", serial: "", purchase_date: "", period: "1 year" });
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const resolveClaim = async () => {
    if (!resolveModal || !resolution.trim()) return;
    setSaving(true);
    try {
      await insforge.database.from("warranty_claims").update({ status: "resolved", resolution }).eq("id", resolveModal.id);
      setClaims((prev) => prev.map((c) => c.id === resolveModal.id ? { ...c, status: "resolved", resolution } : c));
      setResolveModal(null);
      setResolution("");
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const updateClaimStatus = async (id: string, status: string) => {
    try {
      await insforge.database.from("warranty_claims").update({ status }).eq("id", id);
      setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    } catch (err) { console.error(err); }
  };

  const filteredWarranties = warranties.filter((w) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return w.product.toLowerCase().includes(s) || w.customer.toLowerCase().includes(s) || w.serial.toLowerCase().includes(s);
  });

  return (
    <AdminShell title="Warranty Management" subtitle="Track product warranties and process claims">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Warranties", value: warranties.filter((w) => w.status === "active").length, icon: Shield, color: "text-green-600" },
            { label: "Expired", value: warranties.filter((w) => w.status === "expired").length, icon: Clock, color: "text-gray-500" },
            { label: "Open Claims", value: claims.filter((c) => c.status === "pending").length, icon: AlertTriangle, color: "text-yellow-600" },
            { label: "Resolved Claims", value: claims.filter((c) => c.status === "resolved").length, icon: CheckCircle2, color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["registrations", "claims", "policies"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 text-text-4 text-sm">Loading...</div>
        ) : (
          <>
            {tab === "registrations" && (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <input type="text" placeholder="Search by serial, product, or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                  </div>
                  <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600"><Plus size={16} /> Register Warranty</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {["ID", "Product", "Customer", "Serial Number", "Purchase", "Expires", "Status", "Claims", "Actions"].map((h) => (
                        <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredWarranties.map((w) => (
                        <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono text-xs">{w.warranty_id}</td>
                          <td className="p-4 font-medium">{w.product}</td>
                          <td className="p-4"><p>{w.customer}</p><p className="text-xs text-text-4">{w.email}</p></td>
                          <td className="p-4 font-mono text-xs">{w.serial}</td>
                          <td className="p-4 text-xs text-text-3">{w.purchase_date}</td>
                          <td className="p-4 text-xs text-text-3">{w.warranty_end}</td>
                          <td className="p-4"><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${w.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{w.status}</span></td>
                          <td className="p-4 text-center">{w.claims}</td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <button onClick={() => setViewWarranty(w)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                              <button onClick={() => window.open(`mailto:${w.email}?subject=Warranty ${w.warranty_id}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Mail size={14} className="text-text-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === "claims" && (
              <div className="space-y-3">
                {claims.map((claim) => (
                  <div key={claim.id} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-text-4">{claim.claim_id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${claim.status === "resolved" ? "bg-green-100 text-green-700" : claim.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{claim.status}</span>
                        </div>
                        <h4 className="font-semibold text-sm">{claim.product}</h4>
                        <p className="text-xs text-text-4">{claim.customer} · Warranty: {claim.warranty_id} · Filed: {claim.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-3 mb-2"><strong>Issue:</strong> {claim.issue}</p>
                    {claim.resolution && <p className="text-sm text-green-700 bg-green-50 p-2 rounded"><strong>Resolution:</strong> {claim.resolution}</p>}
                    {claim.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { setResolveModal(claim); setResolution(""); }} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">Resolve Claim</button>
                        <button onClick={() => updateClaimStatus(claim.id, "rejected")} className="px-3 py-1.5 text-xs bg-red text-white rounded-lg hover:bg-red-600">Reject Claim</button>
                      </div>
                    )}
                  </div>
                ))}
                {claims.length === 0 && <div className="text-center p-8 text-text-4 text-sm">No claims yet.</div>}
              </div>
            )}

            {tab === "policies" && (
              <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-2xl space-y-4">
                <h3 className="font-semibold text-base">Warranty Policies</h3>
                {warrantyPolicies.map((p, i) => (
                  <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-text-1">{p.category}</h4>
                      <p className="text-xs text-text-4 mt-1">{p.coverage}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-blue">{p.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Register Warranty Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">Register Warranty</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Product Name</label>
                <input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Customer Name</label>
                  <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Serial Number</label>
                <input value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Purchase Date</label>
                  <input type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Warranty Period</label>
                  <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                    <option>1 year</option><option>2 years</option><option>3 years</option><option>5 years</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={registerWarranty} disabled={saving || !form.product || !form.customer || !form.serial} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? "Saving..." : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Warranty Modal */}
      {viewWarranty && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewWarranty(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{viewWarranty.warranty_id}</h2>
              <button onClick={() => setViewWarranty(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-4">Product:</span><span className="font-medium">{viewWarranty.product}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Customer:</span><span className="font-medium">{viewWarranty.customer}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Email:</span><span>{viewWarranty.email}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Serial:</span><code className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{viewWarranty.serial}</code></div>
              <div className="flex justify-between"><span className="text-text-4">Purchased:</span><span>{viewWarranty.purchase_date}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Expires:</span><span>{viewWarranty.warranty_end}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Period:</span><span className="font-semibold text-blue">{viewWarranty.period}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Status:</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${viewWarranty.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{viewWarranty.status}</span></div>
              <div className="flex justify-between"><span className="text-text-4">Claims:</span><span className="font-semibold">{viewWarranty.claims}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Claim Modal */}
      {resolveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setResolveModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">Resolve Claim {resolveModal.claim_id}</h2>
              <button onClick={() => setResolveModal(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5">
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold">{resolveModal.product}</p>
                <p className="text-xs text-text-3 mt-1">{resolveModal.issue}</p>
              </div>
              <label className="text-xs font-semibold text-text-2 mb-1 block">Resolution</label>
              <textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={3} className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" placeholder="Describe how the issue was resolved..." />
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setResolveModal(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={resolveClaim} disabled={saving || !resolution.trim()} className="flex-1 h-10 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={14} /> {saving ? "Saving..." : "Resolve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
