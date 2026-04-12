"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, Loader2, Search, MapPin, X, Truck,
  ToggleLeft, ToggleRight, Package, Clock, DollarSign,
} from "lucide-react";

interface ShippingZone {
  id?: string;
  name: string;
  states: string[];
  methods: ShippingMethod[];
  active: boolean;
  created_at?: string;
}

interface ShippingMethod {
  name: string;
  type: "flat" | "free" | "weight" | "calculated";
  rate: number;
  min_order: number;
  estimated_days: string;
  active: boolean;
}

interface LogisticsPartner {
  id?: string;
  name: string;
  code: string;
  type: string;
  api_connected: boolean;
  coverage: string;
  active: boolean;
  created_at?: string;
}

interface ShippingClass {
  id?: string;
  name: string;
  slug: string;
  description: string;
  surcharge: number;
  product_count: number;
  created_at?: string;
}

const defaultZones: ShippingZone[] = [
  {
    name: "Lagos Metro", states: ["Lagos"], active: true,
    methods: [
      { name: "Standard Delivery", type: "flat", rate: 2500, min_order: 0, estimated_days: "2-3", active: true },
      { name: "Express (Same Day)", type: "flat", rate: 5000, min_order: 0, estimated_days: "Same day", active: true },
      { name: "Free Shipping", type: "free", rate: 0, min_order: 50000, estimated_days: "3-5", active: true },
    ],
  },
  {
    name: "South-South", states: ["Rivers", "Bayelsa", "Delta", "Akwa Ibom", "Cross River", "Edo"], active: true,
    methods: [
      { name: "Standard Delivery", type: "flat", rate: 3500, min_order: 0, estimated_days: "3-5", active: true },
      { name: "Express Delivery", type: "flat", rate: 7000, min_order: 0, estimated_days: "1-2", active: true },
    ],
  },
  {
    name: "Abuja / FCT", states: ["FCT"], active: true,
    methods: [
      { name: "Standard Delivery", type: "flat", rate: 4000, min_order: 0, estimated_days: "3-5", active: true },
      { name: "Free Shipping", type: "free", rate: 0, min_order: 100000, estimated_days: "5-7", active: true },
    ],
  },
  {
    name: "Rest of Nigeria", states: ["All other states"], active: true,
    methods: [
      { name: "Standard Delivery", type: "flat", rate: 5000, min_order: 0, estimated_days: "5-7", active: true },
    ],
  },
];

const defaultPartners: LogisticsPartner[] = [
  { name: "GIG Logistics", code: "gig", type: "3PL", api_connected: true, coverage: "Nationwide", active: true },
  { name: "DHL Express", code: "dhl", type: "International", api_connected: false, coverage: "International", active: true },
  { name: "Kwik Delivery", code: "kwik", type: "Same Day", api_connected: true, coverage: "Lagos, Abuja, PH", active: true },
  { name: "FedEx", code: "fedex", type: "International", api_connected: false, coverage: "International", active: false },
  { name: "In-house Riders", code: "inhouse", type: "Local", api_connected: false, coverage: "Port Harcourt Metro", active: true },
  { name: "ABC Transport", code: "abc", type: "Interstate", api_connected: false, coverage: "Major cities", active: true },
];

const defaultClasses: ShippingClass[] = [
  { name: "Standard", slug: "standard", description: "Regular items, normal handling", surcharge: 0, product_count: 120 },
  { name: "Heavy/Bulky", slug: "heavy-bulky", description: "Items over 25kg or oversized", surcharge: 3000, product_count: 18 },
  { name: "Fragile", slug: "fragile", description: "Glass, electronics requiring special packaging", surcharge: 1500, product_count: 35 },
  { name: "Hazardous", slug: "hazardous", description: "Flammable, corrosive, or restricted items", surcharge: 5000, product_count: 8 },
  { name: "Marine Equipment", slug: "marine", description: "Large marine items, engines, boats", surcharge: 10000, product_count: 12 },
];

