"use client";

import { useState, useEffect } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt,
  PieChart, ArrowUpRight, ArrowDownRight, Download, Calendar,
  FileText, Building2, Percent, X, Plus, Edit, Trash2, Save, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

const financeTabs = [
  { id: "overview", label: "Overview" },
  { id: "payments", label: "Payments" },
  { id: "invoices", label: "Invoices" },
  { id: "expenses", label: "Expenses" },
  { id: "accounting", label: "P&L / Accounting" },
  { id: "vat", label: "VAT Reports" },
];

interface Invoice {
  id: string;
  invoice_id: string;
  customer: string;
  amount: number;
  status: string;
  due_date: string;
  issued_date: string;
  items?: { name: string; qty: number; price: number }[];
}

interface Expense {
  id: string;
  category: string;
  vendor: string;
  amount: number;
  date: string;
  notes?: string;
}

const kpis = [
  { label: "Total Revenue", value: "₦18,450,000", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Net Profit", value: "₦5,850,000", change: "+8.3%", up: true, icon: TrendingUp },
  { label: "Total Expenses", value: "₦12,600,000", change: "+3.1%", up: false, icon: TrendingDown },
  { label: "Outstanding", value: "₦1,250,000", change: "-15.2%", up: true, icon: Receipt },
];

const seedPayments = [
  { payment_id: "PAY-001", customer: "John Doe", order_ref: "ORD-8842", amount: 85000, method: "Card (Paystack)", status: "completed", date: "2026-04-05" },
  { payment_id: "PAY-002", customer: "Amara Obi", order_ref: "ORD-8841", amount: 195000, method: "Bank Transfer", status: "completed", date: "2026-04-05" },
  { payment_id: "PAY-003", customer: "Chidi Eze", order_ref: "ORD-8840", amount: 45000, method: "Wallet", status: "completed", date: "2026-04-04" },
  { payment_id: "PAY-004", customer: "Fatima Ali", order_ref: "ORD-8839", amount: 320000, method: "Card (Stripe)", status: "pending", date: "2026-04-04" },
  { payment_id: "PAY-005", customer: "Emeka Nwa", order_ref: "ORD-8838", amount: 4500000, method: "Bank Transfer", status: "completed", date: "2026-04-03" },
  { payment_id: "PAY-006", customer: "Kemi Bayo", order_ref: "ORD-8837", amount: 28500, method: "USSD", status: "failed", date: "2026-04-03" },
];

const seedInvoices: Omit<Invoice, "id">[] = [
  { invoice_id: "INV-2026-001", customer: "TechStar Ltd", amount: 2500000, status: "paid", due_date: "2026-04-01", issued_date: "2026-03-15" },
  { invoice_id: "INV-2026-002", customer: "Niger Delta Oil", amount: 8500000, status: "overdue", due_date: "2026-03-30", issued_date: "2026-03-10" },
  { invoice_id: "INV-2026-003", customer: "Apex Holdings", amount: 1200000, status: "pending", due_date: "2026-04-15", issued_date: "2026-04-01" },
  { invoice_id: "INV-2026-004", customer: "Port Security", amount: 650000, status: "paid", due_date: "2026-03-25", issued_date: "2026-03-05" },
];

const seedExpenses: Omit<Expense, "id">[] = [
  { category: "Shipping & Logistics", amount: 850000, date: "2026-04-03", vendor: "GIG Logistics" },
  { category: "Marketing", amount: 250000, date: "2026-04-01", vendor: "Google Ads" },
  { category: "Salaries", amount: 2400000, date: "2026-04-01", vendor: "Staff Payroll" },
  { category: "Inventory Purchase", amount: 5600000, date: "2026-03-28", vendor: "Hikvision Direct" },
  { category: "Rent", amount: 450000, date: "2026-03-25", vendor: "Property Management" },
  { category: "Utilities", amount: 180000, date: "2026-03-25", vendor: "PHED / Internet" },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [dateRange, setDateRange] = useState("2026-04");

  // Invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({ invoice_id: "", customer: "", amount: 0, status: "pending", due_date: "", issued_date: "" });

  // Expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({ category: "", vendor: "", amount: 0, date: "", notes: "" });

  // Accounting connect
  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>({});

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [invRes, expRes] = await Promise.all([
        insforge.database.from("invoices").select("*").order("issued_date", { ascending: false }),
        insforge.database.from("expenses").select("*").order("date", { ascending: false }),
      ]);

      if (invRes.data && invRes.data.length > 0) setInvoices(invRes.data);
      else {
        for (const i of seedInvoices) await insforge.database.from("invoices").insert(i);
        const { data } = await insforge.database.from("invoices").select("*");
        if (data) setInvoices(data);
      }

      if (expRes.data && expRes.data.length > 0) setExpenses(expRes.data);
      else {
        for (const e of seedExpenses) await insforge.database.from("expenses").insert(e);
        const { data } = await insforge.database.from("expenses").select("*");
        if (data) setExpenses(data);
      }

      setPayments(seedPayments);

      // Load connected apps from settings
      try {
        const { data: settingsData } = await insforge.database.from("settings").select("*").eq("key", "accounting_integrations");
        if (settingsData?.[0]?.value) setConnectedApps(settingsData[0].value);
      } catch {}
    } catch (err) {
      console.error("Finance load error:", err);
      setPayments(seedPayments);
      setInvoices(seedInvoices.map((i, idx) => ({ ...i, id: String(idx + 1) })));
      setExpenses(seedExpenses.map((e, idx) => ({ ...e, id: String(idx + 1) })));
    } finally {
      setLoading(false);
    }
  };

  // Invoice CRUD
  const saveInvoice = async () => {
    try {
      if (editInvoice) {
        await insforge.database.from("invoices").update(invoiceForm).eq("id", editInvoice.id);
        setInvoices((prev) => prev.map((i) => i.id === editInvoice.id ? { ...i, ...invoiceForm } : i));
      } else {
        const newId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
        const { data } = await insforge.database.from("invoices").insert({ ...invoiceForm, invoice_id: newId }).select();
        if (data) setInvoices((prev) => [data[0], ...prev]);
      }
      setShowInvoiceModal(false);
      setEditInvoice(null);
    } catch (err) { console.error(err); }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await insforge.database.from("invoices").delete().eq("id", id);
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } catch (err) { console.error(err); }
  };

  const printInvoice = (inv: Invoice) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>${inv.invoice_id}</title><style>body{font-family:Arial;padding:40px;max-width:700px;margin:0 auto}h1{font-size:22px}.meta{color:#666;font-size:13px}.total{font-size:20px;font-weight:bold;text-align:right;margin-top:20px}@media print{body{padding:20px}}</style></head><body>
      <h1>Roshanal Global</h1><p class="meta">Invoice</p>
      <hr/><h2>${inv.invoice_id}</h2>
      <p><strong>Customer:</strong> ${inv.customer}</p>
      <p><strong>Issued:</strong> ${inv.issued_date} | <strong>Due:</strong> ${inv.due_date}</p>
      <p><strong>Status:</strong> ${inv.status.toUpperCase()}</p>
      <p class="total">Total: ₦${(inv.amount || 0).toLocaleString()}</p>
      <script>window.print()</script></body></html>`);
    win.document.close();
  };

  // Expense CRUD
  const saveExpense = async () => {
    try {
      if (editExpense) {
        await insforge.database.from("expenses").update(expenseForm).eq("id", editExpense.id);
        setExpenses((prev) => prev.map((e) => e.id === editExpense.id ? { ...e, ...expenseForm } : e));
      } else {
        const { data } = await insforge.database.from("expenses").insert(expenseForm).select();
        if (data) setExpenses((prev) => [data[0], ...prev]);
      }
      setShowExpenseModal(false);
      setEditExpense(null);
    } catch (err) { console.error(err); }
  };

  const deleteExpense = async (id: string) => {
    try {
      await insforge.database.from("expenses").delete().eq("id", id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) { console.error(err); }
  };

  // Accounting integrations
  const toggleConnect = async (app: string) => {
    const updated = { ...connectedApps, [app]: !connectedApps[app] };
    setConnectedApps(updated);
    try {
      await insforge.database.from("settings").upsert({ key: "accounting_integrations", value: updated });
    } catch (err) { console.error(err); }
  };

  const exportCSV = (type: string) => {
    let csv = "";
    if (type === "payments") {
      csv = "Payment ID,Customer,Order,Method,Amount,Status,Date\n" + payments.map((p) => `${p.payment_id},${p.customer},${p.order_ref},${p.method},${p.amount},${p.status},${p.date}`).join("\n");
    } else if (type === "invoices") {
      csv = "Invoice ID,Customer,Amount,Status,Due,Issued\n" + invoices.map((i) => `${i.invoice_id},${i.customer},${i.amount},${i.status},${i.due_date},${i.issued_date}`).join("\n");
    } else if (type === "expenses") {
      csv = "Category,Vendor,Amount,Date\n" + expenses.map((e) => `${e.category},${e.vendor},${e.amount},${e.date}`).join("\n");
    } else {
      csv = "Payment ID,Customer,Amount,Status,Date\n" + payments.map((p) => `${p.payment_id},${p.customer},${p.amount},${p.status},${p.date}`).join("\n");
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${type}-${dateRange}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPayments = payments.filter((p) =>
    !paymentSearch || p.customer.toLowerCase().includes(paymentSearch.toLowerCase()) || p.payment_id.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <AdminShell title="Finance & Payments" subtitle="Revenue, expenses, invoices, and reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl text-text-1">Finance & Payments</h1>
          <div className="flex gap-2">
            <input type="month" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportCSV(activeTab === "overview" ? "payments" : activeTab)}>
              <Download size={14} /> Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {financeTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-blue text-white" : "bg-white text-text-3 border border-border hover:bg-off-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-4 text-sm">Loading financial data...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="bg-white rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Icon size={18} className="text-blue" />
                      </div>
                      <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? "text-green-600" : "text-red"}`}>
                        {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-text-1">{kpi.value}</p>
                    <p className="text-xs text-text-4 mt-0.5">{kpi.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4">Revenue vs Expenses vs Profit</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Revenue", value: 18450000, color: "bg-blue" },
                      { label: "Expenses", value: 12600000, color: "bg-red" },
                      { label: "Net Profit", value: 5850000, color: "bg-green-500" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-3">{bar.label}</span>
                          <span className="font-semibold">₦{(bar.value / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="h-6 bg-off-white rounded-full overflow-hidden">
                          <div className={`h-full ${bar.color} rounded-full transition-all`} style={{ width: `${(bar.value / 18450000) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    {[
                      { method: "Card (Paystack)", pct: 42, color: "bg-blue" },
                      { method: "Bank Transfer", pct: 35, color: "bg-green-500" },
                      { method: "Wallet", pct: 12, color: "bg-purple-500" },
                      { method: "USSD", pct: 8, color: "bg-yellow-500" },
                      { method: "Crypto", pct: 3, color: "bg-orange-500" },
                    ].map((m) => (
                      <div key={m.method} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${m.color}`} />
                        <span className="text-xs text-text-2 flex-1">{m.method}</span>
                        <span className="text-xs font-semibold">{m.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {(activeTab === "overview" || activeTab === "payments") && (
              <div className="bg-white rounded-xl border border-border">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="font-semibold text-text-1 flex items-center gap-2"><CreditCard size={18} /> Recent Payments</h3>
                  <input placeholder="Search payments..." value={paymentSearch} onChange={(e) => setPaymentSearch(e.target.value)} className="h-9 px-3 rounded-lg border border-border text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-blue/20" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-off-white">
                      <tr>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Payment ID</th>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Customer</th>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Order</th>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Method</th>
                        <th className="text-right px-5 py-3 font-medium text-text-4">Amount</th>
                        <th className="text-center px-5 py-3 font-medium text-text-4">Status</th>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredPayments.map((p) => (
                        <tr key={p.payment_id} className="hover:bg-off-white transition-colors">
                          <td className="px-5 py-3 font-mono text-xs">{p.payment_id}</td>
                          <td className="px-5 py-3 font-medium text-text-1">{p.customer}</td>
                          <td className="px-5 py-3 text-text-3">{p.order_ref}</td>
                          <td className="px-5 py-3 text-text-3">{p.method}</td>
                          <td className="px-5 py-3 text-right font-semibold text-text-1">₦{p.amount.toLocaleString()}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-green-50 text-green-700" : p.status === "pending" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red"}`}>{p.status}</span>
                          </td>
                          <td className="px-5 py-3 text-text-4">{p.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div className="bg-white rounded-xl border border-border">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="font-semibold text-text-1 flex items-center gap-2"><FileText size={18} /> Invoices</h3>
                  <Button size="sm" className="gap-1.5" onClick={() => { setEditInvoice(null); setInvoiceForm({ invoice_id: "", customer: "", amount: 0, status: "pending", due_date: "", issued_date: new Date().toISOString().split("T")[0] }); setShowInvoiceModal(true); }}>
                    <Plus size={14} /> Create Invoice
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between px-5 py-4 hover:bg-off-white transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-text-1">{inv.invoice_id}</p>
                        <p className="text-xs text-text-4">{inv.customer} · Issued {inv.issued_date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-text-1">₦{(inv.amount || 0).toLocaleString()}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${inv.status === "paid" ? "bg-green-50 text-green-700" : inv.status === "overdue" ? "bg-red-50 text-red" : "bg-yellow-50 text-yellow-700"}`}>{inv.status}</span>
                        <span className="text-xs text-text-4">Due {inv.due_date}</span>
                        <button onClick={() => setViewInvoice(inv)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="View"><Eye size={14} /></button>
                        <button onClick={() => printInvoice(inv)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Print"><Download size={14} /></button>
                        <button onClick={() => { setEditInvoice(inv); setInvoiceForm({ invoice_id: inv.invoice_id, customer: inv.customer, amount: inv.amount, status: inv.status, due_date: inv.due_date, issued_date: inv.issued_date }); setShowInvoiceModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Edit"><Edit size={14} /></button>
                        <button onClick={() => deleteInvoice(inv.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === "expenses" && (
              <div className="bg-white rounded-xl border border-border">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="font-semibold text-text-1">Expense Records</h3>
                  <Button size="sm" className="gap-1.5" onClick={() => { setEditExpense(null); setExpenseForm({ category: "", vendor: "", amount: 0, date: new Date().toISOString().split("T")[0], notes: "" }); setShowExpenseModal(true); }}>
                    <Plus size={14} /> Add Expense
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-off-white">
                      <tr>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Category</th>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Vendor</th>
                        <th className="text-right px-5 py-3 font-medium text-text-4">Amount</th>
                        <th className="text-left px-5 py-3 font-medium text-text-4">Date</th>
                        <th className="text-center px-5 py-3 font-medium text-text-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {expenses.map((e) => (
                        <tr key={e.id} className="hover:bg-off-white transition-colors">
                          <td className="px-5 py-3 font-medium text-text-1">{e.category}</td>
                          <td className="px-5 py-3 text-text-3">{e.vendor}</td>
                          <td className="px-5 py-3 text-right font-semibold text-red">-₦{(e.amount || 0).toLocaleString()}</td>
                          <td className="px-5 py-3 text-text-4">{e.date}</td>
                          <td className="px-5 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => { setEditExpense(e); setExpenseForm({ category: e.category, vendor: e.vendor, amount: e.amount, date: e.date, notes: e.notes || "" }); setShowExpenseModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Edit size={14} /></button>
                              <button onClick={() => deleteExpense(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Accounting P&L */}
            {activeTab === "accounting" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2"><PieChart size={18} /> Profit & Loss Summary</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Total Revenue", value: "₦18,450,000", color: "text-green-600" },
                      { label: "Cost of Goods Sold", value: "-₦9,800,000", color: "text-red" },
                      { label: "Gross Profit", value: "₦8,650,000", color: "text-text-1", bold: true },
                      { label: "Operating Expenses", value: "-₦2,800,000", color: "text-red" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between py-3 border-b border-border">
                        <span className={`text-sm ${row.bold ? "font-medium text-text-1" : "text-text-3"}`}>{row.label}</span>
                        <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 bg-green-50 px-4 rounded-lg">
                      <span className="text-sm font-bold text-green-700">Net Profit</span>
                      <span className="text-sm font-bold text-green-700">₦5,850,000</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2"><Building2 size={18} /> Accounting Integration</h3>
                  <div className="space-y-3">
                    {["QuickBooks", "Sage", "Xero"].map((app) => (
                      <div key={app} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium text-text-1">{app}</p>
                          <p className="text-xs text-text-4">{connectedApps[app] ? "Connected — syncing transactions" : "Auto-sync transactions"}</p>
                        </div>
                        <Button variant={connectedApps[app] ? "default" : "outline"} size="sm" onClick={() => toggleConnect(app)}>
                          {connectedApps[app] ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-text-1">Custom Webhook</p>
                        <p className="text-xs text-text-4">{connectedApps["webhook"] ? "Active" : "Send data to your endpoint"}</p>
                      </div>
                      <Button variant={connectedApps["webhook"] ? "default" : "outline"} size="sm" onClick={() => toggleConnect("webhook")}>
                        {connectedApps["webhook"] ? "Disable" : "Configure"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VAT Reports */}
            {activeTab === "vat" && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2"><Percent size={18} /> VAT Report — {dateRange}</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-text-4">VAT Collected</p>
                    <p className="text-xl font-bold text-blue mt-1">₦1,383,750</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-text-4">VAT Paid (Inputs)</p>
                    <p className="text-xl font-bold text-red mt-1">₦735,000</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-text-4">Net VAT Payable</p>
                    <p className="text-xl font-bold text-green-600 mt-1">₦648,750</p>
                  </div>
                </div>
                <p className="text-sm text-text-3">VAT Rate: 7.5% · Period: {dateRange}</p>
                <Button variant="outline" className="mt-4 gap-1.5" onClick={() => exportCSV("vat")}>
                  <Download size={14} /> Download VAT Report (CSV)
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invoice Create/Edit Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowInvoiceModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editInvoice ? "Edit Invoice" : "Create Invoice"}</h2>
              <button onClick={() => setShowInvoiceModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Customer Name</label>
                <input value={invoiceForm.customer} onChange={(e) => setInvoiceForm({ ...invoiceForm, customer: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Amount (₦)</label>
                  <input type="number" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Status</label>
                  <select value={invoiceForm.status} onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    <option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Issue Date</label>
                  <input type="date" value={invoiceForm.issued_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, issued_date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Due Date</label>
                  <input type="date" value={invoiceForm.due_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowInvoiceModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveInvoice} disabled={!invoiceForm.customer || !invoiceForm.amount}>
                <Save size={14} className="mr-1" /> {editInvoice ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewInvoice(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{viewInvoice.invoice_id}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => printInvoice(viewInvoice)} className="p-2 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Download size={16} /></button>
                <button onClick={() => setViewInvoice(null)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Customer</p><p className="text-sm font-medium mt-0.5">{viewInvoice.customer}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Amount</p><p className="text-sm font-bold mt-0.5">₦{(viewInvoice.amount || 0).toLocaleString()}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Issued</p><p className="text-sm mt-0.5">{viewInvoice.issued_date}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Due</p><p className="text-sm mt-0.5">{viewInvoice.due_date}</p></div>
              </div>
              <div>
                <p className="text-[10px] text-text-4 uppercase font-semibold">Status</p>
                <span className={`text-xs font-semibold ${viewInvoice.status === "paid" ? "text-success" : viewInvoice.status === "overdue" ? "text-red" : "text-warning"}`}>{viewInvoice.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Create/Edit Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowExpenseModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editExpense ? "Edit Expense" : "Add Expense"}</h2>
              <button onClick={() => setShowExpenseModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Category</label>
                <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                  <option value="">Select...</option>
                  {["Shipping & Logistics", "Marketing", "Salaries", "Inventory Purchase", "Rent", "Utilities", "Software", "Maintenance", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Vendor / Payee</label>
                <input value={expenseForm.vendor} onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Amount (₦)</label>
                  <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Date</label>
                  <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Notes</label>
                <textarea value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:border-blue" placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveExpense} disabled={!expenseForm.category || !expenseForm.amount}>
                <Save size={14} className="mr-1" /> {editExpense ? "Update" : "Add Expense"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
