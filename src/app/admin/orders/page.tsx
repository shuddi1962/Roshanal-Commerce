"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Package,
  ChevronDown,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";

const demoOrders = [
  { id: "RSH-2026-001234", customer: "John Doe", email: "john@example.com", date: "Apr 2, 2026", status: "in-transit", payment: "paid", items: 3, total: 340000, branch: "Port Harcourt" },
  { id: "RSH-2026-001233", customer: "Amina Bello", email: "amina@example.com", date: "Apr 2, 2026", status: "processing", payment: "paid", items: 1, total: 195000, branch: "Lagos" },
  { id: "RSH-2026-001232", customer: "Chidi Okafor", email: "chidi@example.com", date: "Apr 1, 2026", status: "pending", payment: "pending", items: 2, total: 89000, branch: "Port Harcourt" },
  { id: "RSH-2026-001231", customer: "Fatima Hassan", email: "fatima@example.com", date: "Apr 1, 2026", status: "delivered", payment: "paid", items: 5, total: 4500000, branch: "Bayelsa" },
  { id: "RSH-2026-001230", customer: "Emeka Eze", email: "emeka@example.com", date: "Mar 31, 2026", status: "completed", payment: "paid", items: 1, total: 72500, branch: "Lagos" },
  { id: "RSH-2026-001229", customer: "Grace Nwosu", email: "grace@example.com", date: "Mar 31, 2026", status: "cancelled", payment: "refunded", items: 2, total: 160000, branch: "Port Harcourt" },
  { id: "RSH-2026-001228", customer: "Tunde Bakare", email: "tunde@example.com", date: "Mar 30, 2026", status: "packed", payment: "paid", items: 4, total: 285000, branch: "Lagos" },
  { id: "RSH-2026-001227", customer: "Blessing Idris", email: "blessing@example.com", date: "Mar 30, 2026", status: "confirmed", payment: "paid", items: 1, total: 320000, branch: "Port Harcourt" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-yellow-50 text-warning", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-50 text-blue", icon: Package },
  confirmed: { label: "Confirmed", color: "bg-blue-50 text-blue", icon: CheckCircle2 },
  packed: { label: "Packed", color: "bg-indigo-50 text-indigo-600", icon: Package },
  dispatched: { label: "Dispatched", color: "bg-blue-50 text-blue", icon: Truck },
  "in-transit": { label: "In Transit", color: "bg-blue-50 text-blue", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-50 text-success", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-green-50 text-success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red", icon: XCircle },
  "on-hold": { label: "On Hold", color: "bg-yellow-50 text-warning", icon: AlertCircle },
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = demoOrders.filter((o) => {
    if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = demoOrders.filter((o) => o.payment === "paid").reduce((a, b) => a + b.total, 0);

  return (
    <AdminShell title="Orders" subtitle="Manage customer orders">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-700 text-2xl text-text-1">Orders</h1>
          <p className="text-sm text-text-3 mt-1">{demoOrders.length} total orders</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-3 h-3 mr-1" /> Export Orders
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Orders", value: demoOrders.length, color: "text-blue" },
          { label: "Pending", value: demoOrders.filter((o) => o.status === "pending").length, color: "text-warning" },
          { label: "Processing", value: demoOrders.filter((o) => ["processing", "confirmed", "packed"].includes(o.status)).length, color: "text-blue" },
          { label: "Delivered", value: demoOrders.filter((o) => ["delivered", "completed"].includes(o.status)).length, color: "text-success" },
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
            {filtered.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <tr key={order.id} className="border-b border-border hover:bg-off-white/50">
                  <td className="p-3">
                    <span className="font-mono text-sm font-medium text-text-1">{order.id}</span>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-text-1">{order.customer}</p>
                    <p className="text-xs text-text-4">{order.email}</p>
                  </td>
                  <td className="p-3 text-sm text-text-3">{order.date}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3 h-3" /> {status.label}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${order.payment === "paid" ? "text-success" : order.payment === "refunded" ? "text-text-4" : "text-warning"}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-text-2">{order.items}</td>
                  <td className="p-3 text-right font-syne font-600 text-sm text-text-1">₦{order.total.toLocaleString()}</td>
                  <td className="p-3 text-sm text-text-3">{order.branch}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Printer className="w-3.5 h-3.5" /></button>
                    </div>
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
