"use client";

import { useState } from "react";
import {
  Bell,
  Package,
  CreditCard,
  Tag,
  AlertCircle,
  Truck,
  Gift,
  Star,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: "1", type: "order", title: "Order Shipped", message: "Your order #ORD-8842 has been shipped and is on its way!", time: "2 hours ago", read: false, icon: Truck },
  { id: "2", type: "promo", title: "Flash Sale Starting!", message: "Up to 40% off security systems. Limited time only!", time: "5 hours ago", read: false, icon: Tag },
  { id: "3", type: "payment", title: "Payment Confirmed", message: "Payment of ₦85,000 for order #ORD-8842 was successful.", time: "1 day ago", read: true, icon: CreditCard },
  { id: "4", type: "order", title: "Order Confirmed", message: "Your order #ORD-8842 has been confirmed and is being prepared.", time: "1 day ago", read: true, icon: Package },
  { id: "5", type: "loyalty", title: "Points Earned!", message: "You earned 350 loyalty points from your recent purchase.", time: "1 day ago", read: true, icon: Star },
  { id: "6", type: "promo", title: "Welcome Gift", message: "Use code WELCOME10 for 10% off your first order!", time: "3 days ago", read: true, icon: Gift },
  { id: "7", type: "alert", title: "Price Drop Alert", message: "Hikvision 4MP Camera is now ₦72,500 (was ₦85,000)", time: "5 days ago", read: true, icon: AlertCircle },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = filter === "all" ? notifications :
    filter === "unread" ? notifications.filter((n) => !n.read) :
    notifications.filter((n) => n.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-text-1">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-text-3 mt-1">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Check size={14} /> Mark All Read
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-red hover:bg-red-50">
            <Trash2 size={14} /> Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: "Unread" },
          { id: "order", label: "Orders" },
          { id: "promo", label: "Promotions" },
          { id: "payment", label: "Payments" },
          { id: "alert", label: "Alerts" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.id
                ? "bg-blue text-white"
                : "bg-white text-text-3 border border-border hover:bg-off-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.map((notif) => {
          const Icon = notif.icon;
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                notif.read
                  ? "bg-white border-border hover:bg-off-white"
                  : "bg-blue-50/50 border-blue/20 hover:bg-blue-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notif.read ? "bg-off-white" : "bg-blue/10"
              }`}>
                <Icon size={18} className={notif.read ? "text-text-4" : "text-blue"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${notif.read ? "text-text-2" : "text-text-1"}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue shrink-0" />
                  )}
                </div>
                <p className="text-xs text-text-3 mt-0.5">{notif.message}</p>
                <p className="text-[11px] text-text-4 mt-1">{notif.time}</p>
              </div>
              <button className="text-text-4 hover:text-red transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Bell size={48} className="mx-auto text-text-4 mb-3" />
          <p className="text-text-3 font-medium">No notifications</p>
          <p className="text-sm text-text-4 mt-1">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
