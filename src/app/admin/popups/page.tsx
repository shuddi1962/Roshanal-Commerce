"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, Loader2, X, Eye, ToggleLeft, ToggleRight,
  Megaphone, Clock, Target, MousePointer, ExternalLink, Copy,
} from "lucide-react";

interface Popup {
  id?: string;
  name: string;
  type: "modal" | "banner_top" | "banner_bottom" | "slide_in" | "floating";
  title: string;
  body: string;
  image: string;
  button_text: string;
  button_link: string;
  bg_color: string;
  text_color: string;
  trigger: "immediate" | "delay" | "scroll" | "exit_intent";
  delay_seconds: number;
  scroll_pct: number;
  show_on: "all" | "homepage" | "shop" | "product" | "cart" | "checkout";
  frequency: "every_visit" | "once" | "once_per_day" | "once_per_week";
  start_date: string;
  end_date: string;
  active: boolean;
  impressions: number;
  clicks: number;
  created_at?: string;
}

const defaultPopups: Popup[] = [
  {
    name: "Welcome Discount", type: "modal", title: "Welcome! Get 10% Off", body: "Sign up for our newsletter and receive 10% off your first order.", image: "", button_text: "Claim Discount", button_link: "/shop", bg_color: "#1641C4", text_color: "#FFFFFF",
    trigger: "delay", delay_seconds: 5, scroll_pct: 0, show_on: "homepage", frequency: "once", start_date: "2026-01-01", end_date: "2026-12-31", active: true, impressions: 4520, clicks: 892,
  },
  {
    name: "Easter Sale Banner", type: "banner_top", title: "Easter Sale — Up to 40% Off!", body: "Limited time offer on security & marine equipment", image: "", button_text: "Shop Now", button_link: "/shop?sale=easter", bg_color: "#059669", text_color: "#FFFFFF",
    trigger: "immediate", delay_seconds: 0, scroll_pct: 0, show_on: "all", frequency: "once_per_day", start_date: "2026-04-01", end_date: "2026-04-15", active: true, impressions: 8200, clicks: 1340,
  },
  {
    name: "Exit Intent - Cart Recovery", type: "modal", title: "Wait! Don't Leave Yet", body: "Complete your order now and get free shipping on orders over ₦50,000", image: "", button_text: "Complete Order", button_link: "/cart", bg_color: "#C8191C", text_color: "#FFFFFF",
    trigger: "exit_intent", delay_seconds: 0, scroll_pct: 0, show_on: "cart", frequency: "once_per_day", start_date: "2026-01-01", end_date: "2026-12-31", active: false, impressions: 1200, clicks: 340,
  },
  {
    name: "WhatsApp Float", type: "floating", title: "Chat with us", body: "Need help? Chat with us on WhatsApp", image: "", button_text: "Chat Now", button_link: "https://wa.me/2348031234567", bg_color: "#25D366", text_color: "#FFFFFF",
    trigger: "immediate", delay_seconds: 0, scroll_pct: 0, show_on: "all", frequency: "every_visit", start_date: "2026-01-01", end_date: "2026-12-31", active: true, impressions: 15000, clicks: 2800,
  },
];

