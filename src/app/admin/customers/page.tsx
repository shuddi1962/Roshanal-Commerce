"use client";

import { useState } from "react";
import { Search, Download, Eye, Mail, ChevronDown, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";

const demoCustomers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+234 801 234 5678", orders: 24, totalSpent: 4250000, loyaltyTier: "Gold", lastOrder: "Apr 2, 2026", status: "active" },
  { id: "2", name: "Amina Bello", email: "amina@example.com", phone: "+234 802 345 6789", orders: 12, totalSpent: 1850000, loyaltyTier: "Silver", lastOrder: "Apr 1, 2026", status: "active" },
  { id: "3", name: "Chidi Okafor", email: "chidi@example.com", phone: "+234 803 456 7890", orders: 45, totalSpent: 12500000, loyaltyTier: "Platinum", lastOrder: "Mar 30, 2026", status: "active" },
  { id: "4", name: "Fatima Hassan", email: "fatima@example.com", phone: "+234 804 567 8901", orders: 3, totalSpent: 285000, loyaltyTier: "Bronze", lastOrder: "Mar 28, 2026", status: "active" },
  { id: "5", name: "Emeka Eze", email: "emeka@example.com", phone: "+234 805 678 9012", orders: 8, totalSpent: 920000, loyaltyTier: "Silver", lastOrder: "Mar 25, 2026", status: "active" },
  { id: "6", name: "Grace Nwosu", email: "grace@example.com", phone: "+234 806 789 0123", orders: 1, totalSpent: 72500, loyaltyTier: "Bronze", lastOrder: "Mar 20, 2026", status: "inactive" },
];

const tierColors: Record<string, string> = {
  Bronze: "bg-amber-50 text-amber-700",
  Silver: "bg-gray-50 text-gray-600",
  Gold: "bg-yellow-50 text-yellow-700",
  Platinum: "bg-purple-50 text-purple-700",
};

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const filtered = demoCustomers.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (tierFilter !== "all" && c.loyaltyTier !== tierFilter) return false;
    return true;
  });

  return (
    <AdminShell title="Customers" subtitle="Manage customer profiles">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-700 text-2xl text-text-1">Customers</h1>
          <p className="text-sm text-text-3 mt-1">{demoCustomers.length} registered customers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Export</Button>
          <Button variant="default" size="sm"><UserPlus className="w-3 h-3 mr-1" /> Add Customer</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-syne font-700 text-2xl text-blue">{demoCustomers.length}</p>
          <p className="text-xs text-text-3 mt-1">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-syne font-700 text-2xl text-success">{demoCustomers.filter((c) => c.status === "active").length}</p>
          <p className="text-xs text-text-3 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-syne font-700 text-2xl text-text-1">₦{(demoCustomers.reduce((a, b) => a + b.totalSpent, 0) / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-text-3 mt-1">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-syne font-700 text-2xl text-warning">{Math.round(demoCustomers.reduce((a, b) => a + b.orders, 0) / demoCustomers.length)}</p>
          <p className="text-xs text-text-3 mt-1">Avg. Orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
          </div>
          <div className="relative">
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-4 py-2 border border-border rounded-lg text-sm bg-white appearance-none pr-8">
              <option value="all">All Tiers</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
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
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Customer</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Tier</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Orders</th>
              <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Total Spent</th>
              <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Last Order</th>
              <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
              <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-border hover:bg-off-white/50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-syne font-700 text-xs">
                      {customer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-1">{customer.name}</p>
                      <p className="text-xs text-text-4">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[customer.loyaltyTier]}`}>
                    {customer.loyaltyTier}
                  </span>
                </td>
                <td className="p-3 text-center text-sm text-text-2">{customer.orders}</td>
                <td className="p-3 text-right font-syne font-600 text-sm text-text-1">₦{customer.totalSpent.toLocaleString()}</td>
                <td className="p-3 text-sm text-text-3">{customer.lastOrder}</td>
                <td className="p-3 text-center">
                  <span className={`text-xs font-medium ${customer.status === "active" ? "text-success" : "text-text-4"}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Mail className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminShell>
  );
}
