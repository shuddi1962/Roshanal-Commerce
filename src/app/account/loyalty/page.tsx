"use client";

import {
  Trophy,
  Star,
  Gift,
  Crown,
  Gem,
  Medal,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  { name: "Bronze", icon: Medal, minPoints: 0, color: "from-amber-600 to-amber-800", benefits: ["1x points on purchases", "Birthday discount 5%", "Free shipping over ₦100k"] },
  { name: "Silver", icon: Award, minPoints: 1000, color: "from-gray-400 to-gray-600", benefits: ["1.5x points on purchases", "Birthday discount 10%", "Free shipping over ₦50k", "Early access to sales"] },
  { name: "Gold", icon: Crown, minPoints: 5000, color: "from-yellow-500 to-yellow-700", benefits: ["2x points on purchases", "Birthday discount 15%", "Free shipping on all orders", "Priority support", "Exclusive offers"] },
  { name: "Platinum", icon: Gem, minPoints: 15000, color: "from-purple-400 to-purple-700", benefits: ["3x points on purchases", "Birthday discount 25%", "Free express shipping", "VIP support line", "Exclusive products", "Personal shopper"] },
];

const currentPoints = 2450;
const currentTier = "Gold";
const nextTier = tiers.find((t) => t.minPoints > currentPoints) || tiers[tiers.length - 1];
const currentTierData = tiers.find((t) => t.name === currentTier)!;
const progress = nextTier.minPoints > 0 ? Math.min((currentPoints / nextTier.minPoints) * 100, 100) : 100;

const history = [
  { id: "1", action: "Order #ORD-8842", points: 350, type: "earned" as const, date: "2026-04-03" },
  { id: "2", action: "Redeemed ₦2,000 discount", points: -200, type: "redeemed" as const, date: "2026-04-01" },
  { id: "3", action: "Order #ORD-8790", points: 850, type: "earned" as const, date: "2026-03-25" },
  { id: "4", action: "Referral bonus", points: 500, type: "earned" as const, date: "2026-03-20" },
  { id: "5", action: "Review bonus", points: 50, type: "earned" as const, date: "2026-03-18" },
  { id: "6", action: "Redeemed ₦5,000 discount", points: -500, type: "redeemed" as const, date: "2026-03-15" },
];

const redeemOptions = [
  { points: 100, value: "₦1,000 Store Credit", icon: Gift },
  { points: 250, value: "₦3,000 Store Credit", icon: Gift },
  { points: 500, value: "₦7,000 Store Credit", icon: Gift },
  { points: 1000, value: "₦15,000 Store Credit", icon: Gift },
];

export default function LoyaltyPage() {
  return (
    <div>
      <h1 className="font-bold text-2xl text-text-1 mb-6">Loyalty & Rewards</h1>

      {/* Current Tier Card */}
      <div className={`bg-gradient-to-br ${currentTierData.color} rounded-2xl p-6 md:p-8 text-white mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Crown size={28} />
            </div>
            <div>
              <p className="text-white/60 text-sm">{currentTier} Member</p>
              <h2 className="font-bold text-3xl">{currentPoints.toLocaleString()}</h2>
              <p className="text-white/60 text-xs">loyalty points</p>
            </div>
          </div>
          <Trophy size={48} className="text-white/10" />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/60">{currentTier}</span>
            <span className="text-white/80">{nextTier.name} — {nextTier.minPoints.toLocaleString()} pts</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/50 mt-2">
            {(nextTier.minPoints - currentPoints).toLocaleString()} more points to reach {nextTier.name}
          </p>
        </div>
      </div>

      {/* Tier Comparison */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isCurrent = tier.name === currentTier;
          return (
            <div
              key={tier.name}
              className={`rounded-xl border p-4 ${
                isCurrent ? "border-blue bg-blue-50" : "border-border bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className={isCurrent ? "text-blue" : "text-text-4"} />
                <h4 className={`text-sm font-semibold ${isCurrent ? "text-blue" : "text-text-2"}`}>
                  {tier.name}
                </h4>
                {isCurrent && (
                  <span className="text-[10px] bg-blue text-white px-2 py-0.5 rounded-full ml-auto">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-text-4 mb-2">{tier.minPoints.toLocaleString()} pts required</p>
              <ul className="space-y-1">
                {tier.benefits.map((b) => (
                  <li key={b} className="text-xs text-text-3 flex items-start gap-1.5">
                    <Star size={10} className="text-yellow-500 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Redeem Points */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-lg text-text-1 mb-4 flex items-center gap-2">
            <Gift size={18} /> Redeem Points
          </h3>
          <div className="space-y-3">
            {redeemOptions.map((opt) => (
              <div
                key={opt.points}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-blue transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Zap size={16} className="text-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-1">{opt.value}</p>
                    <p className="text-xs text-text-4">{opt.points} points</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={currentPoints >= opt.points ? "default" : "outline"}
                  disabled={currentPoints < opt.points}
                >
                  Redeem
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-lg text-text-1 mb-4 flex items-center gap-2">
            <Star size={18} /> Points History
          </h3>
          <div className="space-y-0 divide-y divide-border">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-text-1">{h.action}</p>
                  <p className="text-xs text-text-4">{h.date}</p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    h.type === "earned" ? "text-green-600" : "text-red"
                  }`}
                >
                  {h.type === "earned" ? "+" : ""}{h.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
