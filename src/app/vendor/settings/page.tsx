"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Save, Bell, CreditCard, Shield, User } from "lucide-react";

export default function VendorSettingsPage() {
  const [profile, setProfile] = useState({ name: "Roshanal Vendor", email: "vendor@roshanal.com", phone: "+234 800 000 0002" });
  const [bank, setBank] = useState({ bankName: "First Bank", accountNumber: "0123456789", accountName: "Roshanal Vendor Ltd" });
  const [notifications, setNotifications] = useState({ orderEmail: true, orderSms: false, payoutEmail: true, reviewEmail: true, promotionEmail: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500">Manage your vendor account</p></div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={() => alert("Settings saved!")} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><Save size={16} /> Save All</button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><User size={16} /> Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">Full Name</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Email</label><input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Phone</label><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><CreditCard size={16} /> Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">Bank Name</label><input value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Account Number</label><input value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <div className="md:col-span-2"><label className="text-xs text-gray-500 block mb-1">Account Name</label><input value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Bell size={16} /> Notifications</h3>
          {[
            { key: "orderEmail", label: "New order email notifications" },
            { key: "orderSms", label: "New order SMS notifications" },
            { key: "payoutEmail", label: "Payout confirmation emails" },
            { key: "reviewEmail", label: "New review notifications" },
            { key: "promotionEmail", label: "Promotional emails from Roshanal" },
          ].map((n) => (
            <label key={n.key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{n.label}</span>
              <input type="checkbox" checked={notifications[n.key as keyof typeof notifications]} onChange={(e) => setNotifications({ ...notifications, [n.key]: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-purple-600" />
            </label>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Shield size={16} /> Security</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-gray-500 block mb-1">Current Password</label><input type="password" placeholder="Enter current password" className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">New Password</label><input type="password" placeholder="Enter new password" className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <button onClick={() => alert("Password updated!")} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
