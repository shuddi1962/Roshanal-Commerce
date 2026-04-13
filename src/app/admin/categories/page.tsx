"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, ChevronRight, ChevronDown, Loader2, Search,
  FolderTree, GripVertical, ToggleLeft, ToggleRight, X,
} from "lucide-react";

interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string | null;
  position: number;
  active: boolean;
  product_count: number;
  created_at?: string;
}

const defaultCategories: Category[] = [
  { name: "CCTV & Surveillance", slug: "cctv-surveillance", description: "Security cameras, DVRs, NVRs, and accessories", image: "", parent_id: null, position: 1, active: true, product_count: 45 },
  { name: "IP Cameras", slug: "ip-cameras", description: "Network IP cameras", image: "", parent_id: null, position: 1, active: true, product_count: 18 },
  { name: "DVR/NVR Systems", slug: "dvr-nvr-systems", description: "Digital and network video recorders", image: "", parent_id: null, position: 2, active: true, product_count: 12 },
  { name: "Fire Safety", slug: "fire-safety", description: "Fire alarms, extinguishers, and detection systems", image: "", parent_id: null, position: 2, active: true, product_count: 32 },
  { name: "Marine Equipment", slug: "marine-equipment", description: "Outboard engines, life jackets, and boat accessories", image: "", parent_id: null, position: 3, active: true, product_count: 28 },
  { name: "Access Control", slug: "access-control", description: "Door locks, biometric readers, and turnstiles", image: "", parent_id: null, position: 4, active: true, product_count: 19 },
  { name: "Kitchen Equipment", slug: "kitchen-equipment", description: "Commercial and industrial kitchen appliances", image: "", parent_id: null, position: 5, active: true, product_count: 24 },
  { name: "Safety Equipment", slug: "safety-equipment", description: "PPE, safety boots, helmets, and protective gear", image: "", parent_id: null, position: 6, active: true, product_count: 37 },
  { name: "Networking", slug: "networking", description: "Switches, routers, cables, and networking accessories", image: "", parent_id: null, position: 7, active: true, product_count: 15 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "", parent_id: "" as string, active: true });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const { data } = await insforge.database.from("categories").select("*").order("position", { ascending: true });
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Seed defaults
        const seeded: Category[] = [];
        for (const cat of defaultCategories) {
          const { data: inserted } = await insforge.database.from("categories").insert(cat).select("*");
          if (inserted?.[0]) seeded.push(inserted[0]);
        }
        if (seeded.length > 0) {
          // Set parent_id for subcategories (IP Cameras & DVR/NVR under CCTV)
          const cctvId = seeded.find(c => c.slug === "cctv-surveillance")?.id;
          if (cctvId) {
            const ipCam = seeded.find(c => c.slug === "ip-cameras");
            const dvr = seeded.find(c => c.slug === "dvr-nvr-systems");
            if (ipCam?.id) await insforge.database.from("categories").update({ parent_id: cctvId }).eq("id", ipCam.id);
            if (dvr?.id) await insforge.database.from("categories").update({ parent_id: cctvId }).eq("id", dvr.id);
          }
          const { data: final } = await insforge.database.from("categories").select("*").order("position", { ascending: true });
          setCategories(final || seeded);
        }
      }
    } catch (e) {
      console.error("Failed to load categories:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreateModal = (parentId?: string) => {
    setEditingCat(null);
    setForm({ name: "", slug: "", description: "", image: "", parent_id: parentId || "", active: true });
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      parent_id: cat.parent_id || "",
      active: cat.active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const slug = form.slug || generateSlug(form.name);
    const payload = {
      name: form.name,
      slug,
      description: form.description,
      image: form.image,
      parent_id: form.parent_id || null,
      active: form.active,
      position: categories.length + 1,
      product_count: 0,
    };

    try {
      if (editingCat?.id) {
        await insforge.database.from("categories").update({ ...payload, position: editingCat.position, product_count: editingCat.product_count }).eq("id", editingCat.id);
        setCategories(categories.map(c => c.id === editingCat.id ? { ...c, ...payload, position: editingCat.position, product_count: editingCat.product_count } : c));
      } else {
        const { data } = await insforge.database.from("categories").insert(payload).select("*");
        if (data?.[0]) setCategories([...categories, data[0]]);
      }
      setShowModal(false);
    } catch (e) {
      console.error("Failed to save category:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Also delete subcategories
      await insforge.database.from("categories").delete().eq("parent_id", id);
      await insforge.database.from("categories").delete().eq("id", id);
      setCategories(categories.filter(c => c.id !== id && c.parent_id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete category:", e);
    }
  };

  const toggleActive = async (cat: Category) => {
    const updated = { ...cat, active: !cat.active };
    setCategories(categories.map(c => c.id === cat.id ? updated : c));
    if (cat.id) await insforge.database.from("categories").update({ active: !cat.active }).eq("id", cat.id);
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const parentCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);
  const filtered = search
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase()))
    : parentCategories;

  if (loading) {
    return (
      <AdminShell title="Categories" subtitle="Manage product categories and subcategories">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Categories" subtitle="Manage product categories and subcategories">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Categories", value: parentCategories.length },
          { label: "Subcategories", value: categories.length - parentCategories.length },
          { label: "Active", value: categories.filter(c => c.active).length },
          { label: "Total Products", value: categories.reduce((s, c) => s + (c.product_count || 0), 0) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-text-1">{s.value}</p>
            <p className="text-xs text-text-4">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue"
          />
        </div>
        <button onClick={() => openCreateModal()} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <FolderTree size={16} className="text-blue" />
          <h3 className="font-semibold text-sm text-text-1">Category Tree</h3>
          <span className="text-xs text-text-4 ml-auto">{categories.length} total</span>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(cat => {
            const children = search ? [] : getChildren(cat.id || "");
            const hasChildren = children.length > 0;
            const isExpanded = expanded.has(cat.id || "");

            return (
              <div key={cat.id}>
                {/* Parent Row */}
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                  <GripVertical size={14} className="text-text-4/40 cursor-grab" />
                  {hasChildren ? (
                    <button onClick={() => toggleExpand(cat.id!)} className="text-text-4 hover:text-text-2">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <span className="w-4" />
                  )}
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center">
                      <FolderTree size={16} className="text-blue" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-1">{cat.name}</p>
                    <p className="text-[10px] text-text-4">/{cat.slug} &middot; {cat.product_count || 0} products{hasChildren ? ` &middot; ${children.length} subcategories` : ""}</p>
                  </div>
                  <button onClick={() => toggleActive(cat)} className="shrink-0">
                    {cat.active ? <ToggleRight size={22} className="text-blue" /> : <ToggleLeft size={22} className="text-text-4" />}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openCreateModal(cat.id)} className="p-1.5 hover:bg-blue/10 rounded-lg text-blue" title="Add subcategory">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => openEditModal(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteConfirm(cat.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                {isExpanded && children.map(child => (
                  <div key={child.id} className="flex items-center gap-3 px-4 py-3 pl-16 hover:bg-gray-50 transition-colors group bg-gray-50/50">
                    <span className="w-4 border-l-2 border-b-2 border-gray-200 h-4 -mt-3 rounded-bl" />
                    {child.image ? (
                      <img src={child.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue/5 flex items-center justify-center">
                        <FolderTree size={14} className="text-blue/60" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-1">{child.name}</p>
                      <p className="text-[10px] text-text-4">/{child.slug} &middot; {child.product_count || 0} products</p>
                    </div>
                    <button onClick={() => toggleActive(child)} className="shrink-0">
                      {child.active ? <ToggleRight size={20} className="text-blue" /> : <ToggleLeft size={20} className="text-text-4" />}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(child)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteConfirm(child.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-text-4">No categories found.</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[520px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingCat ? "Edit Category" : "New Category"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Category Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value, slug: form.slug || generateSlug(e.target.value) })}
                  placeholder="e.g. CCTV Cameras"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Short description for SEO..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Parent Category</label>
                <select
                  value={form.parent_id}
                  onChange={e => setForm({ ...form, parent_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.filter(c => c.id !== editingCat?.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Image URL</label>
                <input
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-text-1">Active</span>
                <button onClick={() => setForm({ ...form, active: !form.active })}>
                  {form.active ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">
                {editingCat ? "Update" : "Create"} Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Category?</h3>
            <p className="text-sm text-text-3 mb-5">This will also delete all subcategories. Products will be unassigned.</p>
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
