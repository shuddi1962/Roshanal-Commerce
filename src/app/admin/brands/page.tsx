"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, Loader2, Search, Award, X,
  ToggleLeft, ToggleRight, Globe, ExternalLink, Star,
} from "lucide-react";

interface Brand {
  id?: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  description: string;
  country: string;
  active: boolean;
  featured: boolean;
  product_count: number;
  brand_color: string;
  created_at?: string;
}

// Brand colors matching their actual brand identities
const defaultBrands: Brand[] = [
  { name: "Hikvision", slug: "hikvision", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Hikvision_logo.svg/200px-Hikvision_logo.svg.png", website: "https://www.hikvision.com", description: "World leader in CCTV and surveillance solutions", country: "China", active: true, featured: true, product_count: 35, brand_color: "#E30613" },
  { name: "Yamaha", slug: "yamaha", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Yamaha_Motor_logo.svg/200px-Yamaha_Motor_logo.svg.png", website: "https://www.yamaha-motor.com", description: "Outboard motors and marine equipment", country: "Japan", active: true, featured: true, product_count: 18, brand_color: "#2C1FCC" },
  { name: "Dahua", slug: "dahua", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Dahua_Technology_logo.svg/200px-Dahua_Technology_logo.svg.png", website: "https://www.dahuasecurity.com", description: "Video surveillance and AI solutions", country: "China", active: true, featured: false, product_count: 22, brand_color: "#00529B" },
  { name: "Honeywell", slug: "honeywell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Honeywell_logo.svg/200px-Honeywell_logo.svg.png", website: "https://www.honeywell.com", description: "Fire safety and building automation", country: "USA", active: true, featured: true, product_count: 15, brand_color: "#E10600" },
  { name: "ZKTeco", slug: "zkteco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/ZKTeco_logo.svg/200px-ZKTeco_logo.svg.png", website: "https://www.zkteco.com", description: "Biometric and access control systems", country: "China", active: true, featured: false, product_count: 12, brand_color: "#0077B5" },
  { name: "Tohatsu", slug: "tohatsu", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Tohatsu_logo.svg/200px-Tohatsu_logo.svg.png", website: "https://www.tohatsu.com", description: "Outboard engines and marine products", country: "Japan", active: true, featured: false, product_count: 8, brand_color: "#D71920" },
  { name: "Mercury", slug: "mercury", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Mercury_Marine_logo.svg/200px-Mercury_Marine_logo.svg.png", website: "https://www.mercurymarine.com", description: "Marine engines and propulsion", country: "USA", active: true, featured: true, product_count: 10, brand_color: "#000000" },
  { name: "Bosch", slug: "bosch", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Bosch-logo.svg/200px-Bosch-logo.svg.png", website: "https://www.bosch.com", description: "Security, fire detection, and electronics", country: "Germany", active: true, featured: false, product_count: 9, brand_color: "#E20015" },
  { name: "Samsung", slug: "samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png", website: "https://www.samsung.com", description: "Electronics, displays, and smart home devices", country: "South Korea", active: true, featured: true, product_count: 14, brand_color: "#1428A0" },
  { name: "Suzuki", slug: "suzuki", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/200px-Suzuki_logo_2.svg.png", website: "https://www.suzuki.com", description: "Outboard motors and marine engines", country: "Japan", active: true, featured: false, product_count: 7, brand_color: "#E30613" },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", logo: "", website: "", description: "", country: "", active: true, featured: false, brand_color: "#1641C4" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => { loadBrands(); }, []);

  const loadBrands = async () => {
    try {
      const { data } = await insforge.database.from("brands").select("*").order("name", { ascending: true });
      if (data && data.length > 0) {
        setBrands(data);
      } else {
        for (const brand of defaultBrands) {
          await insforge.database.from("brands").insert(brand);
        }
        const { data: seeded } = await insforge.database.from("brands").select("*").order("name", { ascending: true });
        setBrands(seeded || []);
      }
    } catch (e) {
      console.error("Failed to load brands:", e);
      setBrands(defaultBrands.map((b, i) => ({ ...b, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreate = () => {
    setEditingBrand(null);
    setForm({ name: "", slug: "", logo: "", website: "", description: "", country: "", active: true, featured: false, brand_color: "#1641C4" });
    setShowModal(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setForm({ name: brand.name, slug: brand.slug, logo: brand.logo, website: brand.website, description: brand.description, country: brand.country, active: brand.active, featured: brand.featured, brand_color: brand.brand_color || "#1641C4" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const slug = form.slug || generateSlug(form.name);
    const payload = { ...form, slug, product_count: 0 };

    try {
      if (editingBrand?.id) {
        await insforge.database.from("brands").update({ ...payload, product_count: editingBrand.product_count }).eq("id", editingBrand.id);
        setBrands(brands.map(b => b.id === editingBrand.id ? { ...b, ...payload, product_count: editingBrand.product_count } : b));
      } else {
        const { data } = await insforge.database.from("brands").insert(payload).select("*");
        if (data?.[0]) setBrands([...brands, data[0]]);
      }
      setShowModal(false);
    } catch (e) {
      console.error("Failed to save brand:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await insforge.database.from("brands").delete().eq("id", id);
      setBrands(brands.filter(b => b.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete brand:", e);
    }
  };

  const toggleFeatured = async (brand: Brand) => {
    const updated = { ...brand, featured: !brand.featured };
    setBrands(brands.map(b => b.id === brand.id ? updated : b));
    if (brand.id) await insforge.database.from("brands").update({ featured: !brand.featured }).eq("id", brand.id);
  };

  const filtered = search ? brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.country.toLowerCase().includes(search.toLowerCase())) : brands;

  // Helper to lighten a hex color
  const lightenColor = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  if (loading) {
    return (
      <AdminShell title="Brands" subtitle="Manage product brands and manufacturers">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Brands" subtitle="Manage product brands and manufacturers">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Brands", value: brands.length, color: "#1641C4" },
          { label: "Featured", value: brands.filter(b => b.featured).length, color: "#F59E0B" },
          { label: "Active", value: brands.filter(b => b.active).length, color: "#10B981" },
          { label: "Countries", value: Array.from(new Set(brands.map(b => b.country).filter(Boolean))).length, color: "#8B5CF6" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10" style={{ backgroundColor: s.color }} />
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-text-4">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brands..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setView("grid")} className={`px-3 py-1 text-xs rounded-md ${view === "grid" ? "bg-white shadow-sm font-medium" : "text-text-4"}`}>Grid</button>
            <button onClick={() => setView("list")} className={`px-3 py-1 text-xs rounded-md ${view === "list" ? "bg-white shadow-sm font-medium" : "text-text-4"}`}>List</button>
          </div>
          <button onClick={openCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus size={14} /> Add Brand
          </button>
        </div>
      </div>

      {/* Brand Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(brand => {
            const color = brand.brand_color || "#1641C4";
            return (
              <div key={brand.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group relative">
                {/* Colored top strip */}
                <div className="h-2" style={{ backgroundColor: color }} />

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    {brand.logo ? (
                      <div className="w-14 h-14 rounded-xl border border-gray-100 p-1.5 flex items-center justify-center bg-white shadow-sm">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: lightenColor(color, 200) }}>
                        <span className="font-bold text-lg" style={{ color }}>{brand.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleFeatured(brand)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Star size={13} className={brand.featured ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                      </button>
                      <button onClick={() => openEdit(brand)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteConfirm(brand.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-text-1">{brand.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: lightenColor(color, 220), color }}>{brand.country || "Global"}</span>
                    {brand.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">Featured</span>}
                  </div>
                  <p className="text-xs text-text-3 mt-2 line-clamp-2">{brand.description || "No description"}</p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {brand.website && (
                        <button onClick={() => window.open(brand.website, "_blank")} className="p-1 hover:bg-gray-100 rounded text-text-4 hover:text-blue transition-colors">
                          <ExternalLink size={12} />
                        </button>
                      )}
                      <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} title={`Brand color: ${color}`} />
                    </div>
                    <span className={`w-2 h-2 rounded-full ${brand.active ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-3 text-text-4 font-medium">Brand</th>
                <th className="text-left p-3 text-text-4 font-medium">Country</th>
                <th className="text-center p-3 text-text-4 font-medium">Featured</th>
                <th className="text-center p-3 text-text-4 font-medium">Status</th>
                <th className="text-right p-3 text-text-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(brand => {
                const color = brand.brand_color || "#1641C4";
                return (
                  <tr key={brand.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-8 rounded-full" style={{ backgroundColor: color }} />
                        {brand.logo ? (
                          <div className="w-8 h-8 rounded-lg border border-gray-100 p-1 flex items-center justify-center bg-white">
                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: lightenColor(color, 200) }}>
                            <span className="font-bold text-[10px]" style={{ color }}>{brand.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-text-1">{brand.name}</p>
                          <p className="text-[10px] text-text-4">{brand.description?.slice(0, 50)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: lightenColor(color, 220), color }}>{brand.country || "—"}</span>
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => toggleFeatured(brand)}>
                        <Star size={16} className={brand.featured ? "text-yellow-500 fill-yellow-500 mx-auto" : "text-gray-300 mx-auto"} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`w-2 h-2 rounded-full inline-block ${brand.active ? "bg-green-500" : "bg-gray-300"}`} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {brand.website && (
                          <button onClick={() => window.open(brand.website, "_blank")} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-4"><ExternalLink size={13} /></button>
                        )}
                        <button onClick={() => openEdit(brand)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteConfirm(brand.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-text-4 mt-3">No brands found.</div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[520px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingBrand ? "Edit Brand" : "New Brand"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Color Preview Banner */}
              <div className="h-16 rounded-xl flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: form.brand_color }}>
                <span className="text-white font-bold text-lg drop-shadow-sm">{form.name || "Brand Name"}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Brand Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} placeholder="e.g. Hikvision" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Country</label>
                  <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="e.g. Japan" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Website</label>
                  <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brand description..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Logo URL</label>
                <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="https://upload.wikimedia.org/..." className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                {form.logo && (
                  <div className="mt-2 w-16 h-16 rounded-lg border border-gray-200 p-2 flex items-center justify-center bg-white">
                    <img src={form.logo} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.brand_color} onChange={e => setForm({ ...form, brand_color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <input value={form.brand_color} onChange={e => setForm({ ...form, brand_color: e.target.value })} className="w-28 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue" />
                  <div className="flex gap-1">
                    {["#E30613", "#1428A0", "#00529B", "#10B981", "#F59E0B", "#8B5CF6", "#000000"].map(c => (
                      <button key={c} onClick={() => setForm({ ...form, brand_color: c })} className="w-6 h-6 rounded-full border-2 transition-all" style={{ backgroundColor: c, borderColor: form.brand_color === c ? "#333" : "transparent" }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-text-1">Active</span>
                  <button onClick={() => setForm({ ...form, active: !form.active })}>
                    {form.active ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-text-1">Featured</span>
                  <button onClick={() => setForm({ ...form, featured: !form.featured })}>
                    {form.featured ? <ToggleRight size={24} className="text-yellow-500" /> : <ToggleLeft size={24} className="text-text-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg text-white text-sm font-semibold hover:opacity-90" style={{ backgroundColor: form.brand_color }}>{editingBrand ? "Update" : "Create"} Brand</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Brand?</h3>
            <p className="text-sm text-text-3 mb-5">Products linked to this brand will become unbranded.</p>
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
