"use client";

import { useState, useEffect } from "react";
import {
  Search, Download, Eye, Package, ChevronDown, Clock, Truck, CheckCircle2,
  XCircle, AlertCircle, Printer, X, ChevronRight, RefreshCw, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
}

interface Order {
  id: string;
  order_id: string;
  customer: string;
  email: string;
  phone?: string;
  date: string;
  status: string;
  payment: string;
  items: OrderItem[];
  item_count: number;
  total: number;
  branch: string;
  shipping_address?: string;
  notes?: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-warning", bg: "bg-yellow-50", icon: Clock },
  processing: { label: "Processing", color: "text-blue", bg: "bg-blue-50", icon: Package },
  confirmed: { label: "Confirmed", color: "text-blue", bg: "bg-blue-50", icon: CheckCircle2 },
  packed: { label: "Packed", color: "text-indigo-600", bg: "bg-indigo-50", icon: Package },
  dispatched: { label: "Dispatched", color: "text-blue", bg: "bg-blue-50", icon: Truck },
  "in-transit": { label: "In Transit", color: "text-blue", bg: "bg-blue-50", icon: Truck },
  delivered: { label: "Delivered", color: "text-success", bg: "bg-green-50", icon: CheckCircle2 },
  completed: { label: "Completed", color: "text-success", bg: "bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red", bg: "bg-red-50", icon: XCircle },
  "on-hold": { label: "On Hold", color: "text-warning", bg: "bg-yellow-50", icon: AlertCircle },
};

const statusFlow = ["pending", "processing", "confirmed", "packed", "dispatched", "in-transit", "delivered", "completed"];

