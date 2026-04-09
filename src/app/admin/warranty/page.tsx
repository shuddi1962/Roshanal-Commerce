"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Shield, Search, Plus, Eye, CheckCircle2, Clock, AlertTriangle,
  Mail,
} from "lucide-react";

const demoWarranties = [
  { id: "WR-001", product: "Hikvision 4CH DVR Kit", customer: "Chidi Okafor", email: "chidi@email.com", serial: "HKV-2024-001234", purchaseDate: "2024-01-15", warrantyEnd: "2026-01-15", period: "2 years", status: "active", claims: 0 },
  { id: "WR-002", product: "Yamaha 40HP Outboard", customer: "Emeka Nwosu", email: "emeka@email.com", serial: "YAM-2024-005678", purchaseDate: "2024-02-20", warrantyEnd: "2025-02-20", period: "1 year", status: "active", claims: 1 },
  { id: "WR-003", product: "Access Control System", customer: "Tunde Adebayo", email: "tunde@email.com", serial: "ACS-2023-009876", purchaseDate: "2023-06-10", warrantyEnd: "2025-06-10", period: "2 years", status: "active", claims: 0 },
  { id: "WR-004", product: "Fire Alarm Panel", customer: "Grace Eze", email: "grace@email.com", serial: "FAP-2022-003456", purchaseDate: "2022-08-05", warrantyEnd: "2024-08-05", period: "2 years", status: "expired", claims: 2 },
  { id: "WR-005", product: "Kitchen Hood 90cm", customer: "Amina Bello", email: "amina@email.com", serial: "KTH-2024-007890", purchaseDate: "2024-03-01", warrantyEnd: "2025-03-01", period: "1 year", status: "active", claims: 0 },
];

const demoClaims = [
  { id: "CL-001", warranty: "WR-002", product: "Yamaha 40HP Outboard", customer: "Emeka Nwosu", issue: "Engine overheating after 30 minutes of use", date: "2024-06-15", status: "resolved", resolution: "Replaced water pump impeller under warranty" },
  { id: "CL-002", warranty: "WR-004", product: "Fire Alarm Panel", customer: "Grace Eze", issue: "False alarms triggering randomly", date: "2023-11-20", status: "resolved", resolution: "Firmware update applied, sensor recalibrated" },
  { id: "CL-003", warranty: "WR-004", product: "Fire Alarm Panel", customer: "Grace Eze", issue: "Zone 3 not detecting smoke", date: "2024-05-10", status: "pending", resolution: null },
];

export default function AdminWarrantyPage() {
  const [tab, setTab] = useState<"registrations" | "claims" | "policies">("registrations");
  const [search, setSearch] = useState("");

  return (
    <AdminShell title="Warranty Management" subtitle="Track product warranties and process claims">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Warranties", value: demoWarranties.filter((w) => w.status === "active").length, icon: Shield, color: "text-green-600" },
            { label: "Expired", value: demoWarranties.filter((w) => w.status === "expired").length, icon: Clock, color: "text-gray-500" },
            { label: "Open Claims", value: demoClaims.filter((c) => c.status === "pending").length, icon: AlertTriangle, color: "text-yellow-600" },
            { label: "Resolved Claims", value: demoClaims.filter((c) => c.status === "resolved").length, icon: CheckCircle2, color: "text-green-600" },
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

        {tab === "registrations" && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input type="text" placeholder="Search by serial, product, or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600"><Plus size={16} /> Register Warranty</button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">
                  {["ID", "Product", "Customer", "Serial Number", "Purchase", "Expires", "Status", "Claims", "Actions"].map((h) => (
                    <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {demoWarranties.map((w) => (
                    <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4 font-mono text-xs">{w.id}</td>
                      <td className="p-4 font-medium">{w.product}</td>
                      <td className="p-4"><p>{w.customer}</p><p className="text-xs text-text-4">{w.email}</p></td>
                      <td className="p-4 font-mono text-xs">{w.serial}</td>
                      <td className="p-4 text-xs text-text-3">{w.purchaseDate}</td>
                      <td className="p-4 text-xs text-text-3">{w.warrantyEnd}</td>
                      <td className="p-4"><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${w.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{w.status}</span></td>
                      <td className="p-4 text-center">{w.claims}</td>
                      <td className="p-4"><div className="flex gap-1"><button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button><button className="p-1.5 hover:bg-gray-100 rounded-lg"><Mail size={14} className="text-text-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "claims" && (
          <div className="space-y-3">
            {demoClaims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-text-4">{claim.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${claim.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{claim.status}</span>
                    </div>
                    <h4 className="font-semibold text-sm">{claim.product}</h4>
                    <p className="text-xs text-text-4">{claim.customer} · Warranty: {claim.warranty} · Filed: {claim.date}</p>
                  </div>
                </div>
                <p className="text-sm text-text-3 mb-2"><strong>Issue:</strong> {claim.issue}</p>
                {claim.resolution && <p className="text-sm text-green-700 bg-green-50 p-2 rounded"><strong>Resolution:</strong> {claim.resolution}</p>}
                {!claim.resolution && (
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">Approve Claim</button>
                    <button className="px-3 py-1.5 text-xs bg-red text-white rounded-lg hover:bg-red-600">Reject Claim</button>
                    <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Request More Info</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "policies" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-2xl space-y-4">
            <h3 className="font-semibold text-base">Warranty Policies</h3>
            {[
              { category: "Security Systems (CCTV, DVR, NVR)", period: "2 years", coverage: "Manufacturing defects, hardware failure" },
              { category: "Marine Engines (Yamaha, Outboard)", period: "1 year", coverage: "Engine defects, electrical issues" },
              { category: "Safety Equipment (Fire, Life Jackets)", period: "1 year", coverage: "Material defects, functional failure" },
              { category: "Access Control & Alarms", period: "2 years", coverage: "Hardware and software defects" },
              { category: "Kitchen Equipment", period: "1 year", coverage: "Motor and electrical defects" },
              { category: "Boat Building", period: "5 years", coverage: "Structural integrity, hull defects" },
            ].map((p, i) => (
              <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-text-1">{p.category}</h4>
                  <p className="text-xs text-text-4 mt-1">{p.coverage}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-blue">{p.period}</span>
                  <button className="block text-[10px] text-text-4 hover:text-blue mt-1">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
