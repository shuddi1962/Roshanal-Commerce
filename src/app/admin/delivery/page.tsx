"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Truck, MapPin, Star, CheckCircle2,
  Eye, Plus, AlertTriangle, Users, X, Save, Edit, Trash2, Phone,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Rider {
  id: string;
  name: string;
  phone: string;
  zone: string;
  status: string;
  deliveries: number;
  rating: number;
  vehicle: string;
  current_order: string | null;
}

interface Delivery {
  id: string;
  delivery_id: string;
  order_id: string;
  customer: string;
  address: string;
  rider: string | null;
  status: string;
  eta: string;
}

interface DeliveryZone {
  id: string;
  zone: string;
  riders: number;
  fee: number;
  deliveries: number;
  active: boolean;
}

const seedRiders: Omit<Rider, "id">[] = [
  { name: "Adamu Suleiman", phone: "+234 801 111 2222", zone: "Port Harcourt", status: "available", deliveries: 342, rating: 4.8, vehicle: "Motorcycle", current_order: null },
  { name: "Kunle Ajayi", phone: "+234 802 222 3333", zone: "Lagos Mainland", status: "on_delivery", deliveries: 289, rating: 4.6, vehicle: "Van", current_order: "ORD-1234" },
  { name: "Musa Abdullahi", phone: "+234 803 333 4444", zone: "Lagos Island", status: "available", deliveries: 198, rating: 4.9, vehicle: "Motorcycle", current_order: null },
  { name: "Chika Obi", phone: "+234 804 444 5555", zone: "Abuja", status: "on_delivery", deliveries: 156, rating: 4.4, vehicle: "Van", current_order: "ORD-1235" },
  { name: "Yusuf Hassan", phone: "+234 805 555 6666", zone: "Warri", status: "offline", deliveries: 87, rating: 4.2, vehicle: "Motorcycle", current_order: null },
  { name: "Emeka Igwe", phone: "+234 806 666 7777", zone: "Port Harcourt", status: "available", deliveries: 445, rating: 4.7, vehicle: "Truck", current_order: null },
];

const seedDeliveries: Omit<Delivery, "id">[] = [
  { delivery_id: "DEL-001", order_id: "ORD-1234", customer: "Chidi Okafor", address: "12 Aba Rd, Port Harcourt", rider: "Kunle Ajayi", status: "in_transit", eta: "30 mins" },
  { delivery_id: "DEL-002", order_id: "ORD-1235", customer: "Amina Bello", address: "45 Lekki Phase 1, Lagos", rider: "Chika Obi", status: "in_transit", eta: "45 mins" },
  { delivery_id: "DEL-003", order_id: "ORD-1236", customer: "Tunde Ade", address: "Plot 8 Wuse 2, Abuja", rider: null, status: "pending", eta: "-" },
  { delivery_id: "DEL-004", order_id: "ORD-1237", customer: "Grace Eze", address: "7 Stadium Rd, PH", rider: "Adamu Suleiman", status: "delivered", eta: "Delivered" },
];

const seedZones: Omit<DeliveryZone, "id">[] = [
  { zone: "Port Harcourt", riders: 2, fee: 1500, deliveries: 1240, active: true },
  { zone: "Lagos Mainland", riders: 1, fee: 2000, deliveries: 890, active: true },
  { zone: "Lagos Island", riders: 1, fee: 2500, deliveries: 650, active: true },
  { zone: "Abuja", riders: 1, fee: 3000, deliveries: 420, active: true },
  { zone: "Warri", riders: 1, fee: 2000, deliveries: 230, active: true },
  { zone: "Calabar", riders: 0, fee: 3500, deliveries: 0, active: false },
];

