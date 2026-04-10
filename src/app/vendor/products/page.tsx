"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Image } from "lucide-react";

const demoProducts = [
  { id: 1, name: "Yamaha 200HP Outboard Engine", sku: "YAM-200HP", price: 4500000, stock: 5, status: "active", category: "Boat Engines", sales: 12, image: null },
  { id: 2, name: "Hikvision 4CH CCTV Kit", sku: "HIK-4CH", price: 185000, stock: 23, status: "active", category: "Security", sales: 45, image: null },
  { id: 3, name: "Fire Extinguisher 9kg", sku: "FE-9KG", price: 15000, stock: 100, status: "active", category: "Safety", sales: 89, image: null },
  { id: 4, name: "Commercial Gas Cooker", sku: "CGC-6B", price: 350000, stock: 0, status: "out_of_stock", category: "Kitchen", sales: 8, image: null },
  { id: 5, name: "Marine GPS Navigator", sku: "GPS-MAR", price: 280000, stock: 3, status: "draft", category: "Marine", sales: 0, image: null },
];

export default function VendorProductsPage() {
  const [products, setProducts] = useState(demoProducts);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", price: "", stock: "", category: "" });

  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "draft" : "active" } : p));
  };

  const deleteProduct = (id: number) => {
    if (confirm("Delete this product?")) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) { alert("Name and price are required."); return; }
    setProducts((prev) => [...prev, { id: Date.now(), name: newProduct.name, sku: newProduct.sku, price: Number(newProduct.price), stock: Number(newProduct.stock) || 0, status: "draft", category: newProduct.category, sales: 0, image: null }]);
    setNewProduct({ name: "", sku: "", price: "", stock: "", category: "" });
    setShowAddForm(false);
    alert("Product added as draft!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Products</h1>
            <p className="text-sm text-gray-500">{products.length} products</p>
          </div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {showAddForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h3 className="font-semibold text-sm">Add New Product</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg col-span-2" />
              <input placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input placeholder="Price (₦)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
              <input placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="h-10 px-3 text-sm border border-gray-200 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <button onClick={addProduct} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">Save Product</button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {["Product", "SKU", "Price", "Stock", "Sales", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs text-gray-500 font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Image size={16} className="text-gray-400" /></div>
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="p-4 font-semibold">₦{p.price.toLocaleString()}</td>
                  <td className="p-4"><span className={p.stock === 0 ? "text-red-600 font-semibold" : ""}>{p.stock}</span></td>
                  <td className="p-4">{p.sales}</td>
                  <td className="p-4">
                    <button onClick={() => toggleStatus(p.id)}>
                      {p.status === "active" ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => alert(`View: ${p.name}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-gray-500" /></button>
                      <button onClick={() => alert(`Edit: ${p.name}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
