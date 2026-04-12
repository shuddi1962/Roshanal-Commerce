"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import { Plus, Edit2, Trash2, Loader2, Search, Tag, X } from "lucide-react";

interface ProductTag {
  id?: string;
  name: string;
  slug: string;
  color: string;
  product_count: number;
  created_at?: string;
}

const tagColors = ["#1641C4", "#C8191C", "#059669", "#D97706", "#7C3AED", "#0891B2", "#DB2777", "#4F46E5", "#EA580C", "#16A34A"];

const defaultTags: ProductTag[] = [
  { name: "Best Seller", slug: "best-seller", color: "#C8191C", product_count: 12 },
  { name: "New Arrival", slug: "new-arrival", color: "#1641C4", product_count: 18 },
  { name: "On Sale", slug: "on-sale", color: "#059669", product_count: 24 },
  { name: "Featured", slug: "featured", color: "#7C3AED", product_count: 8 },
  { name: "Limited Stock", slug: "limited-stock", color: "#D97706", product_count: 5 },
  { name: "Free Shipping", slug: "free-shipping", color: "#0891B2", product_count: 15 },
  { name: "Clearance", slug: "clearance", color: "#DB2777", product_count: 9 },
  { name: "Industrial", slug: "industrial", color: "#4F46E5", product_count: 22 },
  { name: "Marine Grade", slug: "marine-grade", color: "#EA580C", product_count: 14 },
  { name: "Eco Friendly", slug: "eco-friendly", color: "#16A34A", product_count: 6 },
];

export default function TagsPage() {
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", color: "#1641C4" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { loadTags(); }, []);

  const loadTags = async () => {
    try {
      const { data } = await insforge.database.from("tags").select("*").order("name", { ascending: true });
      if (data && data.length > 0) {
        setTags(data);
      } else {
        for (const tag of defaultTags) {
          await insforge.database.from("tags").insert(tag);
        }
        const { data: seeded } = await insforge.database.from("tags").select("*").order("name", { ascending: true });
        setTags(seeded || []);
      }
    } catch (e) {
      console.error("Failed to load tags:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreate = () => {
    setEditingTag(null);
    setForm({ name: "", slug: "", color: tagColors[Math.floor(Math.random() * tagColors.length)] });
    setShowModal(true);
  };

  const openEdit = (tag: ProductTag) => {
    setEditingTag(tag);
    setForm({ name: tag.name, slug: tag.slug, color: tag.color });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const slug = form.slug || generateSlug(form.name);
    const payload = { name: form.name, slug, color: form.color, product_count: 0 };

    try {
      if (editingTag?.id) {
        await insforge.database.from("tags").update({ ...payload, product_count: editingTag.product_count }).eq("id", editingTag.id);
        setTags(tags.map(t => t.id === editingTag.id ? { ...t, ...payload, product_count: editingTag.product_count } : t));
      } else {
        const { data } = await insforge.database.from("tags").insert(payload).select("*");
        if (data?.[0]) setTags([...tags, data[0]]);
      }
      setShowModal(false);
    } catch (e) {
      console.error("Failed to save tag:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await insforge.database.from("tags").delete().eq("id", id);
      setTags(tags.filter(t => t.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete tag:", e);
    }
  };

  const filtered = search ? tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase())) : tags;

  if (loading) {
    return (
      <AdminShell title="Tags" subtitle="Manage product tags and labels">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Tags" subtitle="Manage product tags and labels">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-text-1">{tags.length}</p>
          <p className="text-xs text-text-4">Total Tags</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-text-1">{tags.reduce((s, t) => s + (t.product_count || 0), 0)}</p>
          <p className="text-xs text-text-4">Tagged Products</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-text-1">{tags.filter(t => (t.product_count || 0) === 0).length}</p>
          <p className="text-xs text-text-4">Unused Tags</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tags..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
        </div>
        <button onClick={openCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus size={14} /> Add Tag
        </button>
      </div>

      {/* Tag Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(tag => (
          <div key={tag.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tag.color + "15" }}>
                  <Tag size={18} style={{ color: tag.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text-1">{tag.name}</p>
                  <p className="text-[10px] text-text-4 font-mono">/{tag.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(tag)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                <button onClick={() => setDeleteConfirm(tag.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: tag.color + "15", color: tag.color }}>
                {tag.product_count || 0} products
              </span>
              <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: tag.color }} />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-text-4">No tags found.</div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[450px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingTag ? "Edit Tag" : "New Tag"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Tag Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} placeholder="e.g. Best Seller" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2">
                  {tagColors.map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-lg border-2 transition-colors ${form.color === c ? "border-text-1 ring-2 ring-blue/30" : "border-transparent hover:border-gray-300"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editingTag ? "Update" : "Create"} Tag</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Tag?</h3>
            <p className="text-sm text-text-3 mb-5">This tag will be removed from all associated products.</p>
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
