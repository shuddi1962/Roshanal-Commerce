"use client";

import { useState } from "react";
import { Search, Download, Upload, Package, AlertTriangle, CheckCircle2, MapPin, ChevronDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/demo-data";
import AdminShell from "@/components/admin/admin-shell";

export default function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const inventoryItems = products.map((p) => ({
    ...p,
    totalStock: p.inventory.reduce((a, b) => a + b.quantity, 0),
    isLowStock: p.inventory.some((i) => i.quantity <= i.lowStockThreshold),
    isOutOfStock: p.inventory.every((i) => i.quantity === 0),
  }));

  const filtered = inventoryItems.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (stockFilter === "low" && !p.isLowStock) return false;
    if (stockFilter === "out" && !p.isOutOfStock) return false;
    if (stockFilter === "in" && p.totalStock <= 0) return false;
    return true;
  });

  const totalItems = inventoryItems.reduce((a, b) => a + b.totalStock, 0);
  const lowStockCount = inventoryItems.filter((p) => p.isLowStock).length;
  const outOfStockCount = inventoryItems.filter((p) => p.isOutOfStock).length;

  return (
    <AdminShell title="Inventory" subtitle="Stock management across locations">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-700 text-2xl text-text-1">Inventory</h1>
          <p className="text-sm text-text-3 mt-1">Multi-location stock management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm"><Upload className="w-3 h-3 mr-1" /> Import CSV</Button>
          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-syne font-700 text-2xl text-blue">{totalItems}</p>
          <p className="text-xs text-text-3 mt-1">Total Items in Stock</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-syne font-700 text-2xl text-success">{inventoryItems.length}</p>
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
          <button
            key={loc}
            onClick={() => setLocationFilter(loc)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              locationFilter === loc ? "bg-blue text-white" : "bg-white border border-border text-text-2 hover:border-blue/30"
            }`}
          >
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
        <table className="w-full">
          <thead>
            <tr className="bg-off-white border-b border-border">
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Product</th>
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">SKU</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Port Harcourt</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Lagos</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Total</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
              <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const phcStock = product.inventory.find((i) => i.locationId === "phc")?.quantity || 0;
              const lagosStock = product.inventory.find((i) => i.locationId === "lagos")?.quantity || 0;
              return (
                <tr key={product.id} className="border-b border-border hover:bg-off-white/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-off-white rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-text-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-1 truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-text-4">{product.brand.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs text-text-3">{product.sku}</td>
                  <td className="p-3 text-center">
                    <span className={`text-sm font-medium ${phcStock <= 5 ? "text-red" : "text-text-1"}`}>{phcStock}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-sm font-medium ${lagosStock <= 5 ? "text-red" : "text-text-1"}`}>{lagosStock}</span>
                  </td>
                  <td className="p-3 text-center font-syne font-600 text-sm text-text-1">{product.totalStock}</td>
                  <td className="p-3 text-center">
                    {product.isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red">
                        <AlertTriangle className="w-3 h-3" /> Out
                      </span>
                    ) : product.isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-warning">
                        <AlertTriangle className="w-3 h-3" /> Low
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-success">
                        <CheckCircle2 className="w-3 h-3" /> OK
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </AdminShell>
  );
}
