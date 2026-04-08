"use client";

import Link from "next/link";
import { Fingerprint, CheckCircle2, ArrowRight, KeyRound, ScanFace, CreditCard, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessControlPage() {
  return (
    <div className="bg-off-white">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/services" className="hover:text-blue">Services</Link><span>/</span>
          <span className="text-text-1 font-medium">Access Control</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Fingerprint className="w-5 h-5 text-purple-300" />
              <span className="text-purple-300 font-syne font-600 text-sm">Access Control Systems</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              Smart Access Control Installation
            </h1>
            <p className="text-purple-200 text-lg mb-8">
              Biometric, card-based, and smart access control solutions for offices, factories, estates, and high-security areas. Full installation with software integration.
            </p>
            <Button variant="cta" size="lg" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
              Book Installation <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Solutions We Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ScanFace, title: "Biometric Systems", desc: "Fingerprint, facial recognition, iris scanners for maximum security" },
              { icon: CreditCard, title: "Card & Fob Systems", desc: "RFID, proximity, and smart card readers for convenient access" },
              { icon: KeyRound, title: "Keypad & PIN", desc: "Numeric keypads for areas requiring code-based entry" },
              { icon: DoorOpen, title: "Gate Automation", desc: "Automated gates, barriers, and turnstiles with access integration" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl border border-border p-6 text-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Industries We Serve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {["Corporate Offices", "Banks & Financial", "Factories & Warehouses", "Government Buildings", "Residential Estates", "Hotels & Hospitality", "Schools & Universities", "Hospitals & Clinics", "Oil & Gas Facilities"].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-off-white rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-text-2">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Book Access Control Installation</h2>
            <p className="text-text-3 text-sm mb-6">Get a free assessment and quote for your facility</p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Full Name" />
                <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Email Address" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Phone Number" />
                <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                  <option>System Type</option>
                  <option>Biometric (Fingerprint/Face)</option>
                  <option>Card/Fob Access</option>
                  <option>Keypad/PIN</option>
                  <option>Gate Automation</option>
                  <option>Combined System</option>
                </select>
              </div>
              <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Facility Address" />
              <textarea rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Number of access points, doors, gates, etc." />
              <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                Request Assessment <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