const seedOrders: Omit<Order, "id">[] = [
  { order_id: "RSH-2026-001234", customer: "John Doe", email: "john@example.com", phone: "08012345678", date: "2026-04-02", status: "in-transit", payment: "paid", items: [{ name: "Yamaha 40HP Outboard", quantity: 1, price: 250000 }, { name: "Life Jacket Pro", quantity: 2, price: 45000 }], item_count: 3, total: 340000, branch: "Port Harcourt", shipping_address: "12 Ada George Rd, PHC" },
  { order_id: "RSH-2026-001233", customer: "Amina Bello", email: "amina@example.com", phone: "08098765432", date: "2026-04-02", status: "processing", payment: "paid", items: [{ name: "Marine GPS Navigator", quantity: 1, price: 195000 }], item_count: 1, total: 195000, branch: "Lagos", shipping_address: "5 Victoria Island, Lagos" },
  { order_id: "RSH-2026-001232", customer: "Chidi Okafor", email: "chidi@example.com", date: "2026-04-01", status: "pending", payment: "pending", items: [{ name: "Anchor Chain 10m", quantity: 1, price: 45000 }, { name: "Boat Cover Medium", quantity: 1, price: 44000 }], item_count: 2, total: 89000, branch: "Port Harcourt" },
  { order_id: "RSH-2026-001231", customer: "Fatima Hassan", email: "fatima@example.com", phone: "07011223344", date: "2026-04-01", status: "delivered", payment: "paid", items: [{ name: "Mercury 200HP Engine", quantity: 1, price: 4200000 }, { name: "Propeller Set", quantity: 1, price: 150000 }, { name: "Engine Oil 5L", quantity: 3, price: 50000 }], item_count: 5, total: 4500000, branch: "Bayelsa", shipping_address: "Marine Base, Yenagoa" },
  { order_id: "RSH-2026-001230", customer: "Emeka Eze", email: "emeka@example.com", date: "2026-03-31", status: "completed", payment: "paid", items: [{ name: "First Aid Marine Kit", quantity: 1, price: 72500 }], item_count: 1, total: 72500, branch: "Lagos" },
  { order_id: "RSH-2026-001229", customer: "Grace Nwosu", email: "grace@example.com", date: "2026-03-31", status: "cancelled", payment: "refunded", items: [{ name: "Boat Seat Deluxe", quantity: 2, price: 80000 }], item_count: 2, total: 160000, branch: "Port Harcourt" },
  { order_id: "RSH-2026-001228", customer: "Tunde Bakare", email: "tunde@example.com", phone: "08155667788", date: "2026-03-30", status: "packed", payment: "paid", items: [{ name: "Navigation Light Set", quantity: 1, price: 85000 }, { name: "Marine Radio", quantity: 1, price: 120000 }, { name: "Flare Kit", quantity: 2, price: 40000 }], item_count: 4, total: 285000, branch: "Lagos", shipping_address: "22 Lekki Phase 1, Lagos" },
  { order_id: "RSH-2026-001227", customer: "Blessing Idris", email: "blessing@example.com", date: "2026-03-30", status: "confirmed", payment: "paid", items: [{ name: "Suzuki 60HP Outboard", quantity: 1, price: 320000 }], item_count: 1, total: 320000, branch: "Port Harcourt" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await insforge.database.from("orders").select("*").order("date", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setOrders(data);
      } else {
        // Seed with demo data
        for (const order of seedOrders) {
          await insforge.database.from("orders").insert(order);
        }
        const { data: seeded } = await insforge.database.from("orders").select("*").order("date", { ascending: false });
        if (seeded) setOrders(seeded);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      // Fallback to local data
      setOrders(seedOrders.map((o, i) => ({ ...o, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const { error } = await insforge.database.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      if (viewOrder?.id === orderId) setViewOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const exportOrders = () => {
    const headers = ["Order ID", "Customer", "Email", "Date", "Status", "Payment", "Items", "Total", "Branch"];
    const rows = filtered.map((o) => [o.order_id, o.customer, o.email, o.date, o.status, o.payment, o.item_count, o.total, o.branch]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printOrder = (order: Order) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Order ${order.order_id}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}
      h1{font-size:24px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:20px 0}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}th{background:#f5f5f5}
      .header{display:flex;justify-content:space-between;align-items:start;margin-bottom:30px}
      .total{text-align:right;font-size:18px;font-weight:bold;margin-top:10px}
      .meta{color:#666;font-size:13px}
      @media print{body{padding:20px}}</style></head><body>
      <div class="header"><div><h1>Roshanal Global</h1><p class="meta">Order Invoice</p></div>
      <div style="text-align:right"><h2>${order.order_id}</h2><p class="meta">${order.date}</p></div></div>
      <p><strong>Customer:</strong> ${order.customer}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      ${order.phone ? `<p><strong>Phone:</strong> ${order.phone}</p>` : ""}
      ${order.shipping_address ? `<p><strong>Shipping:</strong> ${order.shipping_address}</p>` : ""}
      <p><strong>Status:</strong> ${order.status.toUpperCase()} | <strong>Payment:</strong> ${order.payment.toUpperCase()}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>
      ${(order.items || []).map((item) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₦${item.price.toLocaleString()}</td><td>₦${(item.price * item.quantity).toLocaleString()}</td></tr>`).join("")}
      </tbody></table>
      <p class="total">Total: ₦${order.total.toLocaleString()}</p>
      <script>window.print()</script></body></html>
    `);
    win.document.close();
  };

  const filtered = orders.filter((o) => {
    if (searchQuery && !o.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) && !o.customer?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = orders.filter((o) => o.payment === "paid").reduce((a, b) => a + (b.total || 0), 0);

  return (
    <AdminShell title="Orders" subtitle="Manage customer orders">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-700 text-2xl text-text-1">Orders</h1>
            <p className="text-sm text-text-3 mt-1">{orders.length} total orders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadOrders}>
              <RefreshCw className="w-3 h-3 mr-1" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportOrders}>
              <Download className="w-3 h-3 mr-1" /> Export Orders
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Orders", value: orders.length, color: "text-blue" },
            { label: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "text-warning" },
            { label: "Processing", value: orders.filter((o) => ["processing", "confirmed", "packed"].includes(o.status)).length, color: "text-blue" },
            { label: "Delivered", value: orders.filter((o) => ["delivered", "completed"].includes(o.status)).length, color: "text-success" },
            { label: "Revenue", value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, color: "text-success" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
              <p className={`font-syne font-700 text-xl ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-3 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or customer name..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20"
              />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-border rounded-lg text-sm bg-white appearance-none pr-8 focus:outline-none">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-text-4 text-sm">Loading orders...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-border">
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Order</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Customer</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Date</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Payment</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Items</th>
                  <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Total</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Branch</th>
                  <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="p-8 text-center text-text-4 text-sm">No orders found</td></tr>
                ) : filtered.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="border-b border-border hover:bg-off-white/50">
                      <td className="p-3">
                        <span className="font-mono text-sm font-medium text-text-1">{order.order_id}</span>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-text-1">{order.customer}</p>
                        <p className="text-xs text-text-4">{order.email}</p>
                      </td>
                      <td className="p-3 text-sm text-text-3">{order.date}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" /> {status.label}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-xs font-medium ${order.payment === "paid" ? "text-success" : order.payment === "refunded" ? "text-text-4" : "text-warning"}`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm text-text-2">{order.item_count}</td>
                      <td className="p-3 text-right font-syne font-600 text-sm text-text-1">₦{(order.total || 0).toLocaleString()}</td>
                      <td className="p-3 text-sm text-text-3">{order.branch}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewOrder(order)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="View Order">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => printOrder(order)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Print Invoice">
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[640px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="font-syne font-bold text-lg text-text-1">{viewOrder.order_id}</h2>
                <p className="text-xs text-text-4">{viewOrder.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => printOrder(viewOrder)} className="p-2 rounded-lg hover:bg-off-white text-text-4 hover:text-blue">
                  <Printer size={16} />
                </button>
                <button onClick={() => setViewOrder(null)} className="p-2 rounded-lg hover:bg-off-white text-text-4">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-sm font-medium text-text-1">{viewOrder.customer}</p>
                  <p className="text-xs text-text-3">{viewOrder.email}</p>
                  {viewOrder.phone && <p className="text-xs text-text-3">{viewOrder.phone}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider mb-1">Shipping</p>
                  {viewOrder.shipping_address ? (
                    <p className="text-xs text-text-2 flex items-start gap-1"><MapPin size={12} className="mt-0.5 shrink-0" />{viewOrder.shipping_address}</p>
                  ) : (
                    <p className="text-xs text-text-4">No shipping address</p>
                  )}
                  <p className="text-xs text-text-3 mt-1">Branch: {viewOrder.branch}</p>
                </div>
              </div>

              {/* Status + Payment */}
              <div className="flex items-center gap-3">
                {(() => {
                  const s = statusConfig[viewOrder.status] || statusConfig.pending;
                  const SI = s.icon;
                  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}><SI size={14} /> {s.label}</span>;
                })()}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${viewOrder.payment === "paid" ? "bg-green-50 text-success" : viewOrder.payment === "refunded" ? "bg-gray-100 text-text-4" : "bg-yellow-50 text-warning"}`}>
                  Payment: {viewOrder.payment}
                </span>
              </div>

              {/* Update Status */}
              {viewOrder.status !== "completed" && viewOrder.status !== "cancelled" && (
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {statusFlow.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(viewOrder.id, s)}
                        disabled={updatingStatus === viewOrder.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          viewOrder.status === s
                            ? "bg-blue text-white"
                            : "bg-off-white text-text-3 hover:bg-blue/10 hover:text-blue"
                        }`}
                      >
                        {statusConfig[s]?.label || s}
                      </button>
                    ))}
                    <button
                      onClick={() => updateOrderStatus(viewOrder.id, "cancelled")}
                      disabled={updatingStatus === viewOrder.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider mb-2">Order Items</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-off-white">
                        <th className="p-2.5 text-left text-[10px] font-semibold text-text-3 uppercase">Item</th>
                        <th className="p-2.5 text-center text-[10px] font-semibold text-text-3 uppercase">Qty</th>
                        <th className="p-2.5 text-right text-[10px] font-semibold text-text-3 uppercase">Price</th>
                        <th className="p-2.5 text-right text-[10px] font-semibold text-text-3 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewOrder.items || []).map((item, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-2.5 text-xs text-text-1 font-medium">{item.name}</td>
                          <td className="p-2.5 text-center text-xs text-text-2">{item.quantity}</td>
                          <td className="p-2.5 text-right text-xs text-text-2">₦{item.price.toLocaleString()}</td>
                          <td className="p-2.5 text-right text-xs font-semibold text-text-1">₦{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-3">
                  <div className="text-right">
                    <p className="text-xs text-text-4">Total</p>
                    <p className="font-syne font-bold text-xl text-text-1">₦{(viewOrder.total || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewOrder.notes && (
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-xs text-text-2 bg-off-white p-3 rounded-lg">{viewOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
