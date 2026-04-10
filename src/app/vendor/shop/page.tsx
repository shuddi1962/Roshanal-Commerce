"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, Save, Image, Globe, MapPin, Phone, Mail } from "lucide-react";

export default function VendorShopPage() {
  const [shop, setShop] = useState({
    name: "My Vendor Shop",
    description: "Quality products at affordable prices. Serving customers across Nigeria with premium security and marine equipment.",
    address: "15 Marina Road, Lagos Island, Lagos",
    phone: "+234 800 123 4567",
    email: "vendor@roshanal.com",
    website: "",
    logo: null as string | null,
    banner: null as string | null,
    openHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
    returnPolicy: "30-day return policy on all items",
    shippingNote: "Free shipping on orders over ₦50,000",
  });

  const handleSave = () => alert("Shop profile saved successfully!");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">Shop Profile</h1><p className="text-sm text-gray-500">Customize your vendor storefront</p></div>
          <div className="flex gap-2">
            <Link href="/vendor/dashboard" className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Dashboard</Link>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><Save size={16} /> Save Changes</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Store size={16} /> Shop Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">Shop Name</label><input value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Email</label><div className="relative"><Mail size={14} className="absolute left-3 top-3 text-gray-400" /><input value={shop.email} onChange={(e) => setShop({ ...shop, email: e.target.value })} className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg" /></div></div>
            <div><label className="text-xs text-gray-500 block mb-1">Phone</label><div className="relative"><Phone size={14} className="absolute left-3 top-3 text-gray-400" /><input value={shop.phone} onChange={(e) => setShop({ ...shop, phone: e.target.value })} className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg" /></div></div>
            <div><label className="text-xs text-gray-500 block mb-1">Website</label><div className="relative"><Globe size={14} className="absolute left-3 top-3 text-gray-400" /><input value={shop.website} onChange={(e) => setShop({ ...shop, website: e.target.value })} placeholder="https://" className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg" /></div></div>
          </div>
          <div><label className="text-xs text-gray-500 block mb-1">Address</label><div className="relative"><MapPin size={14} className="absolute left-3 top-3 text-gray-400" /><input value={shop.address} onChange={(e) => setShop({ ...shop, address: e.target.value })} className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg" /></div></div>
          <div><label className="text-xs text-gray-500 block mb-1">Description</label><textarea value={shop.description} onChange={(e) => setShop({ ...shop, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Image size={16} /> Shop Branding</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors" onClick={() => alert("Logo upload: Select an image file.")}>
              <Image size={24} className="mx-auto text-gray-400 mb-2" /><p className="text-xs text-gray-500">Upload Logo</p><p className="text-[10px] text-gray-400">PNG, JPG up to 2MB</p>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors" onClick={() => alert("Banner upload: Select an image file.")}>
              <Image size={24} className="mx-auto text-gray-400 mb-2" /><p className="text-xs text-gray-500">Upload Banner</p><p className="text-[10px] text-gray-400">1200x300px recommended</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm">Policies</h3>
          <div><label className="text-xs text-gray-500 block mb-1">Business Hours</label><input value={shop.openHours} onChange={(e) => setShop({ ...shop, openHours: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Return Policy</label><input value={shop.returnPolicy} onChange={(e) => setShop({ ...shop, returnPolicy: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Shipping Note</label><input value={shop.shippingNote} onChange={(e) => setShop({ ...shop, shippingNote: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg" /></div>
        </div>
      </div>
    </div>
  );
}
