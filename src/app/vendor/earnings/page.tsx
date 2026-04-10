"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Wallet, ArrowDownToLine, Calendar } from "lucide-react";

const demoPayouts = [
  { id: "PAY-001", amount: 245000, status: "completed", date: "2024-03-01", method: "Bank Transfer" },
  { id: "PAY-002", amount: 189000, status: "completed", date: "2024-02-15", method: "Bank Transfer" },
  { id: "PAY-003", amount: 312000, status: "processing", date: "2024-03-10", method: "Bank Transfer" },
  { id: "PAY-004", amount: 156000, status: "completed", date: "2024-02-01", method: "Bank Transfer" },
  { id: "PAY-005", amount: 478000, status: "pending", date: "2024-03-15", method: "Bank Transfer" },
];

const monthlyData = [
  { month: "Oct", revenue: 420000, commission: 50400, payout: 369600 },
  { month: "Nov", revenue: 580000, commission: 69600, payout: 510400 },
  { month: "Dec", revenue: 890000, commission: 106800, payout: 783200 },
  { month: "Jan", revenue: 650000, commission: 78000, payout: 572000 },
  { month: "Feb", revenue: 720000, commission: 86400, payout: 633600 },
  { month: "Mar", revenue: 810000, commission: 97200, payout: 712800 },
];

export default function VendorEarningsPage() {
  const [period] = useState("6months");
  const totalRevenue = monthlyData.reduce((a, m) => a + m.revenue, 0);
  const totalPayout = monthlyData.reduce((a, m) => a + m.payout, 0);
  const pendingPayout = demoPayouts.filter((p) => p.status !== "completed").reduce((a, p) => a + p.amount, 0);
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Earnings</h1><p className="text-sm text-gray-500">Revenue and payout overview</p></div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={() => alert("Payout request submitted! You will receive it within 3-5 business days.")} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><ArrowDownToLine size={16} /> Request Payout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `₦${(totalRevenue / 1e6).toFixed(1)}M`, icon: TrendingUp, color: "text-green-600" },
            { label: "Total Payouts", value: `₦${(totalPayout / 1e6).toFixed(1)}M`, icon: Wallet, color: "text-blue-600" },
            { label: "Pending Payout", value: `₦${pendingPayout.toLocaleString()}`, icon: DollarSign, color: "text-yellow-600" },
            { label: "Commission Rate", value: "12%", icon: Calendar, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-sm mb-4">Revenue Trend ({period})</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400">₦{(m.revenue / 1000).toFixed(0)}k</span>
                <div className="w-full bg-purple-500 rounded-t-lg" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }} />
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-sm">Payout History</h3></div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {["ID", "Amount", "Status", "Date", "Method"].map((h) => (
                <th key={h} className="text-left p-4 text-xs text-gray-500 font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {demoPayouts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="p-4 font-mono text-xs">{p.id}</td>
                  <td className="p-4 font-semibold">₦{p.amount.toLocaleString()}</td>
                  <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-green-100 text-green-700" : p.status === "processing" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td>
                  <td className="p-4 text-gray-500">{p.date}</td>
                  <td className="p-4 text-gray-500">{p.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
