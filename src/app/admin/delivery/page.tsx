"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Truck, MapPin, Star, CheckCircle2,
  Eye, Plus, AlertTriangle, Users,
} from "lucide-react";

const demoRiders = [
  { id: 1, name: "Adamu Suleiman", phone: "+234 801 111 2222", zone: "Port Harcourt", status: "available", deliveries: 342, rating: 4.8, vehicle: "Motorcycle", currentOrder: null },
  { id: 2, name: "Kunle Ajayi", phone: "+234 802 222 3333", zone: "Lagos Mainland", status: "on_delivery", deliveries: 289, rating: 4.6, vehicle: "Van", currentOrder: "ORD-1234" },
  { id: 3, name: "Musa Abdullahi", phone: "+234 803 333 4444", zone: "Lagos Island", status: "available", deliveries: 198, rating: 4.9, vehicle: "Motorcycle", currentOrder: null },
  { id: 4, name: "Chika Obi", phone: "+234 804 444 5555", zone: "Abuja", status: "on_delivery", deliveries: 156, rating: 4.4, vehicle: "Van", currentOrder: "ORD-1235" },
  { id: 5, name: "Yusuf Hassan", phone: "+234 805 555 6666", zone: "Warri", status: "offline", deliveries: 87, rating: 4.2, vehicle: "Motorcycle", currentOrder: null },
  { id: 6, name: "Emeka Igwe", phone: "+234 806 666 7777", zone: "Port Harcourt", status: "available", deliveries: 445, rating: 4.7, vehicle: "Truck", currentOrder: null },
];

const demoDeliveries = [
  { id: "DEL-001", order: "ORD-1234", customer: "Chidi Okafor", address: "12 Aba Rd, Port Harcourt", rider: "Kunle Ajayi", status: "in_transit", eta: "30 mins" },
  { id: "DEL-002", order: "ORD-1235", customer: "Amina Bello", address: "45 Lekki Phase 1, Lagos", rider: "Chika Obi", status: "in_transit", eta: "45 mins" },
  { id: "DEL-003", order: "ORD-1236", customer: "Tunde Ade", address: "Plot 8 Wuse 2, Abuja", rider: null, status: "pending", eta: "-" },
  { id: "DEL-004", order: "ORD-1237", customer: "Grace Eze", address: "7 Stadium Rd, PH", rider: "Adamu Suleiman", status: "delivered", eta: "Delivered" },
];

export default function AdminDeliveryPage() {
  const [tab, setTab] = useState<"riders" | "active" | "zones">("riders");

  return (
    <AdminShell title="Delivery Management" subtitle="Manage delivery riders and track shipments">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Riders", value: demoRiders.length, icon: Users, color: "text-blue" },
            { label: "Available Now", value: demoRiders.filter((r) => r.status === "available").length, icon: CheckCircle2, color: "text-green-600" },
            { label: "Active Deliveries", value: demoDeliveries.filter((d) => d.status === "in_transit").length, icon: Truck, color: "text-yellow-600" },
            { label: "Pending Assignment", value: demoDeliveries.filter((d) => d.status === "pending").length, icon: AlertTriangle, color: "text-red" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["riders", "active", "zones"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t === "active" ? "Active Deliveries" : t === "zones" ? "Delivery Zones" : "Riders"}
            </button>
          ))}
        </div>

        {tab === "riders" && (
          <div className="space-y-3">
            {demoRiders.map((rider) => (
              <div key={rider.id} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    rider.status === "available" ? "bg-green-500" : rider.status === "on_delivery" ? "bg-yellow-500" : "bg-gray-400"
                  }`}>{rider.name.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{rider.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        rider.status === "available" ? "bg-green-100 text-green-700" :
                        rider.status === "on_delivery" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                      }`}>{rider.status.replace("_", " ")}</span>
                    </div>
                    <p className="text-xs text-text-4">{rider.phone} · {rider.zone} · {rider.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center"><p className="text-xs text-text-4">Deliveries</p><p className="font-semibold text-sm">{rider.deliveries}</p></div>
                  <div className="text-center"><p className="text-xs text-text-4">Rating</p><p className="font-semibold text-sm flex items-center gap-1">{rider.rating} <Star size={12} className="text-yellow-400 fill-yellow-400" /></p></div>
                  {rider.currentOrder && <span className="text-xs bg-blue/10 text-blue px-2 py-1 rounded">{rider.currentOrder}</span>}
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-text-4" /></button>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-text-4 hover:border-blue hover:text-blue transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Add New Rider
            </button>
          </div>
        )}

        {tab === "active" && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {["Delivery ID", "Order", "Customer", "Address", "Rider", "Status", "ETA"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {demoDeliveries.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-xs">{d.id}</td>
                    <td className="p-4 text-blue font-medium">{d.order}</td>
                    <td className="p-4">{d.customer}</td>
                    <td className="p-4 text-text-3 text-xs max-w-[200px] truncate">{d.address}</td>
                    <td className="p-4">{d.rider || <button className="text-xs text-blue hover:underline">Assign</button>}</td>
                    <td className="p-4"><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      d.status === "in_transit" ? "bg-yellow-100 text-yellow-700" :
                      d.status === "delivered" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>{d.status.replace("_", " ")}</span></td>
                    <td className="p-4 text-text-3">{d.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "zones" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { zone: "Port Harcourt", riders: 2, fee: 1500, deliveries: 1240, active: true },
              { zone: "Lagos Mainland", riders: 1, fee: 2000, deliveries: 890, active: true },
              { zone: "Lagos Island", riders: 1, fee: 2500, deliveries: 650, active: true },
              { zone: "Abuja", riders: 1, fee: 3000, deliveries: 420, active: true },
              { zone: "Warri", riders: 1, fee: 2000, deliveries: 230, active: true },
              { zone: "Calabar", riders: 0, fee: 3500, deliveries: 0, active: false },
            ].map((z) => (
              <div key={z.zone} className={`bg-white rounded-xl p-4 border ${z.active ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2"><MapPin size={14} className="text-blue" />{z.zone}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${z.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{z.active ? "Active" : "Inactive"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-[10px] text-text-4">Riders</p><p className="font-semibold text-sm">{z.riders}</p></div>
                  <div><p className="text-[10px] text-text-4">Delivery Fee</p><p className="font-semibold text-sm">₦{z.fee.toLocaleString()}</p></div>
                  <div><p className="text-[10px] text-text-4">Total</p><p className="font-semibold text-sm">{z.deliveries}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