export default function ShippingPage() {
  const [tab, setTab] = useState<"zones" | "partners" | "classes">("zones");
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [classes, setClasses] = useState<ShippingClass[]>([]);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zoneForm, setZoneForm] = useState({ name: "", states: "", active: true });
  const [zoneMethods, setZoneMethods] = useState<ShippingMethod[]>([]);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: "", code: "", type: "", coverage: "", active: true });
  const [editingPartner, setEditingPartner] = useState<LogisticsPartner | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [classForm, setClassForm] = useState({ name: "", slug: "", description: "", surcharge: 0 });
  const [editingClass, setEditingClass] = useState<ShippingClass | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [zonesRes, partnersRes, classesRes] = await Promise.all([
        insforge.database.from("shipping_zones").select("*"),
        insforge.database.from("logistics_partners").select("*"),
        insforge.database.from("shipping_classes").select("*"),
      ]);

      if (zonesRes.data && zonesRes.data.length > 0) {
        setZones(zonesRes.data.map((z: Record<string, unknown>) => ({
          ...z,
          states: typeof z.states === "string" ? JSON.parse(z.states as string) : z.states,
          methods: typeof z.methods === "string" ? JSON.parse(z.methods as string) : z.methods,
        })) as ShippingZone[]);
      } else {
        for (const z of defaultZones) await insforge.database.from("shipping_zones").insert({ ...z, states: JSON.stringify(z.states), methods: JSON.stringify(z.methods) });
        const { data } = await insforge.database.from("shipping_zones").select("*");
        setZones((data || []).map((z: Record<string, unknown>) => ({ ...z, states: typeof z.states === "string" ? JSON.parse(z.states as string) : z.states, methods: typeof z.methods === "string" ? JSON.parse(z.methods as string) : z.methods })) as ShippingZone[]);
      }

      if (partnersRes.data && partnersRes.data.length > 0) {
        setPartners(partnersRes.data);
      } else {
        for (const p of defaultPartners) await insforge.database.from("logistics_partners").insert(p);
        const { data } = await insforge.database.from("logistics_partners").select("*");
        setPartners(data || []);
      }

      if (classesRes.data && classesRes.data.length > 0) {
        setClasses(classesRes.data);
      } else {
        for (const c of defaultClasses) await insforge.database.from("shipping_classes").insert(c);
        const { data } = await insforge.database.from("shipping_classes").select("*");
        setClasses(data || []);
      }
    } catch (e) {
      console.error("Failed to load shipping data:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Zone CRUD
  const openZoneCreate = () => {
    setEditingZone(null);
    setZoneForm({ name: "", states: "", active: true });
    setZoneMethods([{ name: "Standard Delivery", type: "flat", rate: 3000, min_order: 0, estimated_days: "3-5", active: true }]);
    setShowZoneModal(true);
  };

  const openZoneEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setZoneForm({ name: zone.name, states: zone.states.join(", "), active: zone.active });
    setZoneMethods([...zone.methods]);
    setShowZoneModal(true);
  };

  const saveZone = async () => {
    if (!zoneForm.name.trim()) return;
    const payload = {
      name: zoneForm.name,
      states: JSON.stringify(zoneForm.states.split(",").map(s => s.trim()).filter(Boolean)),
      methods: JSON.stringify(zoneMethods),
      active: zoneForm.active,
    };
    try {
      if (editingZone?.id) {
        await insforge.database.from("shipping_zones").update(payload).eq("id", editingZone.id);
        setZones(zones.map(z => z.id === editingZone.id ? { ...z, name: zoneForm.name, states: zoneForm.states.split(",").map(s => s.trim()), methods: zoneMethods, active: zoneForm.active } : z));
      } else {
        const { data } = await insforge.database.from("shipping_zones").insert(payload).select("*");
        if (data?.[0]) setZones([...zones, { ...data[0], states: zoneForm.states.split(",").map((s: string) => s.trim()), methods: zoneMethods }]);
      }
      setShowZoneModal(false);
    } catch (e) { console.error("Failed to save zone:", e); }
  };

  const addMethod = () => {
    setZoneMethods([...zoneMethods, { name: "", type: "flat", rate: 0, min_order: 0, estimated_days: "", active: true }]);
  };

  // Partner CRUD
  const openPartnerCreate = () => {
    setEditingPartner(null);
    setPartnerForm({ name: "", code: "", type: "", coverage: "", active: true });
    setShowPartnerModal(true);
  };

  const openPartnerEdit = (p: LogisticsPartner) => {
    setEditingPartner(p);
    setPartnerForm({ name: p.name, code: p.code, type: p.type, coverage: p.coverage, active: p.active });
    setShowPartnerModal(true);
  };

  const savePartner = async () => {
    if (!partnerForm.name.trim()) return;
    const payload = { ...partnerForm, api_connected: false };
    try {
      if (editingPartner?.id) {
        await insforge.database.from("logistics_partners").update({ ...payload, api_connected: editingPartner.api_connected }).eq("id", editingPartner.id);
        setPartners(partners.map(p => p.id === editingPartner.id ? { ...p, ...payload, api_connected: editingPartner.api_connected } : p));
      } else {
        const { data } = await insforge.database.from("logistics_partners").insert(payload).select("*");
        if (data?.[0]) setPartners([...partners, data[0]]);
      }
      setShowPartnerModal(false);
    } catch (e) { console.error("Failed to save partner:", e); }
  };

  // Class CRUD
  const openClassCreate = () => {
    setEditingClass(null);
    setClassForm({ name: "", slug: "", description: "", surcharge: 0 });
    setShowClassModal(true);
  };

  const openClassEdit = (c: ShippingClass) => {
    setEditingClass(c);
    setClassForm({ name: c.name, slug: c.slug, description: c.description, surcharge: c.surcharge });
    setShowClassModal(true);
  };

  const saveClass = async () => {
    if (!classForm.name.trim()) return;
    const slug = classForm.slug || generateSlug(classForm.name);
    const payload = { ...classForm, slug, product_count: 0 };
    try {
      if (editingClass?.id) {
        await insforge.database.from("shipping_classes").update({ ...payload, product_count: editingClass.product_count }).eq("id", editingClass.id);
        setClasses(classes.map(c => c.id === editingClass.id ? { ...c, ...payload, product_count: editingClass.product_count } : c));
      } else {
        const { data } = await insforge.database.from("shipping_classes").insert(payload).select("*");
        if (data?.[0]) setClasses([...classes, data[0]]);
      }
      setShowClassModal(false);
    } catch (e) { console.error("Failed to save class:", e); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const table = deleteConfirm.type === "zone" ? "shipping_zones" : deleteConfirm.type === "partner" ? "logistics_partners" : "shipping_classes";
      await insforge.database.from(table).delete().eq("id", deleteConfirm.id);
      if (deleteConfirm.type === "zone") setZones(zones.filter(z => z.id !== deleteConfirm.id));
      else if (deleteConfirm.type === "partner") setPartners(partners.filter(p => p.id !== deleteConfirm.id));
      else setClasses(classes.filter(c => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (e) { console.error("Failed to delete:", e); }
  };

  if (loading) {
    return (
      <AdminShell title="Shipping & Logistics" subtitle="Manage shipping zones, partners, and classes">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Shipping & Logistics" subtitle="Manage shipping zones, partners, and classes">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-200 w-fit">
        {[
          { key: "zones" as const, label: "Shipping Zones", icon: MapPin },
          { key: "partners" as const, label: "Logistics Partners", icon: Truck },
          { key: "classes" as const, label: "Shipping Classes", icon: Package },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-blue text-white" : "text-text-3 hover:bg-gray-50"}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ZONES TAB */}
      {tab === "zones" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-3">{zones.length} shipping zones configured</p>
            <button onClick={openZoneCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={14} /> Add Zone</button>
          </div>
          <div className="space-y-3">
            {zones.map(zone => (
              <div key={zone.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center"><MapPin size={18} className="text-blue" /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-text-1">{zone.name}</h4>
                        <span className={`w-2 h-2 rounded-full ${zone.active ? "bg-green-500" : "bg-gray-300"}`} />
                      </div>
                      <p className="text-[10px] text-text-4">{zone.states.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openZoneEdit(zone)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteConfirm({ type: "zone", id: zone.id! })} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {zone.methods.map((m, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <div className="flex items-center gap-6">
                        <span className="font-medium text-text-1">{m.name}</span>
                        <span className="text-text-4 flex items-center gap-1"><Clock size={12} /> {m.estimated_days} days</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {m.type === "free" ? (
                          <span className="text-xs text-green-600 font-semibold">FREE over ₦{m.min_order.toLocaleString()}</span>
                        ) : (
                          <span className="text-xs font-semibold text-text-1">₦{m.rate.toLocaleString()}</span>
                        )}
                        <span className={`w-1.5 h-1.5 rounded-full ${m.active ? "bg-green-500" : "bg-gray-300"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PARTNERS TAB */}
      {tab === "partners" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-3">{partners.length} logistics partners</p>
            <button onClick={openPartnerCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={14} /> Add Partner</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {partners.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 group hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                    <Truck size={18} className="text-blue" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openPartnerEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                    <button onClick={() => setDeleteConfirm({ type: "partner", id: p.id! })} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-text-1">{p.name}</h4>
                <p className="text-[10px] text-text-4 mt-0.5">{p.type} &middot; {p.coverage}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${p.api_connected ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"}`}>
                    {p.api_connected ? "API Connected" : "Manual"}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${p.active ? "bg-green-500" : "bg-gray-300"}`} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CLASSES TAB */}
      {tab === "classes" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-3">{classes.length} shipping classes</p>
            <button onClick={openClassCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={14} /> Add Class</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 text-text-4 font-medium">Class</th>
                  <th className="text-left p-3 text-text-4 font-medium">Description</th>
                  <th className="text-right p-3 text-text-4 font-medium">Surcharge</th>
                  <th className="text-right p-3 text-text-4 font-medium">Products</th>
                  <th className="text-right p-3 text-text-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3 font-medium text-text-1">{c.name}</td>
                    <td className="p-3 text-text-3 text-xs">{c.description}</td>
                    <td className="p-3 text-right font-semibold">{c.surcharge > 0 ? `+₦${c.surcharge.toLocaleString()}` : "—"}</td>
                    <td className="p-3 text-right text-text-4">{c.product_count || 0}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openClassEdit(c)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteConfirm({ type: "class", id: c.id! })} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowZoneModal(false)}>
          <div className="bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingZone ? "Edit Zone" : "New Shipping Zone"}</h3>
              <button onClick={() => setShowZoneModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Zone Name *</label>
                <input value={zoneForm.name} onChange={e => setZoneForm({ ...zoneForm, name: e.target.value })} placeholder="e.g. Lagos Metro" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">States (comma-separated)</label>
                <input value={zoneForm.states} onChange={e => setZoneForm({ ...zoneForm, states: e.target.value })} placeholder="e.g. Lagos, Ogun, Oyo" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-text-2">Shipping Methods</label>
                  <button onClick={addMethod} className="text-xs text-blue font-semibold flex items-center gap-1"><Plus size={12} /> Add Method</button>
                </div>
                <div className="space-y-3">
                  {zoneMethods.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg border border-gray-200 space-y-2">
                      <div className="flex gap-2">
                        <input value={m.name} onChange={e => { const u = [...zoneMethods]; u[i] = { ...u[i], name: e.target.value }; setZoneMethods(u); }} placeholder="Method name" className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                        <select value={m.type} onChange={e => { const u = [...zoneMethods]; u[i] = { ...u[i], type: e.target.value as ShippingMethod["type"] }; setZoneMethods(u); }} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
                          <option value="flat">Flat Rate</option>
                          <option value="free">Free</option>
                          <option value="weight">By Weight</option>
                        </select>
                        <button onClick={() => setZoneMethods(zoneMethods.filter((_, j) => j !== i))} className="text-red hover:bg-red/10 p-1.5 rounded-lg"><Trash2 size={13} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input value={m.rate} onChange={e => { const u = [...zoneMethods]; u[i] = { ...u[i], rate: Number(e.target.value) }; setZoneMethods(u); }} type="number" placeholder="Rate (₦)" className="h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                        <input value={m.min_order} onChange={e => { const u = [...zoneMethods]; u[i] = { ...u[i], min_order: Number(e.target.value) }; setZoneMethods(u); }} type="number" placeholder="Min order (₦)" className="h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                        <input value={m.estimated_days} onChange={e => { const u = [...zoneMethods]; u[i] = { ...u[i], estimated_days: e.target.value }; setZoneMethods(u); }} placeholder="Est. days" className="h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowZoneModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={saveZone} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editingZone ? "Update" : "Create"} Zone</button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowPartnerModal(false)}>
          <div className="bg-white rounded-2xl w-[450px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingPartner ? "Edit Partner" : "New Logistics Partner"}</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Partner Name *</label><input value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value, code: generateSlug(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Type</label><select value={partnerForm.type} onChange={e => setPartnerForm({ ...partnerForm, type: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"><option value="">Select...</option><option>3PL</option><option>Same Day</option><option>Interstate</option><option>International</option><option>Local</option></select></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Coverage</label><input value={partnerForm.coverage} onChange={e => setPartnerForm({ ...partnerForm, coverage: e.target.value })} placeholder="e.g. Nationwide" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowPartnerModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={savePartner} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editingPartner ? "Update" : "Add"} Partner</button>
            </div>
          </div>
        </div>
      )}

      {/* Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowClassModal(false)}>
          <div className="bg-white rounded-2xl w-[450px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingClass ? "Edit Class" : "New Shipping Class"}</h3>
              <button onClick={() => setShowClassModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Class Name *</label><input value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Description</label><input value={classForm.description} onChange={e => setClassForm({ ...classForm, description: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Surcharge (₦)</label><input value={classForm.surcharge} onChange={e => setClassForm({ ...classForm, surcharge: Number(e.target.value) })} type="number" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowClassModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={saveClass} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editingClass ? "Update" : "Create"} Class</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete {deleteConfirm.type}?</h3>
            <p className="text-sm text-text-3 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-10 rounded-lg bg-red text-white text-sm font-semibold hover:bg-red/90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
