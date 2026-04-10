"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Plus, Edit, Trash2, Save, MapPin } from "lucide-react";

const defaultZones = [
  { id: 1, name: "Lagos", regions: ["Lagos Island", "Lagos Mainland", "Ikeja", "Lekki"], flatRate: 2000, freeAbove: 50000, enabled: true },
  { id: 2, name: "South-West", regions: ["Ogun", "Oyo", "Osun", "Ondo", "Ekiti"], flatRate: 3500, freeAbove: 100000, enabled: true },
  { id: 3, name: "South-East", regions: ["Anambra", "Enugu", "Imo", "Abia", "Ebonyi"], flatRate: 4500, freeAbove: 100000, enabled: true },
  { id: 4, name: "South-South", regions: ["Rivers", "Delta", "Bayelsa", "Edo", "Cross River", "Akwa Ibom"], flatRate: 4000, freeAbove: 80000, enabled: true },
  { id: 5, name: "North", regions: ["FCT", "Kaduna", "Kano", "Plateau"], flatRate: 5500, freeAbove: 150000, enabled: false },
];

export default function VendorShippingPage() {
  const [zones, setZones] = useState(defaultZones);
  const [showAdd, setShowAdd] = useState(false);
  const [newZone, setNewZone] = useState({ name: "", regions: "", flatRate: "", freeAbove: "" });

  const toggleZone = (id: number) => setZones((prev) => prev.map((z) => z.id === id ? { ...z, enabled: !z.enabled } : z));
  const deleteZone = (id: number) => { if (confirm("Delete this zone?")) setZones((prev) => prev.filter((z) => z.id !== id)); };
  const addZone = () => {
    if (!newZone.name) { alert("Zone name required."); return; }
    setZones((prev) => [...prev, { id: Date.now(), name: newZone.name, regions: newZone.regions.split(",").map((r) => r.trim()), flatRate: Number(newZone.flatRate) || 0, freeAbove: Number(newZone.freeAbove) || 0, enabled: true }]);
    setNewZone({ name: "", regions: "", flatRate: "", freeAbove: "" }); setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Shipping Zones</h1><p className="text-sm text-gray-500">Configure delivery areas and rates</p></div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><Plus size={16} /> Add Zone</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {showAdd && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3">
            <h3 className="font-semibold text-sm">New Shipping Zone</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input placeholder="Zone Name" value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input placeholder="Regions (comma separated)" value={newZone.regions} onChange={(e) => setNewZone({ ...newZone, regions: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input placeholder="Flat Rate (₦)" type="number" value={newZone.flatRate} onChange={(e) => setNewZone({ ...newZone, flatRate: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input placeholder="Free Above (₦)" type="number" value={newZone.freeAbove} onChange={(e) => setNewZone({ ...newZone, freeAbove: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <button onClick={addZone} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg">Add Zone</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 text-sm rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        {zones.map((zone) => (
          <div key={zone.id} className={`bg-white rounded-xl p-5 border ${zone.enabled ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><MapPin size={18} className="text-purple-600" /></div>
                <div>
                  <h4 className="font-semibold text-sm">{zone.name}</h4>
                  <p className="text-xs text-gray-400">{zone.regions.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleZone(zone.id)} className={`px-3 py-1 text-xs rounded-full ${zone.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{zone.enabled ? "Active" : "Disabled"}</button>
                <button onClick={() => alert(`Edit zone: ${zone.name}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                <button onClick={() => deleteZone(zone.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-600" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-400">Flat Rate:</span> <span className="font-semibold">₦{zone.flatRate.toLocaleString()}</span></div>
              <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-400">Free above:</span> <span className="font-semibold">₦{zone.freeAbove.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
