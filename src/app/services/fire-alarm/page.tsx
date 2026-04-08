"use client";

import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  ArrowRight,
  Bell,
  Thermometer,
  Radio,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const systemTypes = [
  { icon: Bell, name: "Conventional Systems", desc: "Cost-effective for small-medium buildings. Zone-based detection with manual call points and sounders.", ideal: "Offices, shops, apartments" },
  { icon: Radio, name: "Addressable Systems", desc: "Advanced systems with individual device identification. Faster detection and precise location reporting.", ideal: "Hotels, hospitals, factories" },
  { icon: Thermometer, name: "Aspirating Systems", desc: "Ultra-early detection using air sampling. Ideal for environments where early warning is critical.", ideal: "Data centers, museums, archives" },
  { icon: Building2, name: "Wireless Systems", desc: "No cabling required. Easy installation in heritage or rented buildings where wiring is restricted.", ideal: "Heritage buildings, temporary sites" },
];

export default function FireAlarmPage() {
  return (
    <div className="bg-off-white">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/services" className="hover:text-blue">Services</Link><span>/</span>
          <span className="text-text-1 font-medium">Fire Alarm Installation</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="text-orange-200 font-syne font-600 text-sm">Professional Installation</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              Fire Alarm System Installation
            </h1>
            <p className="text-red-200 text-lg mb-8">
              Protect lives and property with professional fire alarm installation. Conventional, addressable,
              and aspirating systems designed and installed to comply with local and international safety standards.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="cta" size="lg" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
                Book Installation <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Link href="/category/fire-alarm">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* System Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-3 text-center">System Types We Install</h2>
          <p className="text-text-3 text-center mb-10">Tailored solutions for every building type</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {systemTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.name} className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-red" />
                    </div>
                    <div>
                      <h3 className="font-syne font-700 text-lg text-text-1 mb-2">{type.name}</h3>
                      <p className="text-sm text-text-3 mb-2">{type.desc}</p>
                      <p className="text-xs text-text-4">Ideal for: {type.ideal}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">What&apos;s Included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Site survey & risk assessment",
              "System design & engineering",
              "Control panel installation",
              "Smoke & heat detector placement",
              "Manual call point installation",
              "Sounder & beacon setup",
              "Cable routing & connection",
              "System programming & testing",
              "Compliance certification",
              "Staff training & handover",
              "Documentation & manuals",
              "Warranty & maintenance plan",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-off-white rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-text-2">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Book Fire Alarm Installation</h2>
            <p className="text-text-3 text-sm mb-6">Get a free site survey and quote</p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Full Name" />
                <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Email Address" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Phone Number" />
                <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                  <option>Building Type</option>
                  <option>Office</option>
                  <option>Hotel / Hospitality</option>
                  <option>Factory / Industrial</option>
                  <option>Hospital / Healthcare</option>
                  <option>School / Education</option>
                  <option>Residential</option>
                  <option>Other</option>
                </select>
              </div>
              <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Building Address" />
              <textarea rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Describe your building and requirements..." />
              <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                Request Free Survey <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
