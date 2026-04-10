"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Package,
  ChevronDown,
  Star,
  CheckCircle2,
  XCircle,
  Archive,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/demo-data";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

interface DBProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  regular_price: number;
  sale_price: number | null;
  status: string;
  category_id: string | null;
  brand_id: string | null;
  short_description: string | null;
  long_description: string | null;
  featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

const emptyProduct = {
  name: "",
  sku: "",
  regular_price: "",
  sale_price: "",
  short_description: "",
  long_description: "",
  category_id: "",
  status: "draft",
  featured: false,
};

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await insforge.database
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDbProducts(data);
    } catch {
      // fallback silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = dbProducts.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category_id !== categoryFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedProducts((prev) =>
      prev.length === filtered.length ? [] : filtered.map((p) => p.id)
    );
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.sku) { alert("Product name and SKU are required."); return; }
    setSaving(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const productData = {
        name: form.name,
        slug: editingProduct ? undefined : slug,
        sku: form.sku,
        regular_price: Number(form.regular_price) || 0,
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        short_description: form.short_description || null,
        long_description: form.long_description || null,
        category_id: form.category_id || null,
        status: form.status,
        featured: form.featured,
      };

      if (editingProduct) {
        await insforge.database.from("products").update(productData).eq("id", editingProduct);
        alert("Product updated!");
      } else {
        await insforge.database.from("products").insert([{ ...productData, slug }]);
        alert("Product created!");
      }

      setShowAddForm(false);
      setEditingProduct(null);
      setForm(emptyProduct);
      await fetchProducts();
    } catch (err) {
      alert("Error saving product: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await insforge.database.from("products").delete().eq("id", id);
      setDbProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown"));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return;
    for (const id of selectedProducts) {
      await insforge.database.from("products").delete().eq("id", id);
    }
    setSelectedProducts([]);
    await fetchProducts();
  };

  const startEdit = (product: DBProduct) => {
    setForm({
      name: product.name,
      sku: product.sku,
      regular_price: String(product.regular_price),
      sale_price: product.sale_price ? String(product.sale_price) : "",
      short_description: product.short_description || "",
      long_description: product.long_description || "",
      category_id: product.category_id || "",
      status: product.status,
      featured: product.featured,
    });
    setEditingProduct(product.id);
    setShowAddForm(true);
  };

  const getCategoryName = (catId: string | null) => {
    if (!catId) return "—";
    const cat = categories.find((c) => c.id === catId || c.slug === catId);
    return cat?.name || catId;
  };

  return (
    <AdminShell title="Products" subtitle="Manage your product catalog">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-700 text-2xl text-text-1">Products</h1>
            <p className="text-sm text-text-3 mt-1">{dbProducts.length} total products</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => alert("CSV import: Upload a CSV file with columns: name, sku, regular_price, sale_price, status")}>
              <Upload className="w-3 h-3 mr-1" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const csv = "Name,SKU,Price,Status\n" + dbProducts.map((p) => `"${p.name}",${p.sku},${p.regular_price},${p.status}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "products.csv"; a.click();
            }}>
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
            <Button variant="default" size="sm" onClick={() => { setForm(emptyProduct); setEditingProduct(null); setShowAddForm(true); }}>
              <Plus className="w-3 h-3 mr-1" /> Add Product
            </Button>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-blue/20 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-700 text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => { setShowAddForm(false); setEditingProduct(null); }} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-2 block mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue" placeholder="Yamaha 200HP Outboard Engine" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 block mb-1">SKU *</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue font-mono" placeholder="YAM-200HP" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 block mb-1">Regular Price (₦) *</label>
                <input type="number" value={form.regular_price} onChange={(e) => setForm({ ...form, regular_price: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 block mb-1">Sale Price (₦)</label>
                <input type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue" placeholder="Optional" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 block mb-1">Category</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue bg-white">
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 block mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue bg-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-2 block mb-1">Short Description</label>
                <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="w-full h-10 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-blue" placeholder="Brief product description" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-2 block mb-1">Full Description</label>
                <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-blue" placeholder="Detailed product information..." />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded accent-blue" id="featured" />
                <label htmlFor="featured" className="text-sm text-text-2">Featured product</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={handleSaveProduct} disabled={saving}>
                <Save className="w-3 h-3 mr-1" /> {saving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button variant="outline" onClick={() => { setShowAddForm(false); setEditingProduct(null); }}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Products", value: dbProducts.length, color: "text-blue" },
            { label: "Published", value: dbProducts.filter((p) => p.status === "published").length, color: "text-success" },
            { label: "Draft", value: dbProducts.filter((p) => p.status === "draft").length, color: "text-warning" },
            { label: "Featured", value: dbProducts.filter((p) => p.featured).length, color: "text-purple-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
              <p className={`font-syne font-700 text-2xl ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-3 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products by name or SKU..." className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-border rounded-lg text-sm bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue/20">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue/20 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-blue font-medium">{selectedProducts.length} products selected</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-red border-red/20 hover:bg-red-50" onClick={handleBulkDelete}>
                <Trash2 className="w-3 h-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-blue/20 border-t-blue rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-text-3">Loading products...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-border">
                  <th className="p-3 text-left">
                    <input type="checkbox" checked={selectedProducts.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-border text-blue" />
                  </th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Product</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">SKU</th>
                  <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Price</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Rating</th>
                  <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-off-white/50 transition-colors">
                    <td className="p-3">
                      <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleSelect(product.id)} className="w-4 h-4 rounded border-border text-blue" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-off-white rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-text-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-1 truncate max-w-[250px]">{product.name}</p>
                          <p className="text-xs text-text-4">{getCategoryName(product.category_id)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3"><span className="font-mono text-xs text-text-3">{product.sku}</span></td>
                    <td className="p-3 text-right">
                      <p className="font-syne font-600 text-sm text-text-1">₦{Number(product.sale_price || product.regular_price).toLocaleString()}</p>
                      {product.sale_price && <p className="text-xs text-text-4 line-through">₦{Number(product.regular_price).toLocaleString()}</p>}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "published" ? "bg-green-50 text-success" :
                        product.status === "draft" ? "bg-yellow-50 text-warning" :
                        "bg-gray-50 text-text-4"
                      }`}>
                        {product.status === "published" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-text-2">{Number(product.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => window.open(`/product/${product.slug}`, "_blank")} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => startEdit(product)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-text-4/30 mx-auto mb-2" />
              <p className="text-sm text-text-3">No products found</p>
              <Button size="sm" className="mt-3" onClick={() => { setForm(emptyProduct); setShowAddForm(true); }}>
                <Plus className="w-3 h-3 mr-1" /> Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
