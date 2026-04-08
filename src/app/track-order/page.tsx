"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const demoOrder = {
  id: "RSH-2026-001234",
  status: "in-transit",
  estimatedDelivery: "Apr 7, 2026",
  shippedDate: "Apr 3, 2026",
  carrier: "GIG Logistics",
  trackingNumber: "GIG-2026-0045891",
  items: [
    { name: "Hikvision 4MP IP Dome Camera DS-2CD2143G2-I", qty: 2, price: 72500 },
    { name: "Dahua 8-Channel NVR 4K Ultra HD", qty: 1, price: 195000 },
  ],
  total: 340000,
  address: "14 Aba Road, Port Harcourt, Rivers State, Nigeria",
  timeline: [
    { status: "Order Placed", date: "Apr 2, 2026 — 10:42 AM", description: "Your order has been placed successfully", completed: true },
    { status: "Payment Confirmed", date: "Apr 2, 2026 — 10:45 AM", description: "Payment of ₦340,000 confirmed via Paystack", completed: true },
    { status: "Processing", date: "Apr 2, 2026 — 2:30 PM", description: "Order is being prepared at Port Harcourt warehouse", completed: true },
    { status: "Packed", date: "Apr 3, 2026 — 9:15 AM", description: "Items packed and ready for dispatch", completed: true },
    { status: "Dispatched", date: "Apr 3, 2026 — 11:00 AM", description: "Shipped via GIG Logistics — Tracking: GIG-2026-0045891", completed: true },
    { status: "In Transit", date: "Apr 4, 2026 — 8:20 AM", description: "Package is in transit to your delivery address", completed: true, current: true },
    { status: "Out for Delivery", date: "Estimated Apr 7", description: "Driver will deliver to your address", completed: false },
    { status: "Delivered", date: "Estimated Apr 7", description: "Package delivered", completed: false },
  ],
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracked(true);
  };

  return (
    <div className="bg-off-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link>
          <span>/</span>
          <span className="text-text-1 font-medium">Track Order</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="text-center mb-8">
          <h1 className="font-syne font-700 text-3xl text-text-1 mb-2">Track Your Order</h1>
          <p className="text-text-3">Enter your order ID to see real-time delivery status</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white rounded-xl border border-border p-6 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID (e.g., RSH-2026-001234)"
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue font-mono"
              />
            </div>
            <Button type="submit" variant="default" className="px-6">
              Track <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>

        {tracked && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-blue to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Order {demoOrder.id}</p>
                  <h2 className="font-syne font-700 text-xl mb-1">In Transit</h2>
                  <p className="text-blue-100 text-sm">Estimated delivery: {demoOrder.estimatedDelivery}</p>
                </div>
                <Truck className="w-12 h-12 text-white/30" />
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-blue-200">
                  <Package className="w-3.5 h-3.5" /> {demoOrder.carrier}
                </span>
                <span className="font-mono text-blue-100">{demoOrder.trackingNumber}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-syne font-700 text-lg text-text-1 mb-6">Order Timeline</h3>
              <div className="space-y-0">
                {demoOrder.timeline.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Line */}
                    <div className="flex flex-col items-center">
                      {step.current ? (
                        <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center">
                          <CircleDot className="w-4 h-4 text-white" />
                        </div>
                      ) : step.completed ? (
                        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center">
                          <Clock className="w-3 h-3 text-text-4" />
                        </div>
                      )}
                      {i < demoOrder.timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.completed ? "bg-success" : "bg-border"}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8">
                      <p className={`font-syne font-600 text-sm ${step.current ? "text-blue" : step.completed ? "text-text-1" : "text-text-4"}`}>
                        {step.status}
                      </p>
                      <p className="text-xs text-text-3 mt-0.5">{step.date}</p>
                      <p className="text-xs text-text-4 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-syne font-700 text-lg text-text-1 mb-4">Order Items</h3>
              <div className="space-y-3">
                {demoOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-off-white rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-text-4" />
                      </div>
                      <div>
                        <p className="text-sm text-text-1">{item.name}</p>
                        <p className="text-xs text-text-3">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-syne font-600 text-sm text-text-1">₦{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <span className="font-syne font-700 text-text-1">Total</span>
                <span className="font-syne font-700 text-blue text-lg">₦{demoOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-syne font-700 text-lg text-text-1 mb-3">Delivery Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-text-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-text-2">{demoOrder.address}</p>
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="font-syne font-600 text-sm text-text-1">Need help with your order?</p>
                <p className="text-xs text-text-3 mt-1">Our support team is available Mon–Sat, 8AM–6PM WAT</p>
              </div>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  <Phone className="w-3 h-3 mr-1" /> Contact Support
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
