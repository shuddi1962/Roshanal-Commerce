"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  FileText,
  Building2,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "payments", label: "Payments" },
  { id: "invoices", label: "Invoices" },
  { id: "expenses", label: "Expenses" },
  { id: "accounting", label: "P&L / Accounting" },
  { id: "vat", label: "VAT Reports" },
];

const kpis = [
  { label: "Total Revenue", value: "₦18,450,000", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Net Profit", value: "₦5,850,000", change: "+8.3%", up: true, icon: TrendingUp },
  { label: "Total Expenses", value: "₦12,600,000", change: "+3.1%", up: false, icon: TrendingDown },
  { label: "Outstanding", value: "₦1,250,000", change: "-15.2%", up: true, icon: Receipt },
];

const recentPayments = [
  { id: "PAY-001", customer: "John Doe", order: "ORD-8842", amount: 85000, method: "Card (Paystack)", status: "completed", date: "2026-04-05" },
  { id: "PAY-002", customer: "Amara Obi", order: "ORD-8841", amount: 195000, method: "Bank Transfer", status: "completed", date: "2026-04-05" },
  { id: "PAY-003", customer: "Chidi Eze", order: "ORD-8840", amount: 45000, method: "Wallet", status: "completed", date: "2026-04-04" },
  { id: "PAY-004", customer: "Fatima Ali", order: "ORD-8839", amount: 320000, method: "Card (Stripe)", status: "pending", date: "2026-04-04" },
  { id: "PAY-005", customer: "Emeka Nwa", order: "ORD-8838", amount: 4500000, method: "Bank Transfer", status: "completed", date: "2026-04-03" },
  { id: "PAY-006", customer: "Kemi Bayo", order: "ORD-8837", amount: 28500, method: "USSD", status: "failed", date: "2026-04-03" },
];

const invoices = [
  { id: "INV-2026-001", customer: "TechStar Ltd", amount: 2500000, status: "paid", due: "2026-04-01", issued: "2026-03-15" },
  { id: "INV-2026-002", customer: "Niger Delta Oil", amount: 8500000, status: "overdue", due: "2026-03-30", issued: "2026-03-10" },
  { id: "INV-2026-003", customer: "Apex Holdings", amount: 1200000, status: "pending", due: "2026-04-15", issued: "2026-04-01" },
  { id: "INV-2026-004", customer: "Port Security", amount: 650000, status: "paid", due: "2026-03-25", issued: "2026-03-05" },
];

const expenses = [
  { id: "1", category: "Shipping & Logistics", amount: 850000, date: "2026-04-03", vendor: "GIG Logistics" },
  { id: "2", category: "Marketing", amount: 250000, date: "2026-04-01", vendor: "Google Ads" },
  { id: "3", category: "Salaries", amount: 2400000, date: "2026-04-01", vendor: "Staff Payroll" },
  { id: "4", category: "Inventory Purchase", amount: 5600000, date: "2026-03-28", vendor: "Hikvision Direct" },
  { id: "5", category: "Rent", amount: 450000, date: "2026-03-25", vendor: "Property Management" },
  { id: "6", category: "Utilities", amount: 180000, date: "2026-03-25", vendor: "PHED / Internet" },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-text-1">Finance & Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar size={14} /> Apr 2026
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-blue text-white" : "bg-white text-text-3 border border-border hover:bg-off-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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

      {/* Revenue Chart Placeholder */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4">Revenue vs Expenses vs Profit</h3>
            <div className="h-[300px] bg-off-white rounded-lg flex items-center justify-center">
              <p className="text-text-4 text-sm">Recharts Grouped Bar Chart</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4">Payment Methods</h3>
            <div className="h-[300px] bg-off-white rounded-lg flex items-center justify-center">
              <p className="text-text-4 text-sm">Recharts Pie Chart</p>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {(activeTab === "overview" || activeTab === "payments") && (
        <div className="bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-text-1 flex items-center gap-2">
              <CreditCard size={18} /> Recent Payments
            </h3>
            <input placeholder="Search payments..." className="h-9 px-3 rounded-lg border border-border text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-blue/20" />
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
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-off-white transition-colors">
                    <td className="px-5 py-3 font-mono text-xs">{p.id}</td>
                    <td className="px-5 py-3 font-medium text-text-1">{p.customer}</td>
                    <td className="px-5 py-3 text-text-3">{p.order}</td>
                    <td className="px-5 py-3 text-text-3">{p.method}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-1">₦{p.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.status === "completed" ? "bg-green-50 text-green-700" :
                        p.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                        "bg-red-50 text-red"
                      }`}>{p.status}</span>
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
            <h3 className="font-semibold text-text-1 flex items-center gap-2">
              <FileText size={18} /> Invoices
            </h3>
            <Button size="sm" className="gap-1.5">
              <FileText size={14} /> Create Invoice
            </Button>
          </div>
          <div className="divide-y divide-border">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-4 hover:bg-off-white transition-colors">
                <div>
                  <p className="text-sm font-semibold text-text-1">{inv.id}</p>
                  <p className="text-xs text-text-4">{inv.customer} · Issued {inv.issued}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-text-1">₦{inv.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    inv.status === "paid" ? "bg-green-50 text-green-700" :
                    inv.status === "overdue" ? "bg-red-50 text-red" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>{inv.status}</span>
                  <span className="text-xs text-text-4">Due {inv.due}</span>
                  <Button variant="outline" size="sm">View</Button>
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
            <Button size="sm" className="gap-1.5">
              <Receipt size={14} /> Add Expense
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
                    <td className="px-5 py-3 text-right font-semibold text-red">-₦{e.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-text-4">{e.date}</td>
                    <td className="px-5 py-3 text-center">
                      <Button variant="outline" size="sm">Edit</Button>
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
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <PieChart size={18} /> Profit & Loss Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-sm text-text-3">Total Revenue</span>
                <span className="text-sm font-semibold text-green-600">₦18,450,000</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-sm text-text-3">Cost of Goods Sold</span>
                <span className="text-sm font-semibold text-red">-₦9,800,000</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-text-1">Gross Profit</span>
                <span className="text-sm font-bold text-text-1">₦8,650,000</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-sm text-text-3">Operating Expenses</span>
                <span className="text-sm font-semibold text-red">-₦2,800,000</span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 px-4 rounded-lg">
                <span className="text-sm font-bold text-green-700">Net Profit</span>
                <span className="text-sm font-bold text-green-700">₦5,850,000</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Building2 size={18} /> Accounting Integration
            </h3>
            <div className="space-y-3">
              {["QuickBooks", "Sage", "Xero"].map((app) => (
                <div key={app} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-1">{app}</p>
                    <p className="text-xs text-text-4">Auto-sync transactions</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-text-1">Custom Webhook</p>
                  <p className="text-xs text-text-4">Send data to your endpoint</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VAT Reports */}
      {activeTab === "vat" && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
            <Percent size={18} /> VAT Report — April 2026
          </h3>
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
          <p className="text-sm text-text-3">VAT Rate: 7.5% · Period: 1-30 April 2026</p>
          <Button variant="outline" className="mt-4 gap-1.5">
            <Download size={14} /> Download VAT Report (PDF)
          </Button>
        </div>
      )}
    </div>
  );
}
