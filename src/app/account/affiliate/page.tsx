"use client";

import { useState } from "react";
import {
  Users,
  Link2,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/store/currency-store";

export default function AffiliateDashboardPage() {
  const [copied, setCopied] = useState(false);
  const { formatNGN } = useCurrencyStore();
  const referralLink = "https://roshanalglobal.com/ref/JOHN2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Total Referrals", value: "34", icon: UserPlus, color: "bg-blue-50 text-blue" },
    { label: "Conversions", value: "12", icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Commission Earned", value: formatNGN(48000), icon: DollarSign, color: "bg-purple-50 text-purple-600" },
    { label: "Pending Payout", value: formatNGN(18500), icon: ArrowUpRight, color: "bg-orange-50 text-orange-600" },
  ];

  const referrals = [
    { id: "1", name: "Amara O.", date: "2026-04-02", order: "ORD-9012", amount: 85000, commission: 4250, status: "confirmed" as const },
    { id: "2", name: "Chidi E.", date: "2026-03-28", order: "ORD-8998", amount: 195000, commission: 9750, status: "confirmed" as const },
    { id: "3", name: "Fatima A.", date: "2026-03-25", order: "ORD-8970", amount: 45000, commission: 2250, status: "pending" as const },
    { id: "4", name: "Emeka N.", date: "2026-03-20", order: "ORD-8945", amount: 320000, commission: 16000, status: "confirmed" as const },
    { id: "5", name: "Kemi B.", date: "2026-03-15", order: null, amount: 0, commission: 0, status: "signed-up" as const },
    { id: "6", name: "Tunde W.", date: "2026-03-12", order: "ORD-8901", amount: 125000, commission: 6250, status: "confirmed" as const },
  ];

  const payouts = [
    { id: "1", date: "2026-03-30", amount: 29500, method: "Bank Transfer", status: "paid" as const },
    { id: "2", date: "2026-02-28", amount: 18000, method: "Wallet Credit", status: "paid" as const },
  ];

  return (
    <div>
      <h1 className="font-bold text-2xl text-text-1 mb-6">Affiliate Dashboard</h1>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-br from-blue via-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Link2 size={20} />
          <h3 className="font-semibold">Your Referral Link</h3>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono truncate">
            {referralLink}
          </div>
          <Button
            onClick={handleCopy}
            className="bg-white text-blue hover:bg-white/90 gap-2 shrink-0"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-white/50 text-xs mt-3">
          Share this link. Earn 5% commission on every sale from your referrals + ₦2,000 signup bonus.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-text-1">{stat.value}</p>
              <p className="text-xs text-text-4 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Referral List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-lg text-text-1 flex items-center gap-2">
              <Users size={18} /> Referral Activity
            </h3>
            <select className="text-sm border border-border rounded-lg px-3 py-1.5 text-text-3">
              <option>All Time</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="divide-y divide-border">
            {referrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-off-white transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue text-sm font-semibold">
                    {ref.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-1">{ref.name}</p>
                    <p className="text-xs text-text-4">{ref.date} {ref.order && `· ${ref.order}`}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  {ref.commission > 0 && (
                    <span className="text-sm font-semibold text-green-600">+{formatNGN(ref.commission)}</span>
                  )}
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    ref.status === "confirmed" ? "bg-green-50 text-green-700" :
                    ref.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                    "bg-blue-50 text-blue"
                  }`}>
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History + Request */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-3 flex items-center gap-2">
              <DollarSign size={18} /> Request Payout
            </h3>
            <p className="text-sm text-text-3 mb-3">Available balance: <span className="font-semibold text-text-1">{formatNGN(18500)}</span></p>
            <div className="space-y-3">
              <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                <option>Bank Transfer</option>
                <option>Wallet Credit</option>
              </select>
              <input placeholder="Amount" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
              <Button className="w-full" variant="cta">Request Payout</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-3">Payout History</h3>
            <div className="space-y-3">
              {payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-1">{formatNGN(p.amount)}</p>
                    <p className="text-xs text-text-4">{p.date} · {p.method}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Rates */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-3 flex items-center gap-2">
              <Gift size={16} /> Commission Rates
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { cat: "Security Systems", rate: "5%" },
                { cat: "Marine & Engines", rate: "4%" },
                { cat: "Safety Equipment", rate: "5%" },
                { cat: "Networking/ICT", rate: "3%" },
                { cat: "Services", rate: "7%" },
                { cat: "Kitchen Equipment", rate: "6%" },
              ].map((c) => (
                <div key={c.cat} className="flex justify-between py-1">
                  <span className="text-text-3">{c.cat}</span>
                  <span className="font-semibold text-text-1">{c.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
