"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  FileText, Search, Plus, Eye, Edit, Trash2, Send, CheckCircle2,
  Clock, XCircle, DollarSign, TrendingUp, Users, Download,
} from "lucide-react";

const demoQuotes = [
  { id: "QT-001", customer: "Lagos State Government", contact: "Mr. Adeyemi", email: "procurement@lasg.gov.ng", items: "50x Hikvision 8CH DVR Kit, 200x Outdoor Cameras", total: 15000000, status: "sent", date: "2024-03-10", validUntil: "2024-04-10", notes: "Bulk security installation for government offices" },
  { id: "QT-002", customer: "Shell Nigeria", contact: "Engr. Nwosu", email: "procurement@shell.ng", items: "Marine GPS Systems, 10x Life Rafts, Safety Equipment", total: 8500000, status: "accepted", date: "2024-03-08", validUntil: "2024-04-08", notes: "Marine safety compliance upgrade" },
  { id: "QT-003", customer: "Transcorp Hotels", contact: "Mrs. Okafor", email: "facilities@transcorp.com", items: "Kitchen Hood Systems, Fire Suppression, Alarm Systems", total: 6200000, status: "draft", date: "2024-03-12", validUntil: "2024-04-12", notes: "Hotel kitchen renovation project" },
  { id: "QT-004", customer: "Port Harcourt Boat Club", contact: "Chief Amadi", email: "admin@phboatclub.com", items: "2x Yamaha 200HP, Boat Building Consultation", total: 25000000, status: "negotiating", date: "2024-03-05", validUntil: "2024-04-05", notes: "New patrol boat construction" },
  { id: "QT-005", customer: "Dangote Group", contact: "Alhaji Ibrahim", email: "security@dangote.com", items: "Access Control 500-door, CCTV 200-camera system", total: 45000000, status: "sent", date: "2024-03-11", validUntil: "2024-04-11", notes: "Factory security overhaul" },
  { id: "QT-006", customer: "MTN Nigeria", contact: "Mr. Eze", email: "infra@mtn.ng", items: "Fire Alarm Systems x 20 locations", total: 12000000, status: "expired", date: "2024-01-15", validUntil: "2024-02-15", notes: "Multi-site fire safety" },
];

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue/10 text-blue",
  negotiating: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-400",
};

export default function AdminQuotesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = demoQuotes.filter((q) => {
    if (filter !== "all" && q.status !== filter) return false;
    if (search && !q.customer.toLowerCase().includes(search.toLowerCase()) && !q.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPipeline = demoQuotes.filter((q) => ["sent", "negotiating"].includes(q.status)).reduce((a, q) => a + q.total, 0);
  const totalWon = demoQuotes.filter((q) => q.status === "accepted").reduce((a, q) => a + q.total, 0);

  return (
    <AdminShell title="Quotes & Proposals" subtitle="Manage B2B quotes and proposals">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Quotes", value: demoQuotes.length, icon: FileText, color: "text-blue" },
            { label: "Pipeline Value", value: `₦${(totalPipeline / 1e6).toFixed(0)}M`, icon: TrendingUp, color: "text-yellow-600" },
            { label: "Won Value", value: `₦${(totalWon / 1e6).toFixed(0)}M`, icon: DollarSign, color: "text-green-600" },
            { label: "Win Rate", value: `${Math.round((demoQuotes.filter((q) => q.status === "accepted").length / demoQuotes.length) * 100)}%`, icon: CheckCircle2, color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input type="text" placeholder="Search quotes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          </div>
          {["all", "draft", "sent", "negotiating", "accepted", "expired"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs rounded-lg border capitalize ${filter === f ? "bg-blue text-white border-blue" : "bg-white border-gray-200 text-text-3"}`}>{f}</button>
          ))}
          <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600">
            <Plus size={16} /> New Quote
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-4">{quote.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[quote.status]}`}>{quote.status}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-text-1">{quote.customer}</h4>
                  <p className="text-xs text-text-4">{quote.contact} · {quote.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-text-1">₦{quote.total.toLocaleString()}</p>
                  <p className="text-[10px] text-text-4">Valid until {quote.validUntil}</p>
                </div>
              </div>
              <p className="text-sm text-text-3 mb-2">{quote.items}</p>
              <p className="text-xs text-text-4 italic mb-3">{quote.notes}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-4">Created {quote.date}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="View"><Eye size={14} className="text-text-4" /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit"><Edit size={14} className="text-text-4" /></button>
                  <button className="p-1.5 hover:bg-blue-50 rounded-lg" title="Send"><Send size={14} className="text-blue" /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Download PDF"><Download size={14} className="text-text-4" /></button>
                  <button className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
