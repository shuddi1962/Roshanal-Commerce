"use client";

import Link from "next/link";
import { Phone, ArrowRight, Users, Target, ClipboardList, Lightbulb, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsultationPage() {
  return (
    <div className="bg-off-white">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/services" className="hover:text-blue">Services</Link><span>/</span>
          <span className="text-text-1 font-medium">Consultation</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-300" />
              <span className="text-indigo-300 font-syne font-600 text-sm">B2B Consultation</span>
            </div>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              Expert Consultation Services
            </h1>
            <p className="text-indigo-200 text-lg mb-8">
              Enterprise-level consultation for security, marine operations, and large-scale installations.
              Our team of experts helps you design, plan, and execute projects of any scale.
            </p>
            <Button variant="cta" size="lg" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
              Book Consultation <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Consultation Areas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Security Infrastructure", desc: "Complete security system design for buildings, estates, campuses, and industrial complexes" },
              { icon: Building2, title: "Enterprise Deployments", desc: "Multi-site rollouts, integration planning, and vendor selection for large organizations" },
              { icon: Target, title: "Needs Assessment", desc: "Thorough analysis of your current setup and recommendations for improvement" },
              { icon: ClipboardList, title: "Budget Planning", desc: "Detailed cost analysis and phased implementation plans to fit your budget" },
              { icon: Lightbulb, title: "Technology Advisory", desc: "Expert guidance on choosing the right technology and equipment for your needs" },
              { icon: Phone, title: "Project Oversight", desc: "End-to-end project management from design through commissioning" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl border border-border p-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-off-white rounded-2xl border border-border p-8">
            <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Book a Consultation</h2>
            <p className="text-text-3 text-sm mb-6">Initial consultations are free for enterprise clients</p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Full Name" />
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Company Name" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Email Address" />
                <input type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Phone Number" />
              </div>
              <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                <option>Consultation Area</option>
                <option>Security Infrastructure</option>
                <option>Enterprise Deployment</option>
                <option>Marine / Boat Building</option>
                <option>Dredging Project</option>
                <option>Kitchen Installation</option>
                <option>General / Other</option>
              </select>
              <textarea rows={4} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Describe your project or requirements..." />
              <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                Request Consultation <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
