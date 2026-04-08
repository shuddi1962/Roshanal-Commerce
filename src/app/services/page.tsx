"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Flame,
  Fingerprint,
  ChefHat,
  Ship,
  Wrench,
  Phone,
  ArrowRight,
  Shovel,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Shield,
    title: "CCTV & Surveillance Installation",
    description: "Professional installation of IP cameras, DVR/NVR systems, and complete surveillance solutions for homes and businesses.",
    href: "/services/cctv-installation",
    features: ["Site survey & design", "HD/4K camera setup", "Remote viewing config", "24/7 monitoring"],
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Flame,
    title: "Fire Alarm Installation",
    description: "Complete fire detection and alarm system installation — conventional and addressable systems for all building types.",
    href: "/services/fire-alarm",
    features: ["System design", "Smoke/heat detectors", "Control panel setup", "Compliance certification"],
    color: "from-red-500 to-red-700",
  },
  {
    icon: Fingerprint,
    title: "Access Control Installation",
    description: "Biometric, card-based, and smart access control systems for offices, factories, estates, and restricted areas.",
    href: "/services/access-control",
    features: ["Biometric terminals", "Card/fob systems", "Gate automation", "Software integration"],
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Ship,
    title: "Boat Building",
    description: "Custom marine vessel construction — from fishing boats to patrol boats. 16+ vessel types with full configuration and 3D preview.",
    href: "/services/boat-building",
    features: ["16 vessel types", "Material selection", "Engine integration", "3D visualization"],
    color: "from-cyan-500 to-cyan-700",
  },
  {
    icon: ChefHat,
    title: "Kitchen Installation",
    description: "Indoor, outdoor, and commercial kitchen installation services. Complete design, equipment, and setup for any kitchen project.",
    href: "/services/kitchen-installation",
    features: ["Indoor/outdoor/commercial", "Full design service", "Equipment supply", "Post-install support"],
    color: "from-orange-500 to-orange-700",
  },
  {
    icon: Shovel,
    title: "Dredging Services",
    description: "Project-based dredging services for waterways, ports, and marine construction. Professional equipment and experienced crew.",
    href: "/services/dredging",
    features: ["Site assessment", "Equipment deployment", "Environmental compliance", "Project management"],
    color: "from-amber-600 to-amber-800",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Annual maintenance contracts for all installed systems. Regular servicing, priority support, and discounted repairs.",
    href: "/services/maintenance",
    features: ["Preventive maintenance", "Emergency response", "System upgrades", "Priority support"],
    color: "from-green-500 to-green-700",
  },
  {
    icon: Phone,
    title: "B2B Consultation",
    description: "Expert consultation for enterprise security, marine operations, and large-scale installations. Tailored solutions for your business.",
    href: "/services/consultation",
    features: ["Needs assessment", "Solution design", "Budget planning", "Project oversight"],
    color: "from-indigo-500 to-indigo-700",
  },
];

export default function ServicesHubPage() {
  return (
    <div className="bg-off-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link>
          <span>/</span>
          <span className="text-text-1 font-medium">Services</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden text-white py-20">
        <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=800&fit=crop&q=80" alt="Professional Services" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-syne font-600 text-sm mb-3 tracking-wide uppercase">Professional Services</p>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              Expert Installation, Building & Maintenance Services
            </h1>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              From CCTV installation to boat building, our certified technicians deliver world-class service with guaranteed quality.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Certified Technicians
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <Clock className="w-4 h-4 text-blue-300" />
                Same-Day Scheduling
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <Star className="w-4 h-4 text-yellow-400" />
                4.9 Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="bg-white rounded-2xl border border-border p-6 hover:border-blue/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-syne font-700 text-lg text-text-1 group-hover:text-blue transition-colors mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-text-3 mb-4 leading-relaxed">{service.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-xs text-text-3">
                            <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm text-blue font-medium">
                        Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-syne font-800 text-3xl text-text-1 mb-3">How It Works</h2>
            <p className="text-text-3 max-w-xl mx-auto">Simple 4-step process from booking to completion</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Book a Service", desc: "Fill out the booking form with your requirements and preferred schedule" },
              { step: "02", title: "Site Survey", desc: "Our technical team visits your location for assessment and design" },
              { step: "03", title: "Quote & Approval", desc: "Receive a detailed quote. Pay deposit to confirm and schedule" },
              { step: "04", title: "Installation", desc: "Professional installation with testing, training, and warranty" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <span className="font-syne font-800 text-blue">{item.step}</span>
                </div>
                <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                <p className="text-sm text-text-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-navy to-blue-800 rounded-2xl p-10 text-white">
            <h2 className="font-syne font-800 text-3xl mb-4">Need a Custom Solution?</h2>
            <p className="text-blue-200 mb-8 max-w-lg mx-auto">
              For large-scale projects, enterprise deployments, or custom requirements — talk to our team.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/quote">
                <Button variant="cta" size="lg">Get a Free Quote</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-1" /> Call Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
