"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
  Building2,
  History,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/store/currency-store";

const transactions = [
  { id: "1", type: "credit" as const, desc: "Wallet Top-up", amount: 50000, date: "2026-04-05", status: "completed" as const, ref: "WLT-001234" },
  { id: "2", type: "debit" as const, desc: "Order #ORD-8842 Payment", amount: 35000, date: "2026-04-03", status: "completed" as const, ref: "WLT-001233" },
  { id: "3", type: "credit" as const, desc: "Refund - Order #ORD-8801", amount: 12500, date: "2026-04-01", status: "completed" as const, ref: "WLT-001232" },
  { id: "4", type: "credit" as const, desc: "Referral Bonus - Amara O.", amount: 2000, date: "2026-03-28", status: "completed" as const, ref: "WLT-001231" },
  { id: "5", type: "debit" as const, desc: "Order #ORD-8790 Payment", amount: 85000, date: "2026-03-25", status: "completed" as const, ref: "WLT-001230" },
  { id: "6", type: "debit" as const, desc: "Withdrawal to Bank", amount: 100000, date: "2026-03-20", status: "completed" as const, ref: "WLT-001229" },
  { id: "7", type: "credit" as const, desc: "Store Credit - Return #RMA-102", amount: 18000, date: "2026-03-18", status: "completed" as const, ref: "WLT-001228" },
];

export default function WalletPage() {
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const { formatPrice, formatNGN, currency } = useCurrencyStore();

  const balance = 62500;
  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

  return (
    <div>
      <h1 className="font-bold text-2xl text-text-1 mb-6">My Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-navy via-blue-900 to-blue-800 rounded-2xl p-6 md:p-8 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Available Balance</p>
            <h2 className="font-bold text-3xl md:text-4xl">
              {formatPrice(balance)}
            </h2>
            {currency !== "NGN" && (
              <p className="text-white/40 text-sm mt-1">{formatNGN(balance)}</p>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Wallet size={28} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setShowTopup(!showTopup)}
            className="bg-white text-navy hover:bg-white/90 gap-2"
          >
            <Plus size={16} /> Top Up
          </Button>
          <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20 gap-2">
            <ArrowUpRight size={16} /> Withdraw
          </Button>
          <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20 gap-2">
            <CreditCard size={16} /> Pay
          </Button>
        </div>
      </div>

      {/* Top-up Panel */}
      {showTopup && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-lg text-text-1 mb-4">Top Up Wallet</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setTopupAmount(String(amt))}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  topupAmount === String(amt)
                    ? "bg-blue text-white border-blue"
                    : "bg-off-white text-text-2 border-border hover:border-blue"
                }`}
              >
                {formatNGN(amt)}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Or enter custom amount"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              className="flex-1 h-11 px-4 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
            />
            <Button variant="cta" className="px-8">
              Proceed to Pay
            </Button>
          </div>
          <div className="flex gap-3 mt-4">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border cursor-pointer hover:border-blue transition-colors">
              <input type="radio" name="topup-method" defaultChecked className="text-blue" />
              <CreditCard size={16} className="text-text-3" />
              <span className="text-sm text-text-2">Card</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border cursor-pointer hover:border-blue transition-colors">
              <input type="radio" name="topup-method" className="text-blue" />
              <Building2 size={16} className="text-text-3" />
              <span className="text-sm text-text-2">Bank Transfer</span>
            </label>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-lg text-text-1 flex items-center gap-2">
            <History size={18} /> Transaction History
          </h3>
          <select className="text-sm border border-border rounded-lg px-3 py-1.5 text-text-3">
            <option>All Transactions</option>
            <option>Credits</option>
            <option>Debits</option>
          </select>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-off-white transition-colors">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === "credit" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {tx.type === "credit" ? (
                  <ArrowDownLeft size={18} className="text-green-600" />
                ) : (
                  <ArrowUpRight size={18} className="text-red" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-1">{tx.desc}</p>
                <p className="text-xs text-text-4">{tx.ref} · {tx.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    tx.type === "credit" ? "text-green-600" : "text-red"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}{formatNGN(tx.amount)}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                  {tx.status}
                </span>
              </div>
              <ChevronRight size={14} className="text-text-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
