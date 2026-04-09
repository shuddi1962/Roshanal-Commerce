"use client";

import { useState } from "react";
import {
  RotateCcw,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/store/currency-store";

const returns = [
  {
    id: "RMA-001",
    orderId: "ORD-8801",
    product: "Hikvision 4MP IP Dome Camera",
    reason: "Defective product",
    status: "approved" as const,
    requestDate: "2026-03-28",
    resolvedDate: "2026-04-02",
    refundAmount: 72500,
    refundMethod: "Store Credit",
  },
  {
    id: "RMA-002",
    orderId: "ORD-8790",
    product: "TP-Link Omada EAP670 Access Point",
    reason: "Wrong item received",
    status: "in-transit" as const,
    requestDate: "2026-04-01",
    resolvedDate: null,
    refundAmount: 108000,
    refundMethod: "Original Payment",
  },
  {
    id: "RMA-003",
    orderId: "ORD-8765",
    product: "Honeywell Addressable Smoke Detector",
    reason: "Changed mind",
    status: "pending" as const,
    requestDate: "2026-04-05",
    resolvedDate: null,
    refundAmount: 23800,
    refundMethod: "Store Credit",
  },
];

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-50 text-yellow-700", icon: Clock },
  approved: { label: "Approved", color: "bg-green-50 text-green-700", icon: CheckCircle },
  "in-transit": { label: "Return In Transit", color: "bg-blue-50 text-blue", icon: Truck },
  completed: { label: "Completed", color: "bg-green-50 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-50 text-red", icon: AlertCircle },
};

export default function ReturnsPage() {
  const [showForm, setShowForm] = useState(false);
  const { formatNGN } = useCurrencyStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-text-1">Returns & RMA</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={16} /> Request Return
        </Button>
      </div>

      {/* New Return Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-lg text-text-1 mb-4">New Return Request</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Order Number</label>
              <input placeholder="e.g. ORD-8842" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Product</label>
              <select className="w-full h-11 px-3 rounded-lg border border-border text-sm">
                <option value="">Select product...</option>
                <option>Hikvision 4MP IP Dome Camera</option>
                <option>Dahua 8-Channel NVR</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Reason for Return</label>
              <select className="w-full h-11 px-3 rounded-lg border border-border text-sm">
                <option value="">Select reason...</option>
                <option>Defective product</option>
                <option>Wrong item received</option>
                <option>Damaged in transit</option>
                <option>Not as described</option>
                <option>Changed mind</option>
                <option>Better price found</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Preferred Refund</label>
              <select className="w-full h-11 px-3 rounded-lg border border-border text-sm">
                <option>Store Credit (faster)</option>
                <option>Original Payment Method</option>
                <option>Replacement</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Description</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="Describe the issue..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Upload Photos (optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <p className="text-sm text-text-4">Drag & drop photos or click to browse</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="cta">Submit Return Request</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Returns List */}
      <div className="space-y-4">
        {returns.map((ret) => {
          const config = statusConfig[ret.status];
          const StatusIcon = config.icon;
          return (
            <div key={ret.id} className="bg-white rounded-xl border border-border p-5 hover:shadow-soft transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-off-white flex items-center justify-center">
                    <RotateCcw size={18} className="text-text-3" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-1">{ret.id}</p>
                    <p className="text-xs text-text-4">Order {ret.orderId}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>
                  <StatusIcon size={12} /> {config.label}
                </span>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-text-4 text-xs">Product</p>
                  <p className="text-text-1 font-medium">{ret.product}</p>
                </div>
                <div>
                  <p className="text-text-4 text-xs">Reason</p>
                  <p className="text-text-2">{ret.reason}</p>
                </div>
                <div>
                  <p className="text-text-4 text-xs">Refund Amount</p>
                  <p className="text-text-1 font-semibold">{formatNGN(ret.refundAmount)}</p>
                </div>
                <div>
                  <p className="text-text-4 text-xs">Refund Method</p>
                  <p className="text-text-2">{ret.refundMethod}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <p className="text-xs text-text-4">
                  Requested: {ret.requestDate}
                  {ret.resolvedDate && ` · Resolved: ${ret.resolvedDate}`}
                </p>
                <button className="text-xs text-blue font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
