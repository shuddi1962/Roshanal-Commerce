"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, Mail, ChevronDown, UserPlus, X, Edit, ToggleLeft, ToggleRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  total_spent: number;
  loyalty_tier: string;
  last_order: string;
  status: string;
  address?: string;
  notes?: string;
  created_at?: string;
}

const tierColors: Record<string, string> = {
  Bronze: "bg-amber-50 text-amber-700",
  Silver: "bg-gray-50 text-gray-600",
  Gold: "bg-yellow-50 text-yellow-700",
  Platinum: "bg-purple-50 text-purple-700",
};

const seedCustomers: Omit<Customer, "id">[] = [
  { name: "John Doe", email: "john@example.com", phone: "+234 801 234 5678", orders: 24, total_spent: 4250000, loyalty_tier: "Gold", last_order: "2026-04-02", status: "active", address: "12 Ada George Rd, Port Harcourt" },
  { name: "Amina Bello", email: "amina@example.com", phone: "+234 802 345 6789", orders: 12, total_spent: 1850000, loyalty_tier: "Silver", last_order: "2026-04-01", status: "active", address: "5 Victoria Island, Lagos" },
  { name: "Chidi Okafor", email: "chidi@example.com", phone: "+234 803 456 7890", orders: 45, total_spent: 12500000, loyalty_tier: "Platinum", last_order: "2026-03-30", status: "active", address: "Marine Base, Yenagoa" },
  { name: "Fatima Hassan", email: "fatima@example.com", phone: "+234 804 567 8901", orders: 3, total_spent: 285000, loyalty_tier: "Bronze", last_order: "2026-03-28", status: "active" },
  { name: "Emeka Eze", email: "emeka@example.com", phone: "+234 805 678 9012", orders: 8, total_spent: 920000, loyalty_tier: "Silver", last_order: "2026-03-25", status: "active" },
  { name: "Grace Nwosu", email: "grace@example.com", phone: "+234 806 789 0123", orders: 1, total_spent: 72500, loyalty_tier: "Bronze", last_order: "2026-03-20", status: "inactive" },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", loyalty_tier: "Bronze", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await insforge.database.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setCustomers(data);
      } else {
        for (const c of seedCustomers) {
          await insforge.database.from("customers").insert(c);
        }
        const { data: seeded } = await insforge.database.from("customers").select("*").order("created_at", { ascending: false });
        if (seeded) setCustomers(seeded);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
      setCustomers(seedCustomers.map((c, i) => ({ ...c, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  const saveCustomer = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      if (editCustomer) {
        const { error } = await insforge.database.from("customers").update({
          name: form.name, email: form.email, phone: form.phone, address: form.address,
          loyalty_tier: form.loyalty_tier, notes: form.notes,
        }).eq("id", editCustomer.id);
        if (error) throw error;
        setCustomers((prev) => prev.map((c) => c.id === editCustomer.id ? { ...c, ...form } : c));
      } else {
        const { data, error } = await insforge.database.from("customers").insert({
          name: form.name, email: form.email, phone: form.phone, address: form.address,
          loyalty_tier: form.loyalty_tier, notes: form.notes, orders: 0, total_spent: 0,
          last_order: null, status: "active",
        }).select();
        if (error) throw error;
        if (data) setCustomers((prev) => [data[0], ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save customer:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleCustomerStatus = async (customer: Customer) => {
    const newStatus = customer.status === "active" ? "inactive" : "active";
    try {
      await insforge.database.from("customers").update({ status: newStatus }).eq("id", customer.id);
      setCustomers((prev) => prev.map((c) => c.id === customer.id ? { ...c, status: newStatus } : c));
      if (viewCustomer?.id === customer.id) setViewCustomer({ ...customer, status: newStatus });
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const openEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setForm({ name: customer.name, email: customer.email, phone: customer.phone || "", address: customer.address || "", loyalty_tier: customer.loyalty_tier, notes: customer.notes || "" });
    setShowAddModal(true);
  };

  const openAdd = () => {
    setEditCustomer(null);
    setForm({ name: "", email: "", phone: "", address: "", loyalty_tier: "Bronze", notes: "" });
    setShowAddModal(true);
  };

  const closeModal = () => { setShowAddModal(false); setEditCustomer(null); };

  const exportCustomers = () => {
    const headers = ["Name", "Email", "Phone", "Tier", "Orders", "Total Spent", "Last Order", "Status"];
    const rows = filtered.map((c) => [c.name, c.email, c.phone, c.loyalty_tier, c.orders, c.total_spent, c.last_order, c.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const filtered = customers.filter((c) => {
    if (searchQuery && !c.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !c.email?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (tierFilter !== "all" && c.loyalty_tier !== tierFilter) return false;
    return true;
  });

  const totalRevenue = customers.reduce((a, b) => a + (b.total_spent || 0), 0);
  const activeCount = customers.filter((c) => c.status === "active").length;
  const avgOrders = customers.length > 0 ? Math.round(customers.reduce((a, b) => a + (b.orders || 0), 0) / customers.length) : 0;

  return (
    <AdminShell title="Customers" subtitle="Manage customer profiles">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-700 text-2xl text-text-1">Customers</h1>
            <p className="text-sm text-text-3 mt-1">{customers.length} registered customers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={exportCustomers}><Download className="w-3 h-3 mr-1" /> Export</Button>
            <Button variant="default" size="sm" onClick={openAdd}><UserPlus className="w-3 h-3 mr-1" /> Add Customer</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-blue">{customers.length}</p>
            <p className="text-xs text-text-3 mt-1">Total Customers</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-success">{activeCount}</p>
            <p className="text-xs text-text-3 mt-1">Active</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-text-1">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-text-3 mt-1">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="font-syne font-700 text-2xl text-warning">{avgOrders}</p>
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
          {loading ? (
            <div className="p-12 text-center text-text-4 text-sm">Loading customers...</div>
          ) : (
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
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-text-4 text-sm">No customers found</td></tr>
                ) : filtered.map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-off-white/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-syne font-700 text-xs">
                          {customer.name?.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-1">{customer.name}</p>
                          <p className="text-xs text-text-4">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[customer.loyalty_tier] || tierColors.Bronze}`}>
                        {customer.loyalty_tier}
                      </span>
                    </td>
                    <td className="p-3 text-center text-sm text-text-2">{customer.orders}</td>
                    <td className="p-3 text-right font-syne font-600 text-sm text-text-1">₦{(customer.total_spent || 0).toLocaleString()}</td>
                    <td className="p-3 text-sm text-text-3">{customer.last_order}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => toggleCustomerStatus(customer)} className="inline-flex items-center gap-1">
                        {customer.status === "active" ? (
                          <ToggleRight size={20} className="text-success" />
                        ) : (
                          <ToggleLeft size={20} className="text-text-4" />
                        )}
                        <span className={`text-xs font-medium ${customer.status === "active" ? "text-success" : "text-text-4"}`}>{customer.status}</span>
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewCustomer(customer)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="View"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openEdit(customer)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => sendEmail(customer.email)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Email"><Mail className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Customer Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewCustomer(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-syne font-700 text-sm">
                  {viewCustomer.name?.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h2 className="font-syne font-bold text-lg text-text-1">{viewCustomer.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[viewCustomer.loyalty_tier] || tierColors.Bronze}`}>{viewCustomer.loyalty_tier}</span>
                </div>
              </div>
              <button onClick={() => setViewCustomer(null)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Email</p>
                  <p className="text-sm text-text-1 mt-0.5">{viewCustomer.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-text-1 mt-0.5">{viewCustomer.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Total Orders</p>
                  <p className="text-sm font-semibold text-text-1 mt-0.5">{viewCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Total Spent</p>
                  <p className="text-sm font-semibold text-text-1 mt-0.5">₦{(viewCustomer.total_spent || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Last Order</p>
                  <p className="text-sm text-text-1 mt-0.5">{viewCustomer.last_order || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Status</p>
                  <span className={`text-xs font-semibold ${viewCustomer.status === "active" ? "text-success" : "text-text-4"}`}>{viewCustomer.status}</span>
                </div>
              </div>
              {viewCustomer.address && (
                <div>
                  <p className="text-[10px] text-text-4 font-semibold uppercase tracking-wider">Address</p>
                  <p className="text-sm text-text-1 mt-0.5">{viewCustomer.address}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => sendEmail(viewCustomer.email)}>
                  <Mail size={14} className="mr-1" /> Send Email
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { if (viewCustomer.phone) window.open(`tel:${viewCustomer.phone}`); }}>
                  <Phone size={14} className="mr-1" /> Call
                </Button>
                <Button size="sm" className="flex-1" onClick={() => { setViewCustomer(null); openEdit(viewCustomer); }}>
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg text-text-1">{editCustomer ? "Edit Customer" : "Add Customer"}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="+234 801 234 5678" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="12 Ada George Rd, PHC" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Loyalty Tier</label>
                <select value={form.loyalty_tier} onChange={(e) => setForm({ ...form, loyalty_tier: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-blue">
                  <option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-blue resize-none" placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
              <Button className="flex-1" onClick={saveCustomer} disabled={saving || !form.name || !form.email}>
                {saving ? "Saving..." : editCustomer ? "Update Customer" : "Add Customer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
