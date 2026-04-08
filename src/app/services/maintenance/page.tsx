"use client";

import Link from "next/link";
import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "₦50,000",
    period: "/year",
    features: ["Bi-annual system check", "Phone support (business hours)", "10% parts discount", "48h response time"],
  },
  {
    name: "Professional",
    price: "₦120,000",
    period: "/year",
    popular: true,
    features: ["Quarterly system check", "Priority phone & email support", "20% parts discount", "24h response time", "Remote diagnostics", "Firmware updates"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Monthly system check", "24/7 dedicated support", "30% parts discount", "4h emergency response", "Remote monitoring", "All firmware/software updates", "Dedicated account manager"],
  },
];

export default function MaintenancePage() {
  return (
    <div className="bg-off-white">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/services" className="hover:text-blue">Services</Link><span>/</span>
          <span className="text-text-1 font-medium">Maintenance</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-green-300" />
              <span className="text-green-300 font-syne font-600 text-sm">Maintenance Contracts</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              System Maintenance & Support
            </h1>
            <p className="text-green-200 text-lg mb-8">
              Keep your systems running at peak performance with our maintenance contracts.
              Regular servicing, priority support, and discounted repairs for all installed systems.
            </p>
            <Button variant="cta" size="lg" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
              Book Maintenance <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Systems We Maintain</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {["CCTV & Surveillance Systems", "Fire Alarm Systems", "Access Control Systems", "Network Infrastructure", "Solar & Power Systems", "Kitchen Equipment", "Marine Electronics", "Security Gates & Barriers", "Intercoms & PA Systems"].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-border">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-text-2">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-3 text-center">Maintenance Plans</h2>
          <p className="text-text-3 text-center mb-10">Choose the plan that fits your needs</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-xl border p-6 ${plan.popular ? "border-blue bg-blue-50/30 relative" : "border-border"}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue text-white text-xs font-syne font-600 rounded-full">
                    Recommended
                  </span>
                )}
                <h3 className="font-syne font-700 text-lg text-text-1 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="font-syne font-800 text-2xl text-blue">{plan.price}</span>
                  <span className="text-sm text-text-3">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "default" : "outline"} className="w-full" size="sm">
                  {plan.price === "Custom" ? "Contact Sales" : "Subscribe"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Book Maintenance Service</h2>
            <p className="text-text-3 text-sm mb-6">Schedule a maintenance visit or subscribe to a plan</p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Full Name" />
                <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Email Address" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Phone Number" />
                <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                  <option>System Type</option>
                  <option>CCTV / Surveillance</option>
                  <option>Fire Alarm</option>
                  <option>Access Control</option>
                  <option>Network / IT</option>
                  <option>Solar / Power</option>
                  <option>Kitchen Equipment</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Describe the issue or maintenance needed..." />
              <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                Book Maintenance <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
