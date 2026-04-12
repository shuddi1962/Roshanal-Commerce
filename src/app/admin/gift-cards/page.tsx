"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Gift, Plus, Search, Eye, Edit, Trash2, Copy, CheckCircle2,
  DollarSign, TrendingUp, X, Save,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  buyer: string;
  recipient: string;
  recipient_email: string;
  status: string;
  created_at: string;
  expires_at: string;
  used: number;
  message?: string;
  template?: string;
}

const seedCards: Omit<GiftCard, "id">[] = [
  { code: "ROSH-GIFT-5K", value: 5000, balance: 5000, buyer: "Chidi Okafor", recipient: "Amina Bello", recipient_email: "amina@email.com", status: "active", created_at: "2024-03-01", expires_at: "2025-03-01", used: 0 },
  { code: "ROSH-GIFT-10K", value: 10000, balance: 7500, buyer: "Emeka Nwosu", recipient: "Tunde Adebayo", recipient_email: "tunde@email.com", status: "active", created_at: "2024-02-15", expires_at: "2025-02-15", used: 2500 },
  { code: "ROSH-GIFT-25K", value: 25000, balance: 0, buyer: "Grace Eze", recipient: "Ibrahim Musa", recipient_email: "ibrahim@email.com", status: "redeemed", created_at: "2024-01-20", expires_at: "2025-01-20", used: 25000 },
  { code: "ROSH-GIFT-50K", value: 50000, balance: 50000, buyer: "System", recipient: "Promo Winner", recipient_email: "winner@email.com", status: "active", created_at: "2024-03-10", expires_at: "2025-03-10", used: 0 },
  { code: "ROSH-GIFT-2K", value: 2000, balance: 2000, buyer: "Fatima Ali", recipient: "Self", recipient_email: "fatima@email.com", status: "expired", created_at: "2023-03-01", expires_at: "2024-03-01", used: 0 },
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
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ value: 5000, recipient_email: "", recipient: "", message: "", template: "Birthday" });
  const [saving, setSaving] = useState(false);
  const [viewCard, setViewCard] = useState<GiftCard | null>(null);
  const [editCard, setEditCard] = useState<GiftCard | null>(null);
  const [editForm, setEditForm] = useState({ recipient: "", recipient_email: "", status: "active" });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { loadCards(); }, []);

  const loadCards = async () => {
    try {
      const { data, error } = await insforge.database.from("gift_cards").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setCards(data);
      else {
        for (const c of seedCards) await insforge.database.from("gift_cards").insert(c);
        const { data: seeded } = await insforge.database.from("gift_cards").select("*");
        if (seeded) setCards(seeded);
      }
    } catch {
      setCards(seedCards.map((c, i) => ({ ...c, id: String(i + 1) })));
    } finally { setLoading(false); }
  };

  const createCard = async () => {
    if (!newCard.recipient || !newCard.recipient_email) return;
    setSaving(true);
    try {
      const code = `ROSH-${newCard.template.toUpperCase().slice(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const now = new Date().toISOString().split("T")[0];
      const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const payload = { code, value: newCard.value, balance: newCard.value, buyer: "Admin", recipient: newCard.recipient, recipient_email: newCard.recipient_email, status: "active", created_at: now, expires_at: expiry, used: 0, message: newCard.message, template: newCard.template };
      const { data } = await insforge.database.from("gift_cards").insert(payload).select();
      if (data) setCards((prev) => [data[0], ...prev]);
      setNewCard({ value: 5000, recipient_email: "", recipient: "", message: "", template: "Birthday" });
      setTab("cards");
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const deleteCard = async (id: string) => {
    if (!confirm("Delete this gift card?")) return;
    try {
      await insforge.database.from("gift_cards").delete().eq("id", id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const updateCard = async () => {
    if (!editCard) return;
    setSaving(true);
    try {
      await insforge.database.from("gift_cards").update(editForm).eq("id", editCard.id);
      setCards((prev) => prev.map((c) => c.id === editCard.id ? { ...c, ...editForm } : c));
      setEditCard(null);
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalValue = cards.reduce((a, b) => a + b.value, 0);
  const totalRedeemed = cards.reduce((a, b) => a + b.used, 0);
  const activeCount = cards.filter((c) => c.status === "active").length;

  const filtered = cards.filter((c) => {
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
            { label: "Total Cards", value: cards.length, icon: DollarSign, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["cards", "create", "templates"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t === "cards" ? "All Cards" : t === "create" ? "Create New" : "Templates"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 text-text-4 text-sm">Loading gift cards...</div>
        ) : (
          <>
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
                        {["Code", "Recipient", "Value", "Balance", "Status", "Expires", "Actions"].map((h) => (
                          <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((card) => (
                        <tr key={card.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{card.code}</code>
                              <button onClick={() => copyCode(card.code)} className="text-text-4 hover:text-blue">
                                {copied === card.code ? <CheckCircle2 size={12} className="text-green-600" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-text-1">{card.recipient}</p>
                            <p className="text-xs text-text-4">{card.recipient_email}</p>
                          </td>
                          <td className="p-4 font-medium">₦{card.value.toLocaleString()}</td>
                          <td className="p-4 font-medium text-green-600">₦{card.balance.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${card.status === "active" ? "bg-green-100 text-green-700" : card.status === "redeemed" ? "bg-blue/10 text-blue" : "bg-gray-100 text-gray-500"}`}>{card.status}</span>
                          </td>
                          <td className="p-4 text-text-4 text-xs">{card.expires_at}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setViewCard(card)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                              <button onClick={() => { setEditCard(card); setEditForm({ recipient: card.recipient, recipient_email: card.recipient_email, status: card.status }); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                              <button onClick={() => deleteCard(card.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
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
                    <input type="number" value={newCard.value} onChange={(e) => setNewCard({ ...newCard, value: +e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="Custom amount" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Recipient Name</label>
                    <input type="text" value={newCard.recipient} onChange={(e) => setNewCard({ ...newCard, recipient: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="Enter name" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Recipient Email</label>
                    <input type="email" value={newCard.recipient_email} onChange={(e) => setNewCard({ ...newCard, recipient_email: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="Enter email" />
                  </div>
                  <div>
                    <label className="text-sm text-text-3 mb-1 block">Personal Message</label>
                    <textarea value={newCard.message} onChange={(e) => setNewCard({ ...newCard, message: e.target.value })} className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue" placeholder="Add a message..." />
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
                  <button onClick={createCard} disabled={saving || !newCard.recipient || !newCard.recipient_email} className="w-full h-11 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-40">
                    <Gift size={16} /> {saving ? "Creating..." : "Create & Send Gift Card"}
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
                      <button className="w-full py-2 text-xs text-blue border border-blue/20 rounded-lg hover:bg-blue/5 transition-colors">Edit Template</button>
                    </div>
                  </div>
                ))}
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[200px] hover:border-blue/40 cursor-pointer transition-colors">
                  <div className="text-center"><Plus size={24} className="text-text-4 mx-auto mb-2" /><p className="text-sm text-text-4">Create Template</p></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Card Modal */}
      {viewCard && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewCard(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">Gift Card Details</h2>
              <button onClick={() => setViewCard(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5">
              <div className={`h-28 bg-gradient-to-br ${templates.find((t) => t.name === viewCard.template)?.color || "from-blue to-purple-600"} rounded-xl flex items-center justify-center mb-4`}>
                <div className="text-center text-white">
                  <span className="text-3xl block">{templates.find((t) => t.name === viewCard.template)?.emoji || "🎁"}</span>
                  <span className="text-sm font-medium">₦{viewCard.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-4">Code:</span><code className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{viewCard.code}</code></div>
                <div className="flex justify-between"><span className="text-text-4">Recipient:</span><span className="font-medium">{viewCard.recipient}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Email:</span><span>{viewCard.recipient_email}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Buyer:</span><span>{viewCard.buyer}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Balance:</span><span className="font-semibold text-green-600">₦{viewCard.balance.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Used:</span><span>₦{viewCard.used.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Status:</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${viewCard.status === "active" ? "bg-green-100 text-green-700" : viewCard.status === "redeemed" ? "bg-blue/10 text-blue" : "bg-gray-100 text-gray-500"}`}>{viewCard.status}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Created:</span><span>{viewCard.created_at}</span></div>
                <div className="flex justify-between"><span className="text-text-4">Expires:</span><span>{viewCard.expires_at}</span></div>
                {viewCard.message && <div className="pt-2 border-t border-gray-100"><p className="text-text-4 text-xs mb-1">Message:</p><p className="text-text-2 text-xs italic">{viewCard.message}</p></div>}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div className="bg-blue h-2 rounded-full" style={{ width: `${viewCard.value ? (viewCard.used / viewCard.value) * 100 : 0}%` }} />
                </div>
                <p className="text-[10px] text-text-4 text-center">{viewCard.value ? Math.round((viewCard.used / viewCard.value) * 100) : 0}% redeemed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {editCard && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditCard(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">Edit Gift Card</h2>
              <button onClick={() => setEditCard(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Recipient</label>
                <input value={editForm.recipient} onChange={(e) => setEditForm({ ...editForm, recipient: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Email</label>
                <input value={editForm.recipient_email} onChange={(e) => setEditForm({ ...editForm, recipient_email: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="active">Active</option><option value="redeemed">Redeemed</option><option value="expired">Expired</option><option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setEditCard(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={updateCard} disabled={saving} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
