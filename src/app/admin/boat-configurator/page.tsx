"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Anchor, Eye, Edit, Trash2, Sparkles, Save, Download,
  Settings, Gauge, DollarSign, Image,
} from "lucide-react";

const vesselTypes = [
  "Patrol Boat", "Fishing Trawler", "Speed Boat", "Ferry", "Tugboat",
  "House Boat", "Catamaran", "Pontoon", "Work Boat", "Yacht",
  "Landing Craft", "Supply Vessel", "Crew Boat", "Barge", "Dredger", "Custom",
];

const hullMaterials = ["Fiberglass", "Aluminum", "Steel", "Wood", "Composite"];
const engineOptions = [
  { name: "Yamaha 40HP", price: 2200000 },
  { name: "Yamaha 85HP", price: 3800000 },
  { name: "Yamaha 115HP", price: 5200000 },
  { name: "Yamaha 200HP", price: 8500000 },
  { name: "Yamaha 300HP", price: 12000000 },
  { name: "Mercury 150HP", price: 6800000 },
  { name: "Mercury 250HP", price: 10500000 },
];

const demoConfigs = [
  { id: 1, name: "PHC Patrol Boat 28ft", type: "Patrol Boat", length: "28ft", hull: "Fiberglass", engine: "Yamaha 200HP", price: 25000000, status: "active", orders: 3 },
  { id: 2, name: "Lagos Ferry 45ft", type: "Ferry", length: "45ft", hull: "Steel", engine: "Yamaha 300HP x2", price: 85000000, status: "active", orders: 1 },
  { id: 3, name: "Delta Fishing Trawler 32ft", type: "Fishing Trawler", length: "32ft", hull: "Fiberglass", engine: "Yamaha 115HP", price: 18000000, status: "draft", orders: 0 },
  { id: 4, name: "Speed Boat 22ft", type: "Speed Boat", length: "22ft", hull: "Fiberglass", engine: "Yamaha 85HP", price: 12000000, status: "active", orders: 5 },
];

