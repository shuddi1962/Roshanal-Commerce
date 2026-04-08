"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const storeLocations = [
  {
    id: "phc",
    name: "Port Harcourt (Headquarters)",
    address: "14 Aba Road, Port Harcourt, Rivers State, Nigeria",
    phone: "+234 800 ROSHANAL",
    email: "phc@roshanalglobal.com",
    hours: "Monday – Saturday: 8AM – 6PM WAT",
    manager: "Engr. Roshanal",
    services: ["Full Product Range", "CCTV Installation", "Fire Alarm", "Boat Building Consultation", "POS Terminal"],
    lat: 4.8156,
    lng: 7.0498,
  },
  {
    id: "lagos",
    name: "Lagos Office",
    address: "25 Broad Street, Lagos Island, Lagos State, Nigeria",
    phone: "+234 800 ROSHANAL",
    email: "lagos@roshanalglobal.com",
    hours: "Monday – Saturday: 8AM – 6PM WAT",
    manager: "Adaobi Okonkwo",
    services: ["Full Product Range", "Installation Services", "B2B Orders", "Pickup Point"],
    lat: 6.4541,
    lng: 3.3947,
  },
  {
    id: "bayelsa",
    name: "Bayelsa Office",
    address: "12 Mbiama Road, Yenagoa, Bayelsa State, Nigeria",
    phone: "+234 800 ROSHANAL",
    email: "bayelsa@roshanalglobal.com",
    hours: "Monday – Saturday: 9AM – 5PM WAT",
    manager: "Chidi Nwankwo",
    services: ["Marine Accessories", "Boat Engines", "Dredging Equipment", "Marine Consultation"],
    lat: 4.9241,
    lng: 6.2649,
  },
];

export default function StoreLocatorPage() {
  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Store Locator</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-navy to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-syne font-800 text-3xl mb-3">Find a Store Near You</h1>
          <p className="text-blue-200">Visit any of our branches for in-store shopping, pickup, or expert consultation</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Map Placeholder */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue/30 mx-auto mb-3" />
              <p className="text-sm text-text-3">Interactive map powered by Mapbox</p>
              <p className="text-xs text-text-4">Map will load with Mapbox GL JS integration</p>
            </div>
          </div>
        </div>

        {/* Store Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {storeLocations.map((store) => (
            <div key={store.id} className="bg-white rounded-xl border border-border overflow-hidden hover:border-blue/30 transition-colors">
              {/* Mini Map */}
              <div className="h-40 bg-gradient-to-br from-off-white to-blue-50 flex items-center justify-center relative">
                <MapPin className="w-10 h-10 text-blue/20" />
                <div className="absolute bottom-3 right-3">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 bg-white/90 rounded-lg text-xs text-blue font-medium shadow-sm hover:bg-white">
                    <Navigation className="w-3 h-3" /> Directions
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-syne font-700 text-lg text-text-1 mb-3">{store.name}</h3>
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-text-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-3">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-text-4 flex-shrink-0" />
                    <span className="text-sm text-text-3">{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-text-4 flex-shrink-0" />
                    <span className="text-sm text-text-3">{store.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-text-4 flex-shrink-0" />
                    <span className="text-sm text-text-3">{store.hours}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-text-2 mb-2">Available Services:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {store.services.map((service) => (
                      <span key={service} className="px-2 py-0.5 bg-blue-50 text-blue text-[10px] font-medium rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-text-4">Manager: {store.manager}</span>
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