const typeLabels: Record<string, string> = { modal: "Modal Popup", banner_top: "Top Banner", banner_bottom: "Bottom Banner", slide_in: "Slide-in", floating: "Floating Button" };
const triggerLabels: Record<string, string> = { immediate: "Immediately", delay: "After Delay", scroll: "On Scroll", exit_intent: "Exit Intent" };

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Popup | null>(null);
  const [preview, setPreview] = useState<Popup | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Popup>>({
    name: "", type: "modal", title: "", body: "", image: "", button_text: "Shop Now", button_link: "/shop",
    bg_color: "#1641C4", text_color: "#FFFFFF", trigger: "immediate", delay_seconds: 0, scroll_pct: 0,
    show_on: "all", frequency: "once", start_date: "", end_date: "", active: true,
  });

  useEffect(() => { loadPopups(); }, []);

  const loadPopups = async () => {
    try {
      const { data } = await insforge.database.from("popups").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) { setPopups(data); } else {
        for (const p of defaultPopups) await insforge.database.from("popups").insert(p);
        const { data: seeded } = await insforge.database.from("popups").select("*").order("created_at", { ascending: false });
        setPopups(seeded || []);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", type: "modal", title: "", body: "", image: "", button_text: "Shop Now", button_link: "/shop", bg_color: "#1641C4", text_color: "#FFFFFF", trigger: "immediate", delay_seconds: 0, scroll_pct: 0, show_on: "all", frequency: "once", start_date: "", end_date: "", active: true });
    setShowModal(true);
  };

  const openEdit = (p: Popup) => {
    setEditing(p);
    setForm({ ...p });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.title?.trim()) return;
    const payload = { ...form, impressions: 0, clicks: 0 };
    try {
      if (editing?.id) {
        await insforge.database.from("popups").update({ ...form }).eq("id", editing.id);
        setPopups(popups.map(p => p.id === editing.id ? { ...p, ...form } as Popup : p));
      } else {
        const { data } = await insforge.database.from("popups").insert(payload).select("*");
        if (data?.[0]) setPopups([data[0], ...popups]);
      }
      setShowModal(false);
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (p: Popup) => {
    setPopups(popups.map(pp => pp.id === p.id ? { ...pp, active: !pp.active } : pp));
    if (p.id) await insforge.database.from("popups").update({ active: !p.active }).eq("id", p.id);
  };

  const handleDelete = async (id: string) => {
    try { await insforge.database.from("popups").delete().eq("id", id); setPopups(popups.filter(p => p.id !== id)); setDeleteConfirm(null); } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <AdminShell title="Popups & Floating Ads" subtitle="Create promotional popups, banners, and floating widgets">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  const totalImpressions = popups.reduce((s, p) => s + (p.impressions || 0), 0);
  const totalClicks = popups.reduce((s, p) => s + (p.clicks || 0), 0);

  return (
    <AdminShell title="Popups & Floating Ads" subtitle="Create promotional popups, banners, and floating widgets">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Popups", value: popups.length },
          { label: "Active", value: popups.filter(p => p.active).length },
          { label: "Impressions", value: totalImpressions.toLocaleString() },
          { label: "CTR", value: totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(1)}%` : "0%" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-text-1">{s.value}</p>
            <p className="text-xs text-text-4">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-3">{popups.length} popups configured</p>
        <button onClick={openCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={14} /> Create Popup</button>
      </div>

      {/* Popup List */}
      <div className="space-y-3">
        {popups.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 group hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: p.bg_color + "20" }}>
                <Megaphone size={20} style={{ color: p.bg_color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-text-1">{p.name}</h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-text-4">{typeLabels[p.type]}</span>
                  {p.active && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">Active</span>}
                </div>
                <p className="text-xs text-text-3 mt-0.5">{p.title}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[10px] text-text-4 flex items-center gap-1"><Clock size={10} /> {triggerLabels[p.trigger]}{p.trigger === "delay" ? ` (${p.delay_seconds}s)` : ""}</span>
                  <span className="text-[10px] text-text-4 flex items-center gap-1"><Target size={10} /> {p.show_on === "all" ? "All pages" : p.show_on}</span>
                  <span className="text-[10px] text-text-4 flex items-center gap-1"><MousePointer size={10} /> {(p.impressions || 0).toLocaleString()} views &middot; {(p.clicks || 0).toLocaleString()} clicks</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPreview(p)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-4"><Eye size={14} /></button>
                <button onClick={() => toggleActive(p)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  {p.active ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} className="text-text-4" />}
                </button>
                <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(p.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto py-10" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[580px] my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editing ? "Edit Popup" : "New Popup"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Campaign Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Popup["type"] })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="modal">Modal Popup</option><option value="banner_top">Top Banner</option><option value="banner_bottom">Bottom Banner</option><option value="slide_in">Slide-in</option><option value="floating">Floating Button</option>
                  </select>
                </div>
              </div>
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              <div><label className="text-sm font-medium text-text-2 block mb-1.5">Body Text</label><textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Button Text</label><input value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Button Link</label><input value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Background Color</label><div className="flex gap-2"><input type="color" value={form.bg_color} onChange={e => setForm({ ...form, bg_color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" /><input value={form.bg_color} onChange={e => setForm({ ...form, bg_color: e.target.value })} className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono" /></div></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Text Color</label><div className="flex gap-2"><input type="color" value={form.text_color} onChange={e => setForm({ ...form, text_color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" /><input value={form.text_color} onChange={e => setForm({ ...form, text_color: e.target.value })} className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono" /></div></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Trigger</label>
                  <select value={form.trigger} onChange={e => setForm({ ...form, trigger: e.target.value as Popup["trigger"] })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="immediate">Immediately</option><option value="delay">After Delay</option><option value="scroll">On Scroll</option><option value="exit_intent">Exit Intent</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Show On</label>
                  <select value={form.show_on} onChange={e => setForm({ ...form, show_on: e.target.value as Popup["show_on"] })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="all">All Pages</option><option value="homepage">Homepage</option><option value="shop">Shop</option><option value="product">Product Pages</option><option value="cart">Cart</option><option value="checkout">Checkout</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value as Popup["frequency"] })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="every_visit">Every Visit</option><option value="once">Once Ever</option><option value="once_per_day">Once/Day</option><option value="once_per_week">Once/Week</option>
                  </select>
                </div>
              </div>
              {form.trigger === "delay" && (
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Delay (seconds)</label><input value={form.delay_seconds} onChange={e => setForm({ ...form, delay_seconds: Number(e.target.value) })} type="number" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" /></div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Start Date</label><input value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} type="date" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">End Date</label><input value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} type="date" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" /></div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editing ? "Update" : "Create"} Popup</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setPreview(null)}>
          {preview.type === "modal" && (
            <div className="rounded-2xl overflow-hidden max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()} style={{ backgroundColor: preview.bg_color }}>
              <div className="p-8 text-center" style={{ color: preview.text_color }}>
                <button onClick={() => setPreview(null)} className="absolute top-4 right-4 opacity-70 hover:opacity-100"><X size={20} /></button>
                <h3 className="text-2xl font-bold mb-2">{preview.title}</h3>
                <p className="opacity-80 mb-6">{preview.body}</p>
                <button className="px-6 py-2.5 bg-white text-text-1 rounded-lg font-semibold text-sm">{preview.button_text}</button>
              </div>
            </div>
          )}
          {(preview.type === "banner_top" || preview.type === "banner_bottom") && (
            <div className="w-full max-w-2xl rounded-xl overflow-hidden" onClick={e => e.stopPropagation()} style={{ backgroundColor: preview.bg_color, color: preview.text_color }}>
              <div className="flex items-center justify-between px-6 py-3">
                <div><p className="font-bold text-sm">{preview.title}</p><p className="text-xs opacity-80">{preview.body}</p></div>
                <button className="px-4 py-1.5 bg-white text-text-1 rounded-lg font-semibold text-xs">{preview.button_text}</button>
              </div>
            </div>
          )}
          {preview.type === "floating" && (
            <div className="rounded-full px-5 py-3 shadow-2xl flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()} style={{ backgroundColor: preview.bg_color, color: preview.text_color }}>
              <Megaphone size={18} /> <span className="font-semibold text-sm">{preview.button_text}</span>
            </div>
          )}
          {preview.type === "slide_in" && (
            <div className="rounded-xl overflow-hidden max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()} style={{ backgroundColor: preview.bg_color, color: preview.text_color }}>
              <div className="p-5">
                <h4 className="font-bold text-sm mb-1">{preview.title}</h4>
                <p className="text-xs opacity-80 mb-3">{preview.body}</p>
                <button className="w-full py-2 bg-white text-text-1 rounded-lg font-semibold text-xs">{preview.button_text}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Popup?</h3>
            <p className="text-sm text-text-3 mb-5">This popup will be permanently removed.</p>
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