export default function AdminBoatConfiguratorPage() {
  const [tab, setTab] = useState<"configs" | "builder" | "ai">("configs");
  const [config, setConfig] = useState({
    name: "", type: "Patrol Boat", length: "", beam: "", draft: "",
    hull: "Fiberglass", engine: "Yamaha 200HP", seats: 8, fuel: 200,
    features: [] as string[],
  });

  const availableFeatures = [
    "Navigation Lights", "GPS System", "Radar", "Fish Finder", "VHF Radio",
    "Compass", "Anchor Windlass", "Bilge Pump", "Fire Extinguisher", "Life Jackets",
    "Canopy/T-Top", "Swim Platform", "Rod Holders", "Live Well", "Cooler Box",
    "Sound System", "LED Underwater Lights", "Trim Tabs", "Hydraulic Steering",
  ];

  return (
    <AdminShell title="Boat Building Configurator" subtitle="Configure custom boats and generate AI visualizations">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Configs", value: demoConfigs.filter((c) => c.status === "active").length, icon: Anchor, color: "text-blue" },
            { label: "Total Orders", value: demoConfigs.reduce((a, c) => a + c.orders, 0), icon: DollarSign, color: "text-green-600" },
            { label: "Vessel Types", value: vesselTypes.length, icon: Settings, color: "text-purple-600" },
            { label: "Engine Options", value: engineOptions.length, icon: Gauge, color: "text-yellow-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["configs", "builder", "ai"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t === "configs" ? "Saved Configs" : t === "builder" ? "Build New" : "AI Visualizer"}
            </button>
          ))}
        </div>

        {tab === "configs" && (
          <div className="space-y-3">
            {demoConfigs.map((cfg) => (
              <div key={cfg.id} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/20 to-blue/5 flex items-center justify-center">
                      <Anchor size={20} className="text-blue" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{cfg.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{cfg.status}</span>
                      </div>
                      <p className="text-xs text-text-4">{cfg.type} · {cfg.length} · {cfg.hull} · {cfg.engine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-sm">₦{(cfg.price / 1e6).toFixed(0)}M</p>
                      <p className="text-[10px] text-text-4">{cfg.orders} orders</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
                <h3 className="font-semibold text-sm">Vessel Specifications</h3>
                <div>
                  <label className="text-xs text-text-4 mb-1 block">Configuration Name</label>
                  <input type="text" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" placeholder="e.g. PHC Patrol Boat 28ft" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-4 mb-1 block">Vessel Type</label>
                    <select value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg">
                      {vesselTypes.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-4 mb-1 block">Hull Material</label>
                    <select value={config.hull} onChange={(e) => setConfig({ ...config, hull: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg">
                      {hullMaterials.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs text-text-4 mb-1 block">Length (ft)</label><input type="text" value={config.length} onChange={(e) => setConfig({ ...config, length: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" /></div>
                  <div><label className="text-xs text-text-4 mb-1 block">Beam (ft)</label><input type="text" value={config.beam} onChange={(e) => setConfig({ ...config, beam: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" /></div>
                  <div><label className="text-xs text-text-4 mb-1 block">Draft (ft)</label><input type="text" value={config.draft} onChange={(e) => setConfig({ ...config, draft: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" /></div>
                </div>
                <div>
                  <label className="text-xs text-text-4 mb-1 block">Engine</label>
                  <select value={config.engine} onChange={(e) => setConfig({ ...config, engine: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg">
                    {engineOptions.map((e) => <option key={e.name} value={e.name}>{e.name} — ₦{(e.price / 1e6).toFixed(1)}M</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-text-4 mb-1 block">Seating Capacity</label><input type="number" value={config.seats} onChange={(e) => setConfig({ ...config, seats: +e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" /></div>
                  <div><label className="text-xs text-text-4 mb-1 block">Fuel Tank (L)</label><input type="number" value={config.fuel} onChange={(e) => setConfig({ ...config, fuel: +e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" /></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-sm mb-3">Features & Equipment</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableFeatures.map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.features.includes(f)}
                        onChange={(e) => {
                          if (e.target.checked) setConfig({ ...config, features: [...config.features, f] });
                          else setConfig({ ...config, features: config.features.filter((x) => x !== f) });
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-text-3">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue/20 to-blue/5 flex items-center justify-center">
                  <div className="text-center">
                    <Anchor size={48} className="text-blue/30 mx-auto mb-2" />
                    <p className="text-sm text-text-4">Boat visualization preview</p>
                    <button className="mt-2 px-4 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 flex items-center gap-1 mx-auto">
                      <Sparkles size={12} /> Generate AI Image
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base mb-3">{config.name || "Untitled Configuration"}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-text-4">Type</span><span className="font-medium">{config.type}</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-text-4">Hull</span><span className="font-medium">{config.hull}</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-text-4">Length</span><span className="font-medium">{config.length || "—"}ft</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-text-4">Engine</span><span className="font-medium">{config.engine}</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-text-4">Seats</span><span className="font-medium">{config.seats}</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-text-4">Fuel</span><span className="font-medium">{config.fuel}L</span></div>
                  </div>
                  {config.features.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-text-4 mb-1.5">Selected Features ({config.features.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {config.features.map((f) => (
                          <span key={f} className="text-[10px] px-2 py-1 bg-blue/10 text-blue rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 h-10 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center justify-center gap-2"><Save size={14} /> Save Config</button>
                    <button className="h-10 px-4 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"><Download size={14} /> PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-lg">AI Boat Visualizer</h3>
              <p className="text-sm text-text-4 mt-1">Describe your dream vessel and our AI will generate a realistic visualization</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-3 mb-1 block">Describe Your Boat</label>
                <textarea className="w-full h-28 p-3 text-sm border border-gray-200 rounded-lg resize-none" placeholder="e.g. A 28-foot fiberglass patrol boat with twin Yamaha 200HP outboard engines, white hull with blue stripe, T-top canopy, radar arch, and seating for 8..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-4 mb-1 block">Style</label>
                  <select className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg">
                    <option>Photorealistic</option>
                    <option>3D Render</option>
                    <option>Blueprint</option>
                    <option>Watercolor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-4 mb-1 block">Angle</label>
                  <select className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg">
                    <option>Side Profile</option>
                    <option>3/4 View</option>
                    <option>Aerial</option>
                    <option>Front</option>
                  </select>
                </div>
              </div>
              <button className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 flex items-center justify-center gap-2">
                <Sparkles size={16} /> Generate Visualization
              </button>
              <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center text-text-4">
                  <Image size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">AI-generated image will appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
