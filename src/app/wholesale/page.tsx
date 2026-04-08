"use client";

import Link from "next/link";
import { Building2, ArrowRight, CheckCircle2, Truck, CreditCard, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WholesalePage() {
  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">B2B / Wholesale</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-blue-300" />
              <span className="text-blue-300 font-syne font-600 text-sm">B2B / Wholesale Portal</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              Wholesale Pricing for Businesses
            </h1>
            <p className="text-blue-200 text-lg mb-8">
              Access exclusive wholesale pricing, volume discounts, NET payment terms, and dedicated account management.
              Serving businesses, resellers, and project contractors across Nigeria and beyond.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/register">
                <Button variant="cta" size="lg">Apply for B2B Account <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
              <Link href="/quote">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Request Bulk Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-10 text-center">Wholesale Benefits</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: "Wholesale Pricing", desc: "Up to 40% off retail prices on bulk orders" },
              { icon: CreditCard, title: "NET Payment Terms", desc: "NET 30 and NET 60 terms for approved accounts" },
              { icon: Truck, title: "Priority Shipping", desc: "Dedicated logistics for bulk orders with tracking" },
              { icon: Users, title: "Account Manager", desc: "Dedicated support for your business needs" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl border border-border p-6 text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-blue" />
                  </div>
                  <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Popular Wholesale Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "CCTV Cameras & DVR/NVR Systems",
              "Fire Alarm Components",
              "Access Control Terminals",
              "Network Switches & Routers",
              "Solar Panels & Inverters",
              "Safety Equipment & PPE",
              "Marine Accessories",
              "Boat Engines & Parts",
              "Kitchen Equipment",
            ].map((cat) => (
              <div key={cat} className="flex items-center gap-3 p-4 bg-off-white rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-text-2">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-10 text-center">How to Get Started</h2>
          <div className="grid sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Apply", desc: "Fill out the B2B application form with your business details" },
              { step: "02", title: "Review", desc: "Our team reviews your application within 24-48 hours" },
              { step: "03", title: "Approval", desc: "Get approved and access wholesale pricing instantly" },
              { step: "04", title: "Order", desc: "Place bulk orders with wholesale pricing and NET terms" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <span className="font-syne font-800 text-blue">{item.step}</span>
                </div>
                <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                <p className="text-xs text-text-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-navy to-blue-800">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-syne font-800 text-3xl mb-4">Ready for Wholesale Pricing?</h2>
          <p className="text-blue-200 mb-8">Apply today and start saving on bulk orders</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/auth/register">
              <Button variant="cta" size="lg">Apply Now</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Contact B2B Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