export default function AdminDeliveryPage() {
  const [tab, setTab] = useState<"riders" | "active" | "zones">("riders");
  const [riders, setRiders] = useState<Rider[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [editRider, setEditRider] = useState<Rider | null>(null);
  const [riderForm, setRiderForm] = useState({ name: "", phone: "", zone: "Port Harcourt", vehicle: "Motorcycle" });
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editZone, setEditZone] = useState<DeliveryZone | null>(null);
  const [zoneForm, setZoneForm] = useState({ zone: "", fee: 0 });
  const [viewRider, setViewRider] = useState<Rider | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [rRes, dRes, zRes] = await Promise.all([
        insforge.database.from("delivery_riders").select("*").order("name"),
        insforge.database.from("deliveries").select("*").order("created_at", { ascending: false }),
        insforge.database.from("delivery_zones").select("*").order("zone"),
      ]);
      if (rRes.data && rRes.data.length > 0) setRiders(rRes.data);
      else {
        for (const r of seedRiders) await insforge.database.from("delivery_riders").insert(r);
        const { data } = await insforge.database.from("delivery_riders").select("*");
        if (data) setRiders(data);
      }
      if (dRes.data && dRes.data.length > 0) setDeliveries(dRes.data);
      else {
        for (const d of seedDeliveries) await insforge.database.from("deliveries").insert(d);
        const { data } = await insforge.database.from("deliveries").select("*");
        if (data) setDeliveries(data);
      }
      if (zRes.data && zRes.data.length > 0) setZones(zRes.data);
      else {
        for (const z of seedZones) await insforge.database.from("delivery_zones").insert(z);
        const { data } = await insforge.database.from("delivery_zones").select("*");
        if (data) setZones(data);
      }
    } catch {
      setRiders(seedRiders.map((r, i) => ({ ...r, id: String(i + 1) })));
      setDeliveries(seedDeliveries.map((d, i) => ({ ...d, id: String(i + 1) })));
      setZones(seedZones.map((z, i) => ({ ...z, id: String(i + 1) })));
    } finally { setLoading(false); }
  };

  const saveRider = async () => {
    setSaving(true);
    try {
      if (editRider) {
        await insforge.database.from("delivery_riders").update(riderForm).eq("id", editRider.id);
        setRiders((prev) => prev.map((r) => r.id === editRider.id ? { ...r, ...riderForm } : r));
      } else {
        const { data } = await insforge.database.from("delivery_riders").insert({ ...riderForm, status: "available", deliveries: 0, rating: 0, current_order: null }).select();
        if (data) setRiders((prev) => [...prev, data[0]]);
      }
      closeRiderModal();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const deleteRider = async (id: string) => {
    if (!confirm("Remove this rider?")) return;
    try {
      await insforge.database.from("delivery_riders").delete().eq("id", id);
      setRiders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) { console.error(err); }
  };

  const assignRider = async (deliveryId: string, riderName: string) => {
    try {
      await insforge.database.from("deliveries").update({ rider: riderName, status: "in_transit" }).eq("id", deliveryId);
      setDeliveries((prev) => prev.map((d) => d.id === deliveryId ? { ...d, rider: riderName, status: "in_transit" } : d));
    } catch (err) { console.error(err); }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      await insforge.database.from("deliveries").update({ status, eta: status === "delivered" ? "Delivered" : undefined }).eq("id", deliveryId);
      setDeliveries((prev) => prev.map((d) => d.id === deliveryId ? { ...d, status, eta: status === "delivered" ? "Delivered" : d.eta } : d));
    } catch (err) { console.error(err); }
  };

  const saveZone = async () => {
    setSaving(true);
    try {
      if (editZone) {
        await insforge.database.from("delivery_zones").update(zoneForm).eq("id", editZone.id);
        setZones((prev) => prev.map((z) => z.id === editZone.id ? { ...z, ...zoneForm } : z));
      } else {
        const { data } = await insforge.database.from("delivery_zones").insert({ ...zoneForm, riders: 0, deliveries: 0, active: true }).select();
        if (data) setZones((prev) => [...prev, data[0]]);
      }
      setShowZoneModal(false); setEditZone(null); setZoneForm({ zone: "", fee: 0 });
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const toggleZone = async (zone: DeliveryZone) => {
    try {
      await insforge.database.from("delivery_zones").update({ active: !zone.active }).eq("id", zone.id);
      setZones((prev) => prev.map((z) => z.id === zone.id ? { ...z, active: !z.active } : z));
    } catch (err) { console.error(err); }
  };

  const closeRiderModal = () => { setShowRiderModal(false); setEditRider(null); setRiderForm({ name: "", phone: "", zone: "Port Harcourt", vehicle: "Motorcycle" }); };

  const availableRiders = riders.filter((r) => r.status === "available");

  return (
    <AdminShell title="Delivery Management" subtitle="Manage delivery riders and track shipments">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Riders", value: riders.length, icon: Users, color: "text-blue" },
            { label: "Available Now", value: riders.filter((r) => r.status === "available").length, icon: CheckCircle2, color: "text-green-600" },
            { label: "Active Deliveries", value: deliveries.filter((d) => d.status === "in_transit").length, icon: Truck, color: "text-yellow-600" },
            { label: "Pending Assignment", value: deliveries.filter((d) => d.status === "pending").length, icon: AlertTriangle, color: "text-red" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["riders", "active", "zones"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t === "active" ? "Active Deliveries" : t === "zones" ? "Delivery Zones" : "Riders"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 text-text-4 text-sm">Loading...</div>
        ) : (
          <>
            {tab === "riders" && (
              <div className="space-y-3">
                {riders.map((rider) => (
                  <div key={rider.id} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${rider.status === "available" ? "bg-green-500" : rider.status === "on_delivery" ? "bg-yellow-500" : "bg-gray-400"}`}>
                        {rider.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{rider.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rider.status === "available" ? "bg-green-100 text-green-700" : rider.status === "on_delivery" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                            {rider.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-text-4">{rider.phone} · {rider.zone} · {rider.vehicle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center"><p className="text-xs text-text-4">Deliveries</p><p className="font-semibold text-sm">{rider.deliveries}</p></div>
                      <div className="text-center"><p className="text-xs text-text-4">Rating</p><p className="font-semibold text-sm flex items-center gap-1">{rider.rating} <Star size={12} className="text-yellow-400 fill-yellow-400" /></p></div>
                      {rider.current_order && <span className="text-xs bg-blue/10 text-blue px-2 py-1 rounded">{rider.current_order}</span>}
                      <button onClick={() => setViewRider(rider)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-text-4" /></button>
                      <button onClick={() => { setEditRider(rider); setRiderForm({ name: rider.name, phone: rider.phone, zone: rider.zone, vehicle: rider.vehicle }); setShowRiderModal(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                      <button onClick={() => deleteRider(rider.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setEditRider(null); setRiderForm({ name: "", phone: "", zone: "Port Harcourt", vehicle: "Motorcycle" }); setShowRiderModal(true); }} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-text-4 hover:border-blue hover:text-blue transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add New Rider
                </button>
              </div>
            )}

            {tab === "active" && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    {["Delivery ID", "Order", "Customer", "Address", "Rider", "Status", "ETA", "Actions"].map((h) => (
                      <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {deliveries.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 font-mono text-xs">{d.delivery_id}</td>
                        <td className="p-4 text-blue font-medium">{d.order_id}</td>
                        <td className="p-4">{d.customer}</td>
                        <td className="p-4 text-text-3 text-xs max-w-[200px] truncate">{d.address}</td>
                        <td className="p-4">
                          {d.rider || (
                            <select onChange={(e) => { if (e.target.value) assignRider(d.id, e.target.value); }} className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                              <option value="">Assign...</option>
                              {availableRiders.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                          )}
                        </td>
                        <td className="p-4"><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${d.status === "in_transit" ? "bg-yellow-100 text-yellow-700" : d.status === "delivered" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{d.status.replace("_", " ")}</span></td>
                        <td className="p-4 text-text-3">{d.eta}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {d.status === "in_transit" && (
                              <button onClick={() => updateDeliveryStatus(d.id, "delivered")} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Mark Delivered</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "zones" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zones.map((z) => (
                    <div key={z.id} className={`bg-white rounded-xl p-4 border ${z.active ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><MapPin size={14} className="text-blue" />{z.zone}</h4>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleZone(z)} className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer ${z.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{z.active ? "Active" : "Inactive"}</button>
                          <button onClick={() => { setEditZone(z); setZoneForm({ zone: z.zone, fee: z.fee }); setShowZoneModal(true); }} className="p-1 hover:bg-gray-100 rounded"><Edit size={12} className="text-text-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><p className="text-[10px] text-text-4">Riders</p><p className="font-semibold text-sm">{z.riders}</p></div>
                        <div><p className="text-[10px] text-text-4">Delivery Fee</p><p className="font-semibold text-sm">₦{z.fee.toLocaleString()}</p></div>
                        <div><p className="text-[10px] text-text-4">Total</p><p className="font-semibold text-sm">{z.deliveries}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setEditZone(null); setZoneForm({ zone: "", fee: 0 }); setShowZoneModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600">
                  <Plus size={16} /> Add Zone
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rider Add/Edit Modal */}
      {showRiderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeRiderModal}>
          <div className="bg-white rounded-2xl w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{editRider ? "Edit Rider" : "Add Rider"}</h2>
              <button onClick={closeRiderModal} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Full Name</label>
                <input value={riderForm.name} onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Phone</label>
                <input value={riderForm.phone} onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Zone</label>
                  <select value={riderForm.zone} onChange={(e) => setRiderForm({ ...riderForm, zone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                    {zones.map((z) => <option key={z.id} value={z.zone}>{z.zone}</option>)}
                    <option>Port Harcourt</option><option>Lagos Mainland</option><option>Lagos Island</option><option>Abuja</option><option>Warri</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Vehicle</label>
                  <select value={riderForm.vehicle} onChange={(e) => setRiderForm({ ...riderForm, vehicle: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                    <option>Motorcycle</option><option>Van</option><option>Truck</option><option>Bicycle</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={closeRiderModal} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={saveRider} disabled={saving || !riderForm.name} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? "Saving..." : editRider ? "Update" : "Add Rider"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Rider Modal */}
      {viewRider && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewRider(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{viewRider.name}</h2>
              <button onClick={() => setViewRider(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${viewRider.status === "available" ? "bg-green-500" : viewRider.status === "on_delivery" ? "bg-yellow-500" : "bg-gray-400"}`}>
                  {viewRider.name.charAt(0)}
                </div>
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${viewRider.status === "available" ? "bg-green-100 text-green-700" : viewRider.status === "on_delivery" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                    {viewRider.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-4">Phone:</span> <span className="font-medium">{viewRider.phone}</span></div>
                <div><span className="text-text-4">Zone:</span> <span className="font-medium">{viewRider.zone}</span></div>
                <div><span className="text-text-4">Vehicle:</span> <span className="font-medium">{viewRider.vehicle}</span></div>
                <div><span className="text-text-4">Rating:</span> <span className="font-medium">{viewRider.rating} / 5</span></div>
                <div><span className="text-text-4">Deliveries:</span> <span className="font-semibold">{viewRider.deliveries}</span></div>
                {viewRider.current_order && <div><span className="text-text-4">Current:</span> <span className="font-mono text-blue">{viewRider.current_order}</span></div>}
              </div>
              <a href={`tel:${viewRider.phone.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 w-full h-10 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600">
                <Phone size={14} /> Call Rider
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Zone Add/Edit Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => { setShowZoneModal(false); setEditZone(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{editZone ? "Edit Zone" : "Add Zone"}</h2>
              <button onClick={() => { setShowZoneModal(false); setEditZone(null); }} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Zone Name</label>
                <input value={zoneForm.zone} onChange={(e) => setZoneForm({ ...zoneForm, zone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" placeholder="e.g. Lagos Mainland" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Delivery Fee (₦)</label>
                <input type="number" value={zoneForm.fee} onChange={(e) => setZoneForm({ ...zoneForm, fee: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => { setShowZoneModal(false); setEditZone(null); }} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={saveZone} disabled={saving || !zoneForm.zone} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? "Saving..." : editZone ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
