"use client";

import { useState, useEffect } from "react";
import { Search, Download, Upload, Package, AlertTriangle, CheckCircle2, MapPin, ChevronDown, Edit, X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  brand: string;
  phc_stock: number;
  lagos_stock: number;
  low_stock_threshold: number;
}

const seedInventory: Omit<InventoryItem, "id">[] = [
  { product_name: "Hikvision 4MP Dome Camera", sku: "RSH-CAM-001", brand: "Hikvision", phc_stock: 45, lagos_stock: 30, low_stock_threshold: 10 },
  { product_name: "Yamaha 40HP Outboard Engine", sku: "RSH-ENG-001", brand: "Yamaha", phc_stock: 8, lagos_stock: 3, low_stock_threshold: 5 },
  { product_name: "Marine GPS Navigator Pro", sku: "RSH-NAV-001", brand: "Garmin", phc_stock: 12, lagos_stock: 15, low_stock_threshold: 5 },
  { product_name: "Life Jacket Premium Adult", sku: "RSH-SAF-001", brand: "Roshanal", phc_stock: 120, lagos_stock: 85, low_stock_threshold: 20 },
  { product_name: "Dahua 8CH NVR Recorder", sku: "RSH-NVR-001", brand: "Dahua", phc_stock: 22, lagos_stock: 18, low_stock_threshold: 8 },
  { product_name: "Mercury 200HP Engine", sku: "RSH-ENG-002", brand: "Mercury", phc_stock: 2, lagos_stock: 1, low_stock_threshold: 3 },
  { product_name: "Anchor Chain 10m Galvanized", sku: "RSH-MAR-001", brand: "Roshanal", phc_stock: 35, lagos_stock: 0, low_stock_threshold: 10 },
  { product_name: "Solar Panel 300W Mono", sku: "RSH-SOL-001", brand: "JA Solar", phc_stock: 50, lagos_stock: 42, low_stock_threshold: 15 },
  { product_name: "Fire Extinguisher 5kg", sku: "RSH-SAF-002", brand: "Naffco", phc_stock: 0, lagos_stock: 0, low_stock_threshold: 10 },
  { product_name: "Boat Steering Console", sku: "RSH-MAR-002", brand: "Roshanal", phc_stock: 6, lagos_stock: 4, low_stock_threshold: 5 },
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState({ phc_stock: 0, lagos_stock: 0, low_stock_threshold: 10 });
  const [saving, setSaving] = useState(false);

  // Add product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ product_name: "", sku: "", brand: "", phc_stock: 0, lagos_stock: 0, low_stock_threshold: 10 });

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    try {
      const { data, error } = await insforge.database.from("inventory").select("*").order("product_name", { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setItems(data);
      } else {
        for (const item of seedInventory) {
          await insforge.database.from("inventory").insert(item);
        }
        const { data: seeded } = await insforge.database.from("inventory").select("*");
        if (seeded) setItems(seeded);
      }
    } catch (err) {
      console.error("Inventory load error:", err);
      setItems(seedInventory.map((i, idx) => ({ ...i, id: String(idx + 1) })));
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      await insforge.database.from("inventory").update(editForm).eq("id", editItem.id);
      setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, ...editForm } : i));
      setShowEditModal(false);
      setEditItem(null);
    } catch (err) {
      console.error("Update stock error:", err);
    } finally {
      setSaving(false);
    }
  };

  const addProduct = async () => {
    if (!addForm.product_name || !addForm.sku) return;
    setSaving(true);
    try {
      const { data } = await insforge.database.from("inventory").insert(addForm).select();
      if (data) setItems((prev) => [...prev, data[0]]);
      setShowAddModal(false);
      setAddForm({ product_name: "", sku: "", brand: "", phc_stock: 0, lagos_stock: 0, low_stock_threshold: 10 });
    } catch (err) {
      console.error("Add product error:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await insforge.database.from("inventory").delete().eq("id", id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const exportCSV = () => {
    const headers = ["Product", "SKU", "Brand", "PHC Stock", "Lagos Stock", "Total", "Status"];
    const rows = items.map((i) => {
      const total = (i.phc_stock || 0) + (i.lagos_stock || 0);
      const status = total === 0 ? "Out of Stock" : (i.phc_stock <= i.low_stock_threshold || i.lagos_stock <= i.low_stock_threshold) ? "Low Stock" : "In Stock";
      return [i.product_name, i.sku, i.brand, i.phc_stock, i.lagos_stock, total, status];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const lines = text.split("\n").slice(1);
      for (const line of lines) {
        const [product_name, sku, brand, phc, lagos, , ] = line.split(",");
        if (product_name && sku) {
          try {
            await insforge.database.from("inventory").insert({
              product_name: product_name.trim(), sku: sku.trim(), brand: brand?.trim() || "",
              phc_stock: parseInt(phc) || 0, lagos_stock: parseInt(lagos) || 0, low_stock_threshold: 10,
            });
          } catch {}
        }
      }
      loadInventory();
    };
    input.click();
  };

  const enriched = items.map((i) => ({
    ...i,
    totalStock: (i.phc_stock || 0) + (i.lagos_stock || 0),
    isLowStock: (i.phc_stock || 0) <= (i.low_stock_threshold || 10) || (i.lagos_stock || 0) <= (i.low_stock_threshold || 10),
    isOutOfStock: (i.phc_stock || 0) === 0 && (i.lagos_stock || 0) === 0,
  }));

  const filtered = enriched.filter((p) => {
    if (searchQuery && !p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (stockFilter === "low" && !p.isLowStock) return false;
    if (stockFilter === "out" && !p.isOutOfStock) return false;
    if (stockFilter === "in" && p.totalStock <= 0) return false;
    if (locationFilter === "phc" && p.phc_stock <= 0) return false;
    if (locationFilter === "lagos" && p.lagos_stock <= 0) return false;
    return true;
  });

  const totalItemsInStock = enriched.reduce((a, b) => a + b.totalStock, 0);
  const lowStockCount = enriched.filter((p) => p.isLowStock && !p.isOutOfStock).length;
  const outOfStockCount = enriched.filter((p) => p.isOutOfStock).length;

  return (
    <AdminShell title="Inventory" subtitle="Stock management across locations">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-700 text-2xl text-text-1">Inventory</h1>
            <p className="text-sm text-text-3 mt-1">Multi-location stock management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={importCSV}><Upload className="w-3 h-3 mr-1" /> Import CSV</Button>
            <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-3 h-3 mr-1" /> Export</Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}><Plus className="w-3 h-3 mr-1" /> Add Product</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-blue">{totalItemsInStock}</p>
            <p className="text-xs text-text-3 mt-1">Total Items in Stock</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-success">{items.length}</p>
            <p className="text-xs text-text-3 mt-1">Products Tracked</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-warning">{lowStockCount}</p>
            <p className="text-xs text-text-3 mt-1">Low Stock Alerts</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-red">{outOfStockCount}</p>
            <p className="text-xs text-text-3 mt-1">Out of Stock</p>
          </div>
        </div>

        {/* Location Tabs */}
        <div className="flex gap-2 mb-4">
          {["all", "phc", "lagos"].map((loc) => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${locationFilter === loc ? "bg-blue text-white" : "bg-white border border-border text-text-2 hover:border-blue/30"}`}>
              <MapPin className="w-3 h-3 inline mr-1" />
              {loc === "all" ? "All Locations" : loc === "phc" ? "Port Harcourt" : "Lagos"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by product name or SKU..." className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
            </div>
            <div className="relative">
              <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="px-4 py-2 border border-border rounded-lg text-sm bg-white appearance-none pr-8">
                <option value="all">All Stock Levels</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-text-4 text-sm">Loading inventory...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-border">
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Product</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">SKU</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Port Harcourt</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Lagos</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Total</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
                  <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-text-4 text-sm">No inventory items found</td></tr>
                ) : filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-off-white/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-off-white rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-text-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-1 truncate max-w-[200px]">{product.product_name}</p>
                          <p className="text-xs text-text-4">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-text-3">{product.sku}</td>
                    <td className="p-3 text-center">
                      <span className={`text-sm font-medium ${(product.phc_stock || 0) <= (product.low_stock_threshold || 10) ? "text-red" : "text-text-1"}`}>{product.phc_stock || 0}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-sm font-medium ${(product.lagos_stock || 0) <= (product.low_stock_threshold || 10) ? "text-red" : "text-text-1"}`}>{product.lagos_stock || 0}</span>
                    </td>
                    <td className="p-3 text-center font-syne font-600 text-sm text-text-1">{product.totalStock}</td>
                    <td className="p-3 text-center">
                      {product.isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red"><AlertTriangle className="w-3 h-3" /> Out</span>
                      ) : product.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-warning"><AlertTriangle className="w-3 h-3" /> Low</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-success"><CheckCircle2 className="w-3 h-3" /> OK</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditItem(product); setEditForm({ phc_stock: product.phc_stock || 0, lagos_stock: product.lagos_stock || 0, low_stock_threshold: product.low_stock_threshold || 10 }); setShowEditModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Edit Stock">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteItem(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Stock Modal */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-syne font-bold text-lg text-text-1">Update Stock</h2>
                <p className="text-xs text-text-4">{editItem.product_name} ({editItem.sku})</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Port Harcourt Stock</label>
                <input type="number" min={0} value={editForm.phc_stock} onChange={(e) => setEditForm({ ...editForm, phc_stock: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Lagos Stock</label>
                <input type="number" min={0} value={editForm.lagos_stock} onChange={(e) => setEditForm({ ...editForm, lagos_stock: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Low Stock Threshold</label>
                <input type="number" min={0} value={editForm.low_stock_threshold} onChange={(e) => setEditForm({ ...editForm, low_stock_threshold: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="bg-off-white rounded-lg p-3">
                <p className="text-xs text-text-4">New Total: <span className="font-semibold text-text-1">{editForm.phc_stock + editForm.lagos_stock}</span></p>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={updateStock} disabled={saving}>
                <Save size={14} className="mr-1" /> {saving ? "Saving..." : "Update Stock"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg text-text-1">Add Inventory Product</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Product Name *</label>
                <input value={addForm.product_name} onChange={(e) => setAddForm({ ...addForm, product_name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">SKU *</label>
                  <input value={addForm.sku} onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm font-mono focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Brand</label>
                  <input value={addForm.brand} onChange={(e) => setAddForm({ ...addForm, brand: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">PHC Stock</label>
                  <input type="number" min={0} value={addForm.phc_stock} onChange={(e) => setAddForm({ ...addForm, phc_stock: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Lagos Stock</label>
                  <input type="number" min={0} value={addForm.lagos_stock} onChange={(e) => setAddForm({ ...addForm, lagos_stock: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Low Threshold</label>
                  <input type="number" min={0} value={addForm.low_stock_threshold} onChange={(e) => setAddForm({ ...addForm, low_stock_threshold: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={addProduct} disabled={saving || !addForm.product_name || !addForm.sku}>
                {saving ? "Adding..." : "Add to Inventory"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
