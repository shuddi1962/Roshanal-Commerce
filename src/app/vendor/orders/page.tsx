"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Eye, Package, Truck, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { insforge } from "@/lib/insforge";

interface VendorOrder {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: any[];
  total_amount: number;
  status: string;
  created_at: string;
  vendor_id: string;
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; bg: string }> = {
  pending: { color: "text-yellow-700", icon: Clock, bg: "bg-yellow-100" },
  processing: { color: "text-blue-700", icon: Package, bg: "bg-blue-100" },
  shipped: { color: "text-purple-700", icon: Truck, bg: "bg-purple-100" },
  delivered: { color: "text-green-700", icon: CheckCircle2, bg: "bg-green-100" },
  cancelled: { color: "text-red-700", icon: XCircle, bg: "bg-red-100" },
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await insforge.auth.getCurrentUser();
      if (!user) return;
      setVendorId(user.id);

      const { data, error } = await insforge.database
        .from("orders")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (e: any) {
      console.error("Fetch orders error:", e);
      showToast("error", e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.order_id?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const { error } = await insforge.database
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      showToast("success", `Order ${id} marked as ${status}`);
      await fetchOrders();
    } catch (e: any) {
      showToast("error", e.message || "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  const getItemsCount = (items: any[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

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
          <input placeholder="Search by order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg" />
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 size={24} className="animate-spin mx-auto text-gray-400" /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const itemsCount = getItemsCount(order.items);
              return (
                <div key={order.id} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm font-mono">{order.order_id || order.id.slice(0, 8)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color} flex items-center gap-1`}><StatusIcon size={10} />{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-700">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.created_at?.slice(0, 10)} · {itemsCount} item(s) · {order.shipping_address || "No address"}</p>
                    </div>
                    <p className="text-lg font-bold">₦{order.total_amount?.toLocaleString() || 0}</p>
                  </div>

                  {viewOrder === order.id && (
                    <div className="mb-3 p-4 bg-gray-50 rounded-lg border text-xs space-y-1">
                      <p><span className="text-gray-400">Customer:</span> {order.customer_name}</p>
                      <p><span className="text-gray-400">Email:</span> {order.customer_email}</p>
                      <p><span className="text-gray-400">Phone:</span> {order.customer_phone}</p>
                      <p><span className="text-gray-400">Address:</span> {order.shipping_address}</p>
                      <p><span className="text-gray-400">Items:</span> {itemsCount}</p>
                      <p><span className="text-gray-400">Total:</span> ₦{order.total_amount?.toLocaleString()}</p>
                      {order.items && Array.isArray(order.items) && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-gray-400 mb-1">Order Items:</p>
                          {order.items.map((item: any, i: number) => (
                            <p key={i} className="ml-2">• {item.name || item.product_name} x{item.quantity || 1} — ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button onClick={() => setViewOrder(viewOrder === order.id ? null : order.id)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Eye size={14} className="text-gray-500" />
                    </button>
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <button onClick={() => updateStatus(order.id, "processing")} disabled={updating === order.id}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50">
                          {updating === order.id ? "Processing..." : "Process"}
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button onClick={() => updateStatus(order.id, "shipped")} disabled={updating === order.id}
                          className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 disabled:opacity-50">
                          {updating === order.id ? "Updating..." : "Mark Shipped"}
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button onClick={() => updateStatus(order.id, "delivered")} disabled={updating === order.id}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50">
                          {updating === order.id ? "Updating..." : "Mark Delivered"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No orders found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
