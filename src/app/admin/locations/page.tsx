"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, Loader2, Search, MapPin, X,
  ToggleLeft, ToggleRight, Warehouse, Phone, Mail, Clock,
  Package, Eye,
} from "lucide-react";

interface StoreLocation {
  id?: string;
  name: string;
  type: "warehouse" | "store" | "pickup" | "office";
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  hours: string;
  manager: string;
  is_default: boolean;
  active: boolean;
  stock_count: number;
  created_at?: string;
}

const defaultLocations: StoreLocation[] = [
  { name: "Port Harcourt HQ Warehouse", type: "warehouse", address: "42 Ada George Road", city: "Port Harcourt", state: "Rivers", phone: "+234 803 123 4567", email: "warehouse@roshanalglobal.com", hours: "Mon-Fri 8am-6pm, Sat 9am-3pm", manager: "Chidi Okoro", is_default: true, active: true, stock_count: 850 },
  { name: "Lagos Showroom", type: "store", address: "15 Admiralty Way, Lekki Phase 1", city: "Lagos", state: "Lagos", phone: "+234 810 234 5678", email: "lagos@roshanalglobal.com", hours: "Mon-Sat 9am-7pm", manager: "Ada Okafor", is_default: false, active: true, stock_count: 320 },
  { name: "Abuja Distribution Center", type: "warehouse", address: "Plot 22, Wuse Zone 5", city: "Abuja", state: "FCT", phone: "+234 813 345 6789", email: "abuja@roshanalglobal.com", hours: "Mon-Fri 8am-5pm", manager: "Emeka Nwachukwu", is_default: false, active: true, stock_count: 210 },
  { name: "Warri Pickup Point", type: "pickup", address: "8 Effurun Roundabout", city: "Warri", state: "Delta", phone: "+234 802 456 7890", email: "warri@roshanalglobal.com", hours: "Mon-Sat 9am-5pm", manager: "Blessing Ade", is_default: false, active: false, stock_count: 0 },
];

const typeIcons: Record<string, typeof Warehouse> = { warehouse: Warehouse, store: MapPin, pickup: Package, office: Mail };
const typeLabels: Record<string, string> = { warehouse: "Warehouse", store: "Retail Store", pickup: "Pickup Point", office: "Office" };

