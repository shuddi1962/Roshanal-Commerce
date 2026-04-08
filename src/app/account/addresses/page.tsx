"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  lga: string;
  country: string;
  isDefault: boolean;
}

const addresses: SavedAddress[] = [
  {
    id: "1",
    label: "Home",
    fullName: "John Doe",
    phone: "+234 812 345 6789",
    address: "42 Ada George Road, Rumuola",
    city: "Port Harcourt",
    state: "Rivers State",
    lga: "Obio-Akpor",
    country: "Nigeria",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    fullName: "John Doe",
    phone: "+234 812 345 6789",
    address: "15 Aba Road, GRA Phase 3",
    city: "Port Harcourt",
    state: "Rivers State",
    lga: "Port Harcourt City",
    country: "Nigeria",
    isDefault: false,
  },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-text-1">My Addresses</h1>
        <Button onClick={() => { setShowForm(true); setEditId(null); }} className="gap-2">
          <Plus size={16} /> Add Address
        </Button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-lg text-text-1 mb-4">
            {editId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Label</label>
              <select className="w-full h-11 px-3 rounded-lg border border-border text-sm">
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Full Name</label>
              <input className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Phone Number</label>
              <input className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="+234" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">State</label>
              <select className="w-full h-11 px-3 rounded-lg border border-border text-sm">
                <option value="">Select state...</option>
                {nigerianStates.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">City</label>
              <input className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">LGA</label>
              <input className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Street Address</label>
              <input className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="House number, street name" />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="default" className="rounded" />
              <label htmlFor="default" className="text-sm text-text-2">Set as default address</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="cta">Save Address</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-xl border p-5 relative ${
              addr.isDefault ? "border-blue" : "border-border"
            }`}
          >
            {addr.isDefault && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-medium bg-blue text-white px-2 py-0.5 rounded-full">
                <Check size={10} /> Default
              </span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-blue" />
              <span className="text-sm font-semibold text-text-1">{addr.label}</span>
            </div>
            <p className="text-sm text-text-2 font-medium">{addr.fullName}</p>
            <p className="text-sm text-text-3 mt-1">{addr.address}</p>
            <p className="text-sm text-text-3">{addr.city}, {addr.state}</p>
            <p className="text-sm text-text-3">{addr.lga}, {addr.country}</p>
            <p className="text-sm text-text-4 mt-1">{addr.phone}</p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setEditId(addr.id); setShowForm(true); }}
                className="gap-1.5"
              >
                <Edit2 size={12} /> Edit
              </Button>
              {!addr.isDefault && (
                <>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Star size={12} /> Set Default
                  </Button>
                  <Button size="sm" variant="outline" className="text-red hover:bg-red-50 gap-1.5">
                    <Trash2 size={12} /> Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
