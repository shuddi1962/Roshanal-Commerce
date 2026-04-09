"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Gift, Plus, Search, Eye, Edit, Trash2, Copy, CheckCircle2,
  DollarSign, TrendingUp,
} from "lucide-react";

const demoCards = [
  { id: "GC-001", code: "ROSH-GIFT-5K", value: 5000, balance: 5000, buyer: "Chidi Okafor", recipient: "Amina Bello", recipientEmail: "amina@email.com", status: "active", createdAt: "2024-03-01", expiresAt: "2025-03-01", used: 0 },
  { id: "GC-002", code: "ROSH-GIFT-10K", value: 10000, balance: 7500, buyer: "Emeka Nwosu", recipient: "Tunde Adebayo", recipientEmail: "tunde@email.com", status: "active", createdAt: "2024-02-15", expiresAt: "2025-02-15", used: 2500 },
  { id: "GC-003", code: "ROSH-GIFT-25K", value: 25000, balance: 0, buyer: "Grace Eze", recipient: "Ibrahim Musa", recipientEmail: "ibrahim@email.com", status: "redeemed", createdAt: "2024-01-20", expiresAt: "2025-01-20", used: 25000 },
  { id: "GC-004", code: "ROSH-GIFT-50K", value: 50000, balance: 50000, buyer: "System", recipient: "Promo Winner", recipientEmail: "winner@email.com", status: "active", createdAt: "2024-03-10", expiresAt: "2025-03-10", used: 0 },
  { id: "GC-005", code: "ROSH-GIFT-2K", value: 2000, balance: 2000, buyer: "Fatima Ali", recipient: "Self", recipientEmail: "fatima@email.com", status: "expired", createdAt: "2023-03-01", expiresAt: "2024-03-01", used: 0 },
];

const templates = [
  { name: "Birthday", color: "from-pink-500 to-purple-600", emoji: "🎂" },
  { name: "Thank You", color: "from-green-500 to-teal-600", emoji: "🙏" },
  { name: "Holiday", color: "from-red-500 to-red-700", emoji: "🎄" },
  { name: "Congratulations", color: "from-yellow-500 to-orange-600", emoji: "🎉" },
];

const presetAmounts = [2000, 5000, 10000, 25000, 50000, 100000];

export default function AdminGiftCardsPage() {
  const [tab, setTab] = useState<"cards" | "create" | "templates">("cards");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newCard, setNewCard] = useState({ value: 5000, recipientEmail: "", recipientName: "", message: "", template: "Birthday" });

  const totalValue = demoCards.reduce((a, b) => a + b.value, 0);
  const totalRedeemed = demoCards.reduce((a, b) => a + b.used, 0);
  const activeCount = demoCards.filter((c) => c.status === "active").length;

  const filtered = demoCards.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.code.toLowerCase().includes(search.toLowerCase()) && !c.recipient.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell title="Gift Cards" subtitle="Create and manage digital gift cards">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Issued", value: `₦${(totalValue / 1000).toFixed(0)}K`, icon: Gift, color: "text-blue" },
            { label: "Total Redeemed", value: `₦${(totalRedeemed / 1000).toFixed(0)}K`, icon: TrendingUp, color: "text-green-600" },
            { label: "Active Cards", value: activeCount, icon: CheckCircle2, color: "text-blue" },
            { label: "Total Cards", value: demoCards.length, icon: DollarSign, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={16} className={s.color} />
                <span className="text-xs text-text-4">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["cards", "create", "templates"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${
                tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"
              }`}
            >
              {t === "cards" ? "All Cards" : t === "create" ? "Create New" : "Templates"}
            </button>
          ))}
        </div>

        {tab === "cards" && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input type="text" placeholder="Search by code or recipient..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
              </div>
              {["all", "active", "redeemed", "expired"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs rounded-lg border capitalize ${filter === f ? "bg-blue text-white border-blue" : "bg-white border-gray-200 text-text-3"}`}>{f}</button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-xs text-text-4 font-medium">Code</th>
                    <th className="text-left p-4 text-xs text-text-4 font-medium">Recipient</th>
                    <th className="text-left p-4 text-xs text-text-4 font-medium">Value</th>
                    <th className="text-left p-4 text-xs text-text-4 font-medium">Balance</th>
                    <th className="text-left p-4 text-xs text-text-4 font-medium">Status</th>
                    <th className="text-left p-4 text-xs text-text-4 font-medium">Expires</th>
                    <th className="text-right p-4 text-xs text-text-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((card) => (
                    <tr key={card.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{card.code}</code>
                          <button className="text-text-4 hover:text-blue"><Copy size={12} /></button>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-text-1">{card.recipient}</p>
                        <p className="text-xs text-text-4">{card.recipientEmail}</p>
                      </td>
                      <td className="p-4 font-medium">₦{card.value.toLocaleString()}</td>
                      <td className="p-4 font-medium text-green-600">₦{card.balance.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          card.status === "active" ? "bg-green-100 text-green-700" :
                          card.status === "redeemed" ? "bg-blue/10 text-blue" : "bg-gray-100 text-gray-500"
                        }`}>{card.status}</span>
                      </td>
                      <td className="p-4 text-text-4 text-xs">{card.expiresAt}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "create" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-xl">
            <h3 className="font-semibold text-base mb-4">Create Gift Card</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-3 mb-2 block">Amount (₦)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {presetAmounts.map((a) => (
                    <button key={a} onClick={() => setNewCard({ ...newCard, value: a })} className={`py-2 text-sm rounded-lg border ${newCard.value === a ? "bg-blue text-white border-blue" : "border-gray-200 hover:border-blue"}`}>
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input type="number" value={newCard.value} onChange={(e) => setNewCard({ ...newCard, value: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" placeholder="Custom amount" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Recipient Name</label>
                <input type="text" value={newCard.recipientName} onChange={(e) => setNewCard({ ...newCard, recipientName: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" placeholder="Enter name" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Recipient Email</label>
                <input type="email" value={newCard.recipientEmail} onChange={(e) => setNewCard({ ...newCard, recipientEmail: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" placeholder="Enter email" />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-1 block">Personal Message</label>
                <textarea value={newCard.message} onChange={(e) => setNewCard({ ...newCard, message: e.target.value })} className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg resize-none" placeholder="Add a message..." />
              </div>
              <div>
                <label className="text-sm text-text-3 mb-2 block">Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((t) => (
                    <button key={t.name} onClick={() => setNewCard({ ...newCard, template: t.name })} className={`p-3 rounded-lg border text-left ${newCard.template === t.name ? "border-blue ring-1 ring-blue/20" : "border-gray-200"}`}>
                      <span className="text-lg mr-2">{t.emoji}</span>
                      <span className="text-sm font-medium">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full h-11 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Gift size={16} /> Create & Send Gift Card
              </button>
            </div>
          </div>
        )}

        {tab === "templates" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <span className="text-4xl block mb-1">{t.emoji}</span>
                    <span className="text-sm font-medium">Roshanal Gift Card</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-1">{t.name}</h4>
                  <p className="text-xs text-text-4 mb-3">Perfect for {t.name.toLowerCase()} occasions</p>
                  <button className="w-full py-2 text-xs text-blue border border-blue/20 rounded-lg hover:bg-blue/5 transition-colors">
                    Edit Template
                  </button>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[200px] hover:border-blue/40 cursor-pointer transition-colors">
              <div className="text-center">
                <Plus size={24} className="text-text-4 mx-auto mb-2" />
                <p className="text-sm text-text-4">Create Template</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
