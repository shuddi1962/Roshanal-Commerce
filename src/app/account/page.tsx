"use client";

import Link from "next/link";
import {
  Package,
  Heart,
  Wallet,
  Trophy,
  MapPin,
  Clock,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
  Eye,
  Star,
} from "lucide-react";

const recentOrders = [
  { id: "RSH-2026-001234", date: "Apr 2, 2026", status: "In Transit", statusColor: "text-blue bg-blue-50", items: 3, total: 285000 },
  { id: "RSH-2026-001198", date: "Mar 28, 2026", status: "Delivered", statusColor: "text-success bg-green-50", items: 1, total: 72500 },
  { id: "RSH-2026-001156", date: "Mar 20, 2026", status: "Completed", statusColor: "text-success bg-green-50", items: 2, total: 195000 },
];

const quickStats = [
  { label: "Total Orders", value: "24", icon: Package, color: "bg-blue-50 text-blue" },
  { label: "Wishlist Items", value: "8", icon: Heart, color: "bg-red-50 text-red" },
  { label: "Wallet Balance", value: "₦45,000", icon: Wallet, color: "bg-green-50 text-success" },
  { label: "Loyalty Points", value: "2,450", icon: Trophy, color: "bg-yellow-50 text-warning" },
];

export default function AccountOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-syne font-700 text-2xl mb-1">Welcome back, John!</h1>
            <p className="text-blue-200 text-sm">Here&apos;s what&apos;s happening with your account</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-blue-300">Member since</p>
              <p className="font-syne font-600 text-sm">Jan 2025</p>
            </div>
            <div className="w-px h-10 bg-blue-600" />
            <div className="text-right">
              <p className="text-xs text-blue-300">Loyalty Tier</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <p className="font-syne font-600 text-sm">Gold</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-syne font-700 text-xl text-text-1">{stat.value}</p>
              <p className="text-sm text-text-3">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-syne font-700 text-lg text-text-1">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-blue hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-5 hover:bg-off-white/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-off-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-text-3" />
                </div>
                <div>
                  <p className="font-mono text-sm font-medium text-text-1">{order.id}</p>
                  <p className="text-xs text-text-3">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                  {order.status}
                </span>
                <p className="font-syne font-600 text-sm text-text-1">
                  ₦{order.total.toLocaleString()}
                </p>
                <Link href={`/track-order?id=${order.id}`}>
                  <Eye className="w-4 h-4 text-text-4 hover:text-blue cursor-pointer" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/account/addresses" className="bg-white rounded-xl border border-border p-5 hover:border-blue/30 transition-colors group">
          <MapPin className="w-5 h-5 text-text-3 group-hover:text-blue mb-3" />
          <h3 className="font-syne font-600 text-sm text-text-1 mb-1">Manage Addresses</h3>
          <p className="text-xs text-text-3">Add or update delivery addresses</p>
        </Link>
        <Link href="/account/wallet" className="bg-white rounded-xl border border-border p-5 hover:border-blue/30 transition-colors group">
          <Wallet className="w-5 h-5 text-text-3 group-hover:text-blue mb-3" />
          <h3 className="font-syne font-600 text-sm text-text-1 mb-1">Top Up Wallet</h3>
          <p className="text-xs text-text-3">Add funds to your Roshanal wallet</p>
        </Link>
        <Link href="/track-order" className="bg-white rounded-xl border border-border p-5 hover:border-blue/30 transition-colors group">
          <Clock className="w-5 h-5 text-text-3 group-hover:text-blue mb-3" />
          <h3 className="font-syne font-600 text-sm text-text-1 mb-1">Track an Order</h3>
          <p className="text-xs text-text-3">Enter order ID to track delivery</p>
        </Link>
      </div>

      {/* Loyalty Progress */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-700 text-lg text-text-1">Loyalty Progress</h2>
          <Link href="/account/loyalty" className="text-sm text-blue hover:underline">View Details</Link>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-syne font-600 text-sm text-text-1">Gold Tier</span>
          </div>
          <ArrowRight className="w-4 h-4 text-text-4" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-text-3" />
            <span className="text-sm text-text-3">550 pts to Platinum</span>
          </div>
        </div>
        <div className="w-full bg-off-white rounded-full h-2.5">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full" style={{ width: "82%" }} />
        </div>
        <p className="text-xs text-text-4 mt-2">2,450 / 3,000 points</p>
      </div>
    </div>
  );
}