export default function LocationsPage() {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StoreLocation | null>(null);
  const [viewLoc, setViewLoc] = useState<StoreLocation | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "warehouse" as StoreLocation["type"], address: "", city: "", state: "", phone: "", email: "", hours: "", manager: "", is_default: false, active: true });

  useEffect(() => { loadLocations(); }, []);

  const loadLocations = async () => {
    try {
      const { data } = await insforge.database.from("store_locations").select("*").order("name", { ascending: true });
      if (data && data.length > 0) { setLocations(data); } else {
        for (const l of defaultLocations) await insforge.database.from("store_locations").insert(l);
        const { data: seeded } = await insforge.database.from("store_locations").select("*").order("name", { ascending: true });
        setLocations(seeded || []);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ name: "", type: "warehouse", address: "", city: "", state: "", phone: "", email: "", hours: "", manager: "", is_default: false, active: true }); setShowModal(true); };

  const openEdit = (l: StoreLocation) => { setEditing(l); setForm({ name: l.name, type: l.type, address: l.address, city: l.city, state: l.state, phone: l.phone, email: l.email, hours: l.hours, manager: l.manager, is_default: l.is_default, active: l.active }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const payload = { ...form, stock_count: 0 };
    try {
      if (editing?.id) {
        await insforge.database.from("store_locations").update({ ...form }).eq("id", editing.id);
        setLocations(locations.map(l => l.id === editing.id ? { ...l, ...form } as StoreLocation : l));
      } else {
        const { data } = await insforge.database.from("store_locations").insert(payload).select("*");
        if (data?.[0]) setLocations([...locations, data[0]]);
      }
      setShowModal(false);
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (l: StoreLocation) => {
    setLocations(locations.map(loc => loc.id === l.id ? { ...loc, active: !loc.active } : loc));
    if (l.id) await insforge.database.from("store_locations").update({ active: !l.active }).eq("id", l.id);
  };

  const setDefault = async (l: StoreLocation) => {
    const updated = locations.map(loc => ({ ...loc, is_default: loc.id === l.id }));
    setLocations(updated);
    for (const loc of updated) {
      if (loc.id) await insforge.database.from("store_locations").update({ is_default: loc.id === l.id }).eq("id", loc.id);
    }
  };

  const handleDelete = async (id: string) => {
    try { await insforge.database.from("store_locations").delete().eq("id", id); setLocations(locations.filter(l => l.id !== id)); setDeleteConfirm(null); } catch (e) { console.error(e); }
  };

  const filtered = search ? locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase())) : locations;

  if (loading) {
    return (<AdminShell title="Inventory Locations" subtitle="Manage warehouses, stores, and pickup points"><div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div></AdminShell>);
  }

  return (
    <AdminShell title="Inventory Locations" subtitle="Manage warehouses, stores, and pickup points">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Locations", value: locations.length },
          { label: "Active", value: locations.filter(l => l.active).length },
          { label: "Warehouses", value: locations.filter(l => l.type === "warehouse").length },
          { label: "Total Stock", value: locations.reduce((s, l) => s + (l.stock_count || 0), 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-text-1">{s.value}</p>
            <p className="text-xs text-text-4">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search locations..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
        </div>
        <button onClick={openCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={14} /> Add Location</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(loc => {
          const Icon = typeIcons[loc.type] || MapPin;
          return (
            <div key={loc.id} className="bg-white rounded-xl border border-gray-200 p-4 group hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center"><Icon size={18} className="text-blue" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-text-1">{loc.name}</h4>
                      {loc.is_default && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue/10 text-blue">Default</span>}
                    </div>
                    <p className="text-[10px] text-text-4">{typeLabels[loc.type]} &middot; {loc.city}, {loc.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setViewLoc(loc)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-4"><Eye size={13} /></button>
                  <button onClick={() => openEdit(loc)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                  <button onClick={() => setDeleteConfirm(loc.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs text-text-3 mb-3">{loc.address}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-4 flex items-center gap-1"><Package size={10} /> {loc.stock_count || 0} items</span>
                  <span className="text-[10px] text-text-4 flex items-center gap-1"><Clock size={10} /> {loc.hours || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {!loc.is_default && <button onClick={() => setDefault(loc)} className="text-[10px] text-blue font-medium hover:underline">Set Default</button>}
                  <button onClick={() => toggleActive(loc)}>
                    {loc.active ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} className="text-text-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-text-4 mt-3">No locations found.</div>}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[520px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editing ? "Edit Location" : "New Location"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Location Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lagos Warehouse" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as StoreLocation["type"] })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="warehouse">Warehouse</option><option value="store">Retail Store</option><option value="pickup">Pickup Point</option><option value="office">Office</option>
                  </select>
                </div>
              </div>
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">City</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">State</label><input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Business Hours</label><input value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} placeholder="Mon-Fri 8am-6pm" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Manager</label><input value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-text-1">Active</span>
                  <button onClick={() => setForm({ ...form, active: !form.active })}>{form.active ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}</button>
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-text-1">Default</span>
                  <button onClick={() => setForm({ ...form, is_default: !form.is_default })}>{form.is_default ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}</button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editing ? "Update" : "Create"} Location</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewLoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setViewLoc(null)}>
          <div className="bg-white rounded-2xl w-[450px]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center">{(() => { const I = typeIcons[viewLoc.type] || MapPin; return <I size={22} className="text-blue" />; })()}</div>
                <div><h3 className="font-semibold text-lg">{viewLoc.name}</h3><p className="text-xs text-text-4">{typeLabels[viewLoc.type]}</p></div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Address", value: `${viewLoc.address}, ${viewLoc.city}, ${viewLoc.state}` },
                { label: "Phone", value: viewLoc.phone },
                { label: "Email", value: viewLoc.email },
                { label: "Hours", value: viewLoc.hours },
                { label: "Manager", value: viewLoc.manager },
                { label: "Stock Items", value: (viewLoc.stock_count || 0).toString() },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-text-3">{r.label}</span>
                  <span className="text-sm font-medium text-text-1">{r.value || "—"}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setViewLoc(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Close</button>
              <button onClick={() => { setViewLoc(null); openEdit(viewLoc); }} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Location?</h3>
            <p className="text-sm text-text-3 mb-5">Stock assigned to this location will need to be reassigned.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-lg bg-red text-white text-sm font-semibold hover:bg-red/90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
