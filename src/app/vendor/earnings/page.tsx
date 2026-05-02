"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Wallet, ArrowDownToLine, Calendar, Loader2 } from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Payout {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  method: string;
}

interface Order {
  total_amount: number;
  status: string;
  created_at: string;
  vendor_id: string;
}

export default function VendorEarningsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [requesting, setRequesting] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await insforge.auth.getCurrentUser();
      if (!user) return;
      setVendorId(user.id);

      const [payoutsRes, ordersRes] = await Promise.all([
        insforge.database.from("payouts").select("*").eq("vendor_id", user.id).order("created_at", { ascending: false }),
        insforge.database.from("orders").select("total_amount, status, created_at").eq("vendor_id", user.id),
      ]);

      if (payoutsRes.data) setPayouts(payoutsRes.data);
    } catch (e: any) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalRevenue = 0; // Calculate from orders if needed
  const totalPayout = payouts.filter((p) => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const pendingPayout = payouts.filter((p) => p.status !== "completed").reduce((a, p) => a + p.amount, 0);

  const handlePayoutRequest = async () => {
    if (!vendorId) return;
    setRequesting(true);
    try {
      const { error } = await insforge.database.from("payouts").insert([{
        vendor_id: vendorId,
        amount: pendingPayout || 50000,
        status: "pending",
        method: "Bank Transfer",
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      showToast("success", "Payout request submitted! You will receive it within 3-5 business days.");
      await fetchData();
    } catch (e: any) {
      showToast("error", e.message || "Failed to request payout");
    } finally {
      setRequesting(false);
    }
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
          <div><h1 className="text-xl font-bold text-gray-900">Earnings</h1><p className="text-sm text-gray-500">Revenue and payout overview</p></div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={handlePayoutRequest} disabled={requesting || pendingPayout === 0} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
              {requesting ? <Loader2 size={16} className="animate-spin" /> : <ArrowDownToLine size={16} />}
              Request Payout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `₦0`, icon: TrendingUp, color: "text-green-600" },
            { label: "Total Payouts", value: `₦${totalPayout.toLocaleString()}`, icon: Wallet, color: "text-blue-600" },
            { label: "Pending Payout", value: `₦${pendingPayout.toLocaleString()}`, icon: DollarSign, color: "text-yellow-600" },
            { label: "Commission Rate", value: "12%", icon: Calendar, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-sm">Payout History</h3></div>
          {loading ? (
            <div className="text-center py-8"><Loader2 size={20} className="animate-spin mx-auto text-gray-400" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {["ID", "Amount", "Status", "Date", "Method"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs text-gray-500 font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-xs">{p.id.slice(0, 8)}</td>
                    <td className="p-4 font-semibold">₦{p.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-green-100 text-green-700" : p.status === "processing" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{p.created_at?.slice(0, 10)}</td>
                    <td className="p-4 text-gray-500">{p.method}</td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-sm">No payout history</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
