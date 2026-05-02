"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight,
  Upload, Star, Save, X, Loader2, Package, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge";

interface VendorProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  product_type: string;
  regular_price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  manage_stock: boolean;
  status: string;
  description: string;
  short_description: string;
  images: string[];
  category_id: string | null;
  brand_id: string | null;
  vendor_id: string | null;
  tags: string[];
  weight: number | null;
  dimensions: { length: number; width: number; height: number } | null;
  variations: any[] | null;
  created_at: string;
  updated_at: string;
}

interface Category { id: string; name: string; slug: string }
interface Brand { id: string; name: string; color: string | null }

const PRODUCT_TYPES = [
  { value: "simple", label: "Simple Product", emoji: "📦" },
  { value: "variable", label: "Variable Product", emoji: "🎨" },
  { value: "grouped", label: "Grouped Product", emoji: "📋" },
  { value: "service", label: "Service", emoji: "🛠️" },
  { value: "digital", label: "Digital Product", emoji: "💾" },
];

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    product_type: "simple",
    regular_price: 0,
    sale_price: null as number | null,
    cost_price: null as number | null,
    stock_quantity: 0,
    manage_stock: false,
    status: "draft",
    description: "",
    short_description: "",
    images: [] as string[],
    category_id: "",
    brand_id: "",
    tags: [] as string[],
    tagInput: "",
    weight: null as number | null,
    length: "",
    width: "",
    height: "",
    variations: [] as any[],
    varName: "",
    varOptions: "",
    varPrice: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await insforge.auth.getUser();
      if (!user) return;
      setVendorId(user.id);

      const [prodRes, catRes, brandRes] = await Promise.all([
        insforge.database.from("products").select("*").eq("vendor_id", user.id).order("created_at", { ascending: false }),
        insforge.database.from("categories").select("*").order("name"),
        insforge.database.from("brands").select("*").order("name"),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (brandRes.data) setBrands(brandRes.data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const base64 = await fileToBase64(files[i]);
        newImages.push(base64);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const addImageUrl = (url: string) => {
    if (url.trim()) {
      setForm((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const setMainImage = (index: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      const [main] = newImages.splice(index, 1);
      return { ...prev, images: [main, ...newImages] };
    });
  };

  const addTag = () => {
    if (form.tagInput.trim() && !form.tags.includes(form.tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, prev.tagInput.trim()], tagInput: "" }));
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addVariation = () => {
    if (!form.varName.trim() || !form.varOptions.trim()) return;
    setForm((prev) => ({
      ...prev,
      variations: [...prev.variations, {
        name: prev.varName.trim(),
        options: prev.varOptions.split(",").map((o) => o.trim()).filter(Boolean),
        price_adjustment: Number(prev.varPrice) || 0,
      }],
      varName: "", varOptions: "", varPrice: "",
    }));
  };

  const removeVariation = (index: number) => {
    setForm((prev) => ({ ...prev, variations: prev.variations.filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setForm({
      name: "", sku: "", product_type: "simple", regular_price: 0, sale_price: null,
      cost_price: null, stock_quantity: 0, manage_stock: false, status: "draft",
      description: "", short_description: "", images: [], category_id: "", brand_id: "",
      tags: [], tagInput: "", weight: null, length: "", width: "", height: "",
      variations: [], varName: "", varOptions: "", varPrice: "",
    });
    setEditingId(null);
  };

  const handleEdit = (product: VendorProduct) => {
    setForm({
      name: product.name,
      sku: product.sku,
      product_type: product.product_type || "simple",
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      cost_price: product.cost_price,
      stock_quantity: product.stock_quantity,
      manage_stock: product.manage_stock,
      status: product.status,
      description: product.description || "",
      short_description: product.short_description || "",
      images: product.images || [],
      category_id: product.category_id || "",
      brand_id: product.brand_id || "",
      tags: product.tags || [],
      tagInput: "",
      weight: product.weight,
      length: product.dimensions?.length?.toString() || "",
      width: product.dimensions?.width?.toString() || "",
      height: product.dimensions?.height?.toString() || "",
      variations: product.variations || [],
      varName: "", varOptions: "", varPrice: "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async (status: string = form.status) => {
    if (!form.name.trim()) { showToast("error", "Product name is required"); return; }
    if (!vendorId) { showToast("error", "Vendor not identified"); return; }

    setSaving(true);
    try {
      const slug = editingId ? products.find((p) => p.id === editingId)?.slug || generateSlug(form.name) : generateSlug(form.name);

      const payload = {
        name: form.name.trim(),
        slug,
        sku: form.sku.trim() || `SKU-${Date.now().toString(36)}`,
        product_type: form.product_type,
        regular_price: form.regular_price,
        sale_price: form.sale_price,
        cost_price: form.cost_price,
        stock_quantity: form.stock_quantity,
        manage_stock: form.manage_stock,
        status,
        description: form.description,
        short_description: form.short_description,
        images: form.images,
        category_id: form.category_id || null,
        brand_id: form.brand_id || null,
        vendor_id: vendorId,
        tags: form.tags,
        weight: form.weight,
        dimensions: (form.length || form.width || form.height) ? {
          length: Number(form.length) || 0,
          width: Number(form.width) || 0,
          height: Number(form.height) || 0,
        } : null,
        variations: form.product_type === "variable" ? form.variations : null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await insforge.database.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await insforge.database.from("products").insert([{ ...payload, created_at: new Date().toISOString() }]).select();
        if (error) throw error;
        if (data && data[0]) {
          await insforge.database.from("inventory").upsert([{
            product_id: data[0].id,
            sku: payload.sku,
            stock_quantity: payload.stock_quantity,
            vendor_id: vendorId,
            updated_at: new Date().toISOString(),
          }]);
        }
      }

      showToast("success", `Product ${editingId ? "updated" : "created"} successfully!`);
      setShowForm(false);
      resetForm();
      await fetchData();
    } catch (e: any) {
      showToast("error", e.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await insforge.database.from("products").delete().eq("id", id);
      showToast("success", "Product deleted");
      await fetchData();
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  const toggleStatus = async (product: VendorProduct) => {
    const newStatus = product.status === "active" ? "draft" : "active";
    try {
      await insforge.database.from("products").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", product.id);
      await fetchData();
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const discountPercent = form.regular_price > 0 && form.sale_price ? Math.round(((form.regular_price - form.sale_price) / form.regular_price) * 100) : 0;
  const marginPercent = form.regular_price > 0 && form.cost_price ? Math.round(((form.regular_price - form.cost_price) / form.regular_price) * 100) : 0;

  const selectedCategory = categories.find((c) => c.id === form.category_id);
  const selectedBrand = brands.find((b) => b.id === form.brand_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Products</h1>
            <p className="text-sm text-gray-500">{products.length} products</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
              <Plus size={16} /> {showForm && !editingId ? "Cancel" : "Add Product"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="font-semibold text-gray-900">{editingId ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRODUCT_TYPES.map((pt) => (
                      <button key={pt.value} onClick={() => setForm((prev) => ({ ...prev, product_type: pt.value }))}
                        className={`p-3 border rounded-lg text-center text-sm transition-all ${form.product_type === pt.value ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="text-xl mb-1">{pt.emoji}</div>
                        <div className="text-xs font-medium">{pt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  <input placeholder="Product Name *" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="SKU" value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                      className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                    <input placeholder="Tags (comma separated)" value={form.tagInput} onChange={(e) => setForm((prev) => ({ ...prev, tagInput: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {form.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs rounded">
                          {tag}<button onClick={() => removeTag(tag)}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <textarea placeholder="Short Description" value={form.short_description} onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                  <textarea placeholder="Full Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                </div>

                {/* Images */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-3">Product Images</h4>
                  <div className="flex gap-2 mb-3">
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                      <Upload size={14} /> Upload Files
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                    <AddImageUrlDialog onAdd={addImageUrl} />
                  </div>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                          <img src={img} alt="" className="w-full h-20 object-cover" />
                          {i === 0 && <span className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded">MAIN</span>}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {i > 0 && <button onClick={() => setMainImage(i)} className="p-1 bg-white/80 rounded" title="Set as main"><Star size={12} /></button>}
                            <button onClick={() => removeImage(i)} className="p-1 bg-white/80 rounded" title="Remove"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-3">Pricing</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Regular Price (₦)</label>
                      <input type="number" value={form.regular_price || ""} onChange={(e) => setForm((prev) => ({ ...prev, regular_price: Number(e.target.value) || 0 }))}
                        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sale Price (₦)</label>
                      <input type="number" value={form.sale_price || ""} onChange={(e) => setForm((prev) => ({ ...prev, sale_price: Number(e.target.value) || null }))}
                        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Cost Price (₦)</label>
                      <input type="number" value={form.cost_price || ""} onChange={(e) => setForm((prev) => ({ ...prev, cost_price: Number(e.target.value) || null }))}
                        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                    </div>
                  </div>
                  {(discountPercent > 0 || marginPercent > 0) && (
                    <div className="flex gap-4 text-xs mt-2">
                      {discountPercent > 0 && <span className="text-green-600">Discount: {discountPercent}%</span>}
                      {marginPercent > 0 && <span className="text-blue-600">Margin: {marginPercent}%</span>}
                    </div>
                  )}
                </div>

                {/* Variations */}
                {form.product_type === "variable" && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-3">Variations</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        <input placeholder="Attribute name (e.g. Color)" value={form.varName} onChange={(e) => setForm((prev) => ({ ...prev, varName: e.target.value }))}
                          className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                        <input placeholder="Options (comma separated)" value={form.varOptions} onChange={(e) => setForm((prev) => ({ ...prev, varOptions: e.target.value }))}
                          className="h-10 px-3 text-sm border border-gray-200 rounded-lg col-span-2" />
                        <input placeholder="Price adj. (₦)" type="number" value={form.varPrice} onChange={(e) => setForm((prev) => ({ ...prev, varPrice: e.target.value }))}
                          className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                      </div>
                      <button onClick={addVariation} className="px-3 py-1.5 bg-gray-100 text-xs rounded hover:bg-gray-200">+ Add Variation</button>
                      {form.variations.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium">{v.name}:</span>
                          <span>{v.options.join(", ")}</span>
                          {v.price_adjustment !== 0 && <span className="text-gray-500">(₦{v.price_adjustment})</span>}
                          <button onClick={() => removeVariation(i)} className="ml-auto"><X size={12} className="text-red-500" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping */}
                {form.product_type !== "digital" && form.product_type !== "service" && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-3">Shipping</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                        <input type="number" value={form.weight || ""} onChange={(e) => setForm((prev) => ({ ...prev, weight: Number(e.target.value) || null }))}
                          className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Length (cm)</label>
                        <input value={form.length} onChange={(e) => setForm((prev) => ({ ...prev, length: e.target.value }))}
                          className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Width (cm)</label>
                        <input value={form.width} onChange={(e) => setForm((prev) => ({ ...prev, width: e.target.value }))}
                          className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Height (cm)</label>
                        <input value={form.height} onChange={(e) => setForm((prev) => ({ ...prev, height: e.target.value }))}
                          className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3">PRODUCT STATUS</h5>
                  <div className="flex gap-2">
                    {["draft", "active"].map((s) => (
                      <button key={s} onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                        className={`flex-1 py-2 text-xs rounded-lg capitalize ${form.status === s ? (s === "active" ? "bg-green-600 text-white" : "bg-gray-800 text-white") : "bg-gray-100 text-gray-600"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3">CATEGORY</h5>
                  <select value={form.category_id} onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {selectedCategory && <p className="text-xs text-gray-500 mt-1">Selected: {selectedCategory.name}</p>}
                </div>

                {/* Brand */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3">BRAND</h5>
                  <select value={form.brand_id} onChange={(e) => setForm((prev) => ({ ...prev, brand_id: e.target.value }))}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white">
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  {selectedBrand && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedBrand.color || "#ccc" }} />
                      <span className="text-xs text-gray-600">{selectedBrand.name}</span>
                    </div>
                  )}
                </div>

                {/* Inventory */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3">INVENTORY</h5>
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input type="checkbox" checked={form.manage_stock} onChange={(e) => setForm((prev) => ({ ...prev, manage_stock: e.target.checked }))} className="rounded" />
                    <span className="text-xs text-gray-600">Manage stock</span>
                  </label>
                  {form.manage_stock && (
                    <input type="number" value={form.stock_quantity} onChange={(e) => setForm((prev) => ({ ...prev, stock_quantity: Number(e.target.value) || 0 }))}
                      placeholder="Stock quantity" className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                  )}
                  {form.manage_stock && (
                    <p className={`text-xs mt-1 ${form.stock_quantity === 0 ? "text-red-600" : form.stock_quantity < 10 ? "text-yellow-600" : "text-green-600"}`}>
                      {form.stock_quantity === 0 ? "Out of stock" : form.stock_quantity < 10 ? "Low stock" : "In stock"} ({form.stock_quantity} units)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-2 rounded-b-xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleSave("draft")} disabled={saving} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
              </button>
              <button onClick={() => handleSave("active")} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Package size={14} />} {editingId ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg" />
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12"><Loader2 size={24} className="animate-spin mx-auto text-gray-400" /></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Product", "SKU", "Price", "Stock", "Type", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left p-4 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 flex items-center gap-3">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.short_description?.slice(0, 40) || "No description"}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-xs">{p.sku}</td>
                    <td className="p-4">
                      <span className="font-semibold">₦{p.regular_price?.toLocaleString()}</span>
                      {p.sale_price && <span className="text-xs text-red-500 line-through ml-1">₦{p.sale_price.toLocaleString()}</span>}
                    </td>
                    <td className="p-4">
                      <span className={p.stock_quantity === 0 ? "text-red-600 font-semibold text-xs" : "text-xs"}>
                        {p.manage_stock ? p.stock_quantity : "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">{p.product_type}</span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleStatus(p)} title="Toggle status">
                        {p.status === "active" ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400 text-sm">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AddImageUrlDialog({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
        <ImageIcon size={14} /> Add URL
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold mb-3 text-sm">Add Image URL</h4>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg mb-3" autoFocus />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 border border-gray-200 text-sm rounded-lg">Cancel</button>
              <button onClick={() => { if (url.trim()) { onAdd(url.trim()); setUrl(""); setOpen(false); } }}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
