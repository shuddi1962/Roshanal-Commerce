"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, Package, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";

const demoOrders = [
  { id: "ORD-5001", customer: "Emeka Obi", items: 2, total: 4685000, status: "pending", date: "2024-03-15", address: "12 Marina Rd, Lagos" },
  { id: "ORD-5002", customer: "Funke Adeyemi", items: 1, total: 185000, status: "processing", date: "2024-03-14", address: "45 Allen Ave, Ikeja" },
  { id: "ORD-5003", customer: "Chidi Nwankwo", items: 3, total: 560000, status: "shipped", date: "2024-03-13", address: "8 Trans Amadi, PH" },
  { id: "ORD-5004", customer: "Aisha Bello", items: 1, total: 15000, status: "delivered", date: "2024-03-12", address: "23 Maitama, Abuja" },
  { id: "ORD-5005", customer: "David Okoro", items: 4, total: 1250000, status: "cancelled", date: "2024-03-11", address: "67 GRA, Benin" },
  { id: "ORD-5006", customer: "Grace Eze", items: 2, total: 330000, status: "pending", date: "2024-03-15", address: "15 Aba Road, PH" },
];

const statusConfig: Record<string, { color: string; icon: typeof Clock; bg: string }> = {
  pending: { color: "text-yellow-700", icon: Clock, bg: "bg-yellow-100" },
  processing: { color: "text-blue-700", icon: Package, bg: "bg-blue-100" },
  shipped: { color: "text-purple-700", icon: Truck, bg: "bg-purple-100" },
  delivered: { color: "text-green-700", icon: CheckCircle2, bg: "bg-green-100" },
  cancelled: { color: "text-red-700", icon: XCircle, bg: "bg-red-100" },
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(demoOrders);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    alert(`Order ${id} marked as ${status}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Orders</h1><p className="text-sm text-gray-500">{orders.length} total orders</p></div>
          <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {["all", "pending", "processing", "shipped", "delivered"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs rounded-lg border capitalize ${filter === f ? "bg-purple-600 text-white border-purple-600" : "bg-white border-gray-200"}`}>
              {f} ({f === "all" ? orders.length : orders.filter((o) => o.status === f).length})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg" />
        </div>

        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color} flex items-center gap-1`}><StatusIcon size={10} />{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-700">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.date} · {order.items} items · {order.address}</p>
                  </div>
                  <p className="text-lg font-bold">₦{order.total.toLocaleString()}</p>
                </div>

                {viewOrder === order.id && (
                  <div className="mb-3 p-4 bg-gray-50 rounded-lg border text-xs space-y-1">
                    <p><span className="text-gray-400">Customer:</span> {order.customer}</p>
                    <p><span className="text-gray-400">Address:</span> {order.address}</p>
                    <p><span className="text-gray-400">Items:</span> {order.items}</p>
                    <p><span className="text-gray-400">Total:</span> ₦{order.total.toLocaleString()}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button onClick={() => setViewOrder(viewOrder === order.id ? null : order.id)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-gray-500" /></button>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && <button onClick={() => updateStatus(order.id, "processing")} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">Process</button>}
                    {order.status === "processing" && <button onClick={() => updateStatus(order.id, "shipped")} className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">Mark Shipped</button>}
                    {order.status === "shipped" && <button onClick={() => updateStatus(order.id, "delivered")} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">Mark Delivered</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
