"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Download,
  Package, CheckCircle2, XCircle, X, Save,
  ToggleLeft, ToggleRight, Copy, Loader2,
  Upload, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

interface DBProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  regular_price: number;
  sale_price: number | null;
  cost_price: number | null;
  status: string;
  product_type: string;
  category_id: string | null;
  brand_id: string | null;
  tags: string | null;
  short_description: string | null;
  long_description: string | null;
  featured: boolean;
  rating: number;
  review_count: number;
  stock_quantity: number;
  low_stock_threshold: number;
  manage_stock: boolean;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  images: string | null;
  variations: string | null;
  shipping_class: string;
  tax_class: string;
  created_at: string;
}

interface Category { id: string; name: string; slug: string; }
interface Brand { id: string; name: string; slug: string; brand_color?: string; }

const productTypes = [
  { value: "simple", label: "Simple Product", desc: "A single standalone product", icon: "📦" },
  { value: "variable", label: "Variable Product", desc: "Product with variations (size, color)", icon: "🎨" },
  { value: "grouped", label: "Grouped Product", desc: "Bundle of related products", icon: "📦📦" },
  { value: "service", label: "Service", desc: "Installation, maintenance, consulting", icon: "🔧" },
  { value: "digital", label: "Digital Product", desc: "Downloadable file or license", icon: "💾" },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "", sku: "", product_type: "simple", status: "draft",
    regular_price: "", sale_price: "", cost_price: "",
    short_description: "", long_description: "",
    category_id: "", brand_id: "", tags: "",
    featured: false, manage_stock: true,
    stock_quantity: "0", low_stock_threshold: "5",
    weight: "", length: "", width: "", height: "",
    images: [] as string[],
    shipping_class: "standard", tax_class: "standard",
    variations: [] as { name: string; options: string; prices?: string }[],
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        insforge.database.from("products").select("*").order("created_at", { ascending: false }),
        insforge.database.from("categories").select("id,name,slug").order("name", { ascending: true }),
        insforge.database.from("brands").select("id,name,slug,brand_color").order("name", { ascending: true }),
      ]);
      if (prodRes.data) setDbProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (brandRes.data) setBrands(brandRes.data);
    } catch { /* fallback silently */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = dbProducts.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (typeFilter !== "all" && p.product_type !== typeFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => setSelectedProducts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAll = () => setSelectedProducts(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));

  const resetForm = () => {
    setForm({
      name: "", sku: "", product_type: "simple", status: "draft",
      regular_price: "", sale_price: "", cost_price: "",
      short_description: "", long_description: "",
      category_id: "", brand_id: "", tags: "",
      featured: false, manage_stock: true,
      stock_quantity: "0", low_stock_threshold: "5",
      weight: "", length: "", width: "", height: "",
      images: [],
      shipping_class: "standard", tax_class: "standard",
      variations: [],
    });
    setEditingId(null);
    setSaveSuccess(false);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const startEdit = (p: DBProduct) => {
    let imgs: string[] = [];
    try { if (p.images) imgs = JSON.parse(p.images); } catch { /* ignore */ }
    let vars: { name: string; options: string; prices?: string }[] = [];
    try { if (p.variations) vars = JSON.parse(p.variations); } catch { /* ignore */ }

    setForm({
      name: p.name, sku: p.sku, product_type: p.product_type || "simple", status: p.status,
      regular_price: String(p.regular_price || ""), sale_price: p.sale_price ? String(p.sale_price) : "", cost_price: p.cost_price ? String(p.cost_price) : "",
      short_description: p.short_description || "", long_description: p.long_description || "",
      category_id: p.category_id || "", brand_id: p.brand_id || "", tags: p.tags || "",
      featured: p.featured, manage_stock: p.manage_stock ?? true,
      stock_quantity: String(p.stock_quantity || 0), low_stock_threshold: String(p.low_stock_threshold || 5),
      weight: p.weight ? String(p.weight) : "", length: p.length ? String(p.length) : "", width: p.width ? String(p.width) : "", height: p.height ? String(p.height) : "",
      images: imgs,
      shipping_class: p.shipping_class || "standard", tax_class: p.tax_class || "standard",
      variations: vars,
    });
    setEditingId(p.id);
    setSaveSuccess(false);
    setShowForm(true);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (files: FileList) => {
    setUploadingImage(true);
    const newImages = [...form.images];
    for (let i = 0; i < files.length; i++) {
      const base64 = await fileToBase64(files[i]);
      newImages.push(base64);
    }
    setForm({ ...form, images: newImages });
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSave = async (publishStatus?: string) => {
    if (!form.name.trim()) { alert("Product name is required."); return; }
    if (!form.sku.trim()) { alert("SKU is required."); return; }
    if (!form.regular_price) { alert("Regular price is required."); return; }
    setSaving(true);
    const status = publishStatus || form.status;
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const productData: Record<string, unknown> = {
        name: form.name, sku: form.sku, slug, product_type: form.product_type, status,
        regular_price: Number(form.regular_price) || 0,
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        cost_price: form.cost_price ? Number(form.cost_price) : null,
        short_description: form.short_description || null, long_description: form.long_description || null,
        category_id: form.category_id || null, brand_id: form.brand_id || null,
        tags: form.tags || null, featured: form.featured, manage_stock: form.manage_stock,
        stock_quantity: Number(form.stock_quantity) || 0, low_stock_threshold: Number(form.low_stock_threshold) || 5,
        weight: form.weight ? Number(form.weight) : null,
        length: form.length ? Number(form.length) : null,
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        images: JSON.stringify(form.images),
        variations: JSON.stringify(form.variations),
        shipping_class: form.shipping_class, tax_class: form.tax_class,
      };

      if (editingId) {
        await insforge.database.from("products").update(productData).eq("id", editingId);
      } else {
        await insforge.database.from("products").insert([productData]);
      }

      // Auto-sync inventory
      if (form.manage_stock) {
        const invPayload = {
          product_name: form.name, sku: form.sku,
          stock: Number(form.stock_quantity),
          low_stock: Number(form.low_stock_threshold),
          status: Number(form.stock_quantity) > 0 ? "in_stock" : "out_of_stock",
        };
        const { data: existing } = await insforge.database.from("inventory").select("id").eq("sku", form.sku).limit(1);
        if (existing && existing.length > 0) {
          await insforge.database.from("inventory").update(invPayload).eq("id", existing[0].id);
        } else {
          await insforge.database.from("inventory").insert({ ...invPayload, location: "Main Warehouse" });
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await fetchData(); // Re-fetch to sync UI with DB
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert("Error saving product: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await insforge.database.from("products").delete().eq("id", id);
      await fetchData();
    } catch (err) { alert("Error: " + (err instanceof Error ? err.message : "Unknown")); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return;
    for (const id of selectedProducts) await insforge.database.from("products").delete().eq("id", id);
    setSelectedProducts([]);
    await fetchData();
  };

  const duplicateProduct = (p: DBProduct) => {
    startEdit(p);
    setEditingId(null);
    setForm(prev => ({ ...prev, name: prev.name + " (Copy)", sku: prev.sku + "-COPY" }));
  };

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "—";
  const getBrandName = (id: string | null) => brands.find(b => b.id === id)?.name || "—";

  const margin = form.regular_price && form.cost_price ? Math.round(((Number(form.regular_price) - Number(form.cost_price)) / Number(form.regular_price)) * 100) : 0;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 pb-2 mb-4 border-b border-gray-200">
      <h3 className="font-bold text-sm text-text-1">{children}</h3>
    </div>
  );

  return (
    <AdminShell title="Products" subtitle="Manage your product catalog">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-3">{dbProducts.length} total products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              const csv = "Name,SKU,Type,Price,Stock,Status\n" + dbProducts.map(p => `"${p.name}",${p.sku},${p.product_type || "simple"},${p.regular_price},${p.stock_quantity || 0},${p.status}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "products.csv"; a.click();
            }}>
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
            <Button variant="default" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Total", value: dbProducts.length, color: "text-blue" },
            { label: "Published", value: dbProducts.filter(p => p.status === "published").length, color: "text-green-600" },
            { label: "Draft", value: dbProducts.filter(p => p.status === "draft").length, color: "text-yellow-600" },
            { label: "Out of Stock", value: dbProducts.filter(p => (p.stock_quantity || 0) <= 0).length, color: "text-red" },
            { label: "Featured", value: dbProducts.filter(p => p.featured).length, color: "text-purple-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className={`font-bold text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-4 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or SKU..." className="w-full pl-10 pr-4 h-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="all">All Types</option>
            <option value="simple">Simple</option>
            <option value="variable">Variable</option>
            <option value="grouped">Grouped</option>
            <option value="service">Service</option>
            <option value="digital">Digital</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue/20 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-blue font-medium">{selectedProducts.length} selected</span>
            <Button variant="outline" size="sm" className="text-red border-red/20 hover:bg-red-50" onClick={handleBulkDelete}>
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 text-blue animate-spin mx-auto mb-2" /><p className="text-sm text-text-3">Loading products...</p></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left w-8"><input type="checkbox" checked={selectedProducts.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" /></th>
                  <th className="p-3 text-left text-xs font-medium text-text-4 uppercase">Product</th>
                  <th className="p-3 text-left text-xs font-medium text-text-4 uppercase">SKU</th>
                  <th className="p-3 text-left text-xs font-medium text-text-4 uppercase">Type</th>
                  <th className="p-3 text-right text-xs font-medium text-text-4 uppercase">Price</th>
                  <th className="p-3 text-center text-xs font-medium text-text-4 uppercase">Stock</th>
                  <th className="p-3 text-center text-xs font-medium text-text-4 uppercase">Status</th>
                  <th className="p-3 text-right text-xs font-medium text-text-4 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  let thumb = "";
                  try { if (product.images) { const imgs = JSON.parse(product.images); if (imgs[0]) thumb = imgs[0]; } } catch { /* ignore */ }
                  return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleSelect(product.id)} className="rounded" /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {thumb ? <img src={thumb} alt={product.name} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-text-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-1 truncate max-w-[220px]">{product.name}</p>
                          <p className="text-[10px] text-text-4">{getCategoryName(product.category_id)} · {getBrandName(product.brand_id)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-text-3">{product.sku}</td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-text-3 capitalize">{product.product_type || "simple"}</span></td>
                    <td className="p-3 text-right">
                      <p className="font-semibold text-sm">₦{Number(product.sale_price || product.regular_price).toLocaleString()}</p>
                      {product.sale_price ? <p className="text-[10px] text-text-4 line-through">₦{Number(product.regular_price).toLocaleString()}</p> : null}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-medium ${(product.stock_quantity || 0) <= 0 ? "text-red" : (product.stock_quantity || 0) <= (product.low_stock_threshold || 5) ? "text-yellow-600" : "text-green-600"}`}>
                        {product.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${product.status === "published" ? "bg-green-50 text-green-600" : product.status === "draft" ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-text-4"}`}>
                        {product.status === "published" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <button onClick={() => startEdit(product)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-4 hover:text-blue" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => duplicateProduct(product)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-4 hover:text-blue" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-text-4/30 mx-auto mb-2" />
              <p className="text-sm text-text-3">No products found</p>
              <Button size="sm" className="mt-3" onClick={openCreate}><Plus className="w-3 h-3 mr-1" /> Add Your First Product</Button>
            </div>
          )}
        </div>
      </div>

      {/* ─── FULL PRODUCT FORM ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-gray-50 rounded-2xl w-full max-w-[1100px] my-auto" onClick={e => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm">
              <div>
                <h2 className="font-bold text-lg">{editingId ? "Edit Product" : "Add New Product"}</h2>
                <p className="text-xs text-text-4 mt-0.5">Fill in the details below. All sections are visible — scroll down to complete.</p>
              </div>
              <div className="flex items-center gap-2">
                {saveSuccess && <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">Saved!</span>}
                <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
                  Save Draft
                </Button>
                <Button size="sm" onClick={() => handleSave("published")} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  {saving ? "Saving..." : editingId ? "Update & Publish" : "Publish Product"}
                </Button>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg text-text-4"><X size={18} /></button>
              </div>
            </div>

            {/* Form Body - Two Column Layout */}
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - Main Content */}
                <div className="lg:col-span-2 space-y-6">

                  {/* ═══ PRODUCT TYPE ═══ */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Product Type</SectionTitle>
                    <div className="grid grid-cols-5 gap-2">
                      {productTypes.map(t => (
                        <button key={t.value} onClick={() => setForm({ ...form, product_type: t.value })} className={`p-3 rounded-xl border-2 text-center transition-all ${form.product_type === t.value ? "border-blue bg-blue/5 shadow-sm" : "border-gray-200 hover:border-blue/30"}`}>
                          <span className="text-lg block mb-1">{t.icon}</span>
                          <p className="text-xs font-bold">{t.label}</p>
                          <p className="text-[9px] text-text-4 mt-0.5 leading-tight">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ═══ BASIC INFO ═══ */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Basic Information</SectionTitle>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-text-2 block mb-1.5">Product Name *</label>
                          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="e.g. Yamaha 200HP Outboard Engine" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-text-2 block mb-1.5">SKU *</label>
                          <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue font-mono" placeholder="YAM-200HP" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-2 block mb-1.5">Short Description</label>
                        <input value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="Brief product description for search results and cards" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-2 block mb-1.5">Full Description</label>
                        <textarea value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-y" placeholder="Detailed product information, specifications, features..." />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-2 block mb-1.5">Tags (comma separated)</label>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="security, cctv, outdoor, waterproof" className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                      </div>
                    </div>
                  </div>

                  {/* ═══ PRODUCT IMAGES ═══ */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Product Images</SectionTitle>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue/50 hover:bg-blue-50/30 transition-all">
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 text-blue animate-spin mx-auto mb-2" />
                        ) : (
                          <Upload className="w-6 h-6 text-text-4 mx-auto mb-2" />
                        )}
                        <p className="text-sm font-semibold text-text-2">Click to upload product images</p>
                        <p className="text-xs text-text-4 mt-1">PNG, JPG, WebP — multiple files supported</p>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) handleImageUpload(e.target.files); }} />
                      </label>

                      {/* Image URL Input */}
                      <div className="flex gap-2">
                        <input id="img-url-input" placeholder="Or paste an image URL here..." className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                        <Button variant="outline" size="sm" onClick={() => {
                          const input = document.getElementById("img-url-input") as HTMLInputElement;
                          if (input.value.trim()) { setForm({ ...form, images: [...form.images, input.value.trim()] }); input.value = ""; }
                        }}>Add URL</Button>
                      </div>

                      {/* Image Preview Grid */}
                      {form.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {form.images.map((img, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 aspect-square bg-gray-50">
                              <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                              {i === 0 && (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue text-white text-[9px] font-bold rounded">MAIN</span>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => removeImage(i)} className="p-1.5 bg-red text-white rounded-lg hover:bg-red/80">
                                  <Trash2 size={14} />
                                </button>
                                {i > 0 && (
                                  <button onClick={() => {
                                    const imgs = [...form.images];
                                    [imgs[0], imgs[i]] = [imgs[i], imgs[0]];
                                    setForm({ ...form, images: imgs });
                                  }} className="p-1.5 bg-blue text-white rounded-lg hover:bg-blue/80" title="Set as main">
                                    <Star size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {form.images.length === 0 && (
                        <p className="text-xs text-text-4 text-center py-2">No images added yet. Upload or paste a URL above.</p>
                      )}
                    </div>
                  </div>

                  {/* ═══ PRICING ═══ */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Pricing</SectionTitle>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-text-2 block mb-1.5">Regular Price (₦) *</label>
                          <input type="number" value={form.regular_price} onChange={e => setForm({ ...form, regular_price: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="0" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-text-2 block mb-1.5">Sale Price (₦)</label>
                          <input type="number" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="Optional" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-text-2 block mb-1.5">Cost Price (₦)</label>
                          <input type="number" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="For margin calc" />
                        </div>
                      </div>
                      {form.regular_price && form.sale_price && (
                        <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700 font-medium">
                          Discount: {Math.round(((Number(form.regular_price) - Number(form.sale_price)) / Number(form.regular_price)) * 100)}% off — Customer saves ₦{(Number(form.regular_price) - Number(form.sale_price)).toLocaleString()}
                        </div>
                      )}
                      {margin > 0 && (
                        <div className="p-3 bg-blue/5 rounded-lg text-sm text-blue font-medium">
                          Profit Margin: {margin}% · Profit per unit: ₦{(Number(form.regular_price) - Number(form.cost_price)).toLocaleString()}
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-semibold text-text-2 block mb-1.5">Tax Class</label>
                        <select value={form.tax_class} onChange={e => setForm({ ...form, tax_class: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                          <option value="standard">Standard Rate (7.5% VAT)</option>
                          <option value="reduced">Reduced Rate</option>
                          <option value="zero">Zero Rate</option>
                          <option value="exempt">Tax Exempt</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ═══ VARIATIONS ═══ */}
                  {(form.product_type === "variable") && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <SectionTitle>Variations</SectionTitle>
                      <div className="space-y-3">
                        <p className="text-xs text-text-4">Define attributes and their options. Comma-separate options.</p>
                        {form.variations.map((v, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-text-4 block mb-1">Attribute Name</label>
                                <input value={v.name} onChange={e => { const vars = [...form.variations]; vars[i] = { ...vars[i], name: e.target.value }; setForm({ ...form, variations: vars }); }} placeholder="e.g. Color" className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                              </div>
                              <div>
                                <label className="text-[10px] text-text-4 block mb-1">Options</label>
                                <input value={v.options} onChange={e => { const vars = [...form.variations]; vars[i] = { ...vars[i], options: e.target.value }; setForm({ ...form, variations: vars }); }} placeholder="Red, Blue, Black" className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                              </div>
                              <div>
                                <label className="text-[10px] text-text-4 block mb-1">Price Adjustments (₦)</label>
                                <input value={v.prices || ""} onChange={e => { const vars = [...form.variations]; vars[i] = { ...vars[i], prices: e.target.value }; setForm({ ...form, variations: vars }); }} placeholder="+0, +5000, +10000" className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                              </div>
                            </div>
                            <button onClick={() => setForm({ ...form, variations: form.variations.filter((_, idx) => idx !== i) })} className="p-1.5 hover:bg-red-50 rounded-lg text-red mt-4"><Trash2 size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => setForm({ ...form, variations: [...form.variations, { name: "", options: "", prices: "" }] })} className="flex items-center gap-1.5 text-sm text-blue font-semibold hover:underline">
                          <Plus size={14} /> Add Variation Attribute
                        </button>
                        {form.variations.length > 0 && (
                          <div className="p-3 bg-blue/5 rounded-lg text-xs text-text-3">
                            <strong>Preview:</strong> {form.variations.filter(v => v.name && v.options).map(v => `${v.name}: ${v.options}`).join(" · ") || "Add attributes above"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ═══ SHIPPING ═══ */}
                  {form.product_type !== "digital" && form.product_type !== "service" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <SectionTitle>Shipping</SectionTitle>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-text-2 block mb-1.5">Shipping Class</label>
                          <select value={form.shipping_class} onChange={e => setForm({ ...form, shipping_class: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                            <option value="standard">Standard Shipping</option>
                            <option value="heavy">Heavy / Oversize</option>
                            <option value="fragile">Fragile</option>
                            <option value="free">Free Shipping</option>
                            <option value="local_pickup">Local Pickup Only</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] text-text-4 block mb-1">Weight (kg)</label>
                            <input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full h-9 px-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="0" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-4 block mb-1">Length (cm)</label>
                            <input type="number" value={form.length} onChange={e => setForm({ ...form, length: e.target.value })} className="w-full h-9 px-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="0" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-4 block mb-1">Width (cm)</label>
                            <input type="number" value={form.width} onChange={e => setForm({ ...form, width: e.target.value })} className="w-full h-9 px-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="0" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-4 block mb-1">Height (cm)</label>
                            <input type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="w-full h-9 px-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" placeholder="0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN - Sidebar */}
                <div className="space-y-6">

                  {/* Status */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Publish</SectionTitle>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-text-2 block mb-1.5">Status</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded accent-blue" id="featured" />
                        <label htmlFor="featured" className="text-xs font-medium text-text-2 cursor-pointer">Featured product</label>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Category</SectionTitle>
                    <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {categories.length === 0 && <p className="text-[10px] text-text-4 mt-2">No categories yet. Add them in Categories section.</p>}
                  </div>

                  {/* Brand */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Brand</SectionTitle>
                    <div className="space-y-2">
                      <select value={form.brand_id} onChange={e => setForm({ ...form, brand_id: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                        <option value="">Select brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      {form.brand_id && (() => {
                        const brand = brands.find(b => b.id === form.brand_id);
                        return brand ? (
                          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: (brand.brand_color || "#1641C4") + "15" }}>
                            <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: brand.brand_color || "#1641C4" }} />
                            <span className="text-xs font-semibold" style={{ color: brand.brand_color || "#1641C4" }}>{brand.name}</span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>Inventory</SectionTitle>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-2">Track Stock</span>
                        <button onClick={() => setForm({ ...form, manage_stock: !form.manage_stock })}>
                          {form.manage_stock ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                        </button>
                      </div>
                      {form.manage_stock && (
                        <>
                          <div>
                            <label className="text-[10px] text-text-4 block mb-1">Stock Quantity</label>
                            <input type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} className="w-full h-9 px-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-4 block mb-1">Low Stock Alert</label>
                            <input type="number" value={form.low_stock_threshold} onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })} className="w-full h-9 px-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue" />
                          </div>
                        </>
                      )}
                      <p className="text-[10px] text-yellow-600 bg-yellow-50 p-2 rounded-lg">Auto-syncs with Inventory page on save.</p>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <SectionTitle>SEO Preview</SectionTitle>
                    <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <p className="text-blue text-sm font-medium truncate">{form.name || "Product Name"} — Roshanal Global</p>
                      <p className="text-green-700 text-[11px]">roshanalglobal.com/product/{form.name ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "slug"}</p>
                      <p className="text-xs text-text-3 mt-1 line-clamp-2">{form.short_description || "Add a short description..."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white rounded-b-2xl flex items-center justify-between px-6 py-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>Save as Draft</Button>
                <Button onClick={() => handleSave("published")} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  {saving ? "Saving..." : editingId ? "Update & Publish" : "Publish Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle2 size={18} />
          <div>
            <p className="text-sm font-semibold">Product Saved!</p>
            <p className="text-xs opacity-80">Inventory synced. Product is live.</p>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
