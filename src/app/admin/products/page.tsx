"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/demo-data";
import AdminShell from "@/components/admin/admin-shell";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filtered = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category.slug !== categoryFilter) return false;
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

  return (
    <AdminShell title="Products" subtitle="Manage your product catalog">
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-700 text-2xl text-text-1">Products</h1>
          <p className="text-sm text-text-3 mt-1">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-3 h-3 mr-1" /> Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-3 h-3 mr-1" /> Export
          </Button>
          <Button variant="default" size="sm">
            <Plus className="w-3 h-3 mr-1" /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: products.length, color: "text-blue" },
          { label: "Published", value: products.filter((p) => p.status === "published").length, color: "text-success" },
          { label: "Draft", value: products.filter((p) => p.status === "draft").length, color: "text-warning" },
          { label: "Low Stock", value: products.filter((p) => p.inventory.some((i) => i.quantity <= i.lowStockThreshold)).length, color: "text-red" },
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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue/20"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-4 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue/20"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
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
            <Button variant="outline" size="sm"><Archive className="w-3 h-3 mr-1" /> Archive</Button>
            <Button variant="outline" size="sm" className="text-red border-red/20 hover:bg-red-50"><Trash2 className="w-3 h-3 mr-1" /> Delete</Button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-off-white border-b border-border">
              <th className="p-3 text-left">
                <input type="checkbox" checked={selectedProducts.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-border text-blue" />
              </th>
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Product</th>
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">SKU</th>
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Category</th>
              <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Price</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Stock</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Rating</th>
              <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const totalStock = product.inventory.reduce((a, b) => a + b.quantity, 0);
              const isLowStock = product.inventory.some((i) => i.quantity <= i.lowStockThreshold);
              return (
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
                        <Link href={`/product/${product.slug}`} className="text-sm font-medium text-text-1 hover:text-blue truncate block max-w-[250px]">
                          {product.name}
                        </Link>
                        <p className="text-xs text-text-4">{product.brand.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-xs text-text-3">{product.sku}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-text-2">{product.category.name}</span>
                  </td>
                  <td className="p-3 text-right">
                    <p className="font-syne font-600 text-sm text-text-1">₦{(product.salePrice || product.regularPrice).toLocaleString()}</p>
                    {product.salePrice && (
                      <p className="text-xs text-text-4 line-through">₦{product.regularPrice.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-sm font-medium ${isLowStock ? "text-red" : totalStock > 0 ? "text-success" : "text-text-4"}`}>
                      {totalStock}
                    </span>
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
                      <span className="text-xs text-text-2">{product.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-text-4/30 mx-auto mb-2" />
            <p className="text-sm text-text-3">No products found</p>
          </div>
        )}
      </div>
    </div>
    </AdminShell>
  );
}
