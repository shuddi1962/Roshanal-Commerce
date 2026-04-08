"use client";

import Link from "next/link";
import {
  Shield,
  Camera,
  Monitor,
  Wifi,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Home Basic",
    cameras: "4 Cameras",
    price: "₦350,000",
    features: ["4x 2MP Dome Cameras", "4-Channel DVR", "500GB Storage", "Mobile App Setup", "1-Year Warranty"],
  },
  {
    name: "Home Premium",
    cameras: "8 Cameras",
    price: "₦650,000",
    popular: true,
    features: ["8x 4MP IP Cameras", "8-Channel NVR", "2TB Storage", "Night Vision", "Remote Monitoring", "2-Year Warranty"],
  },
  {
    name: "Business Pro",
    cameras: "16 Cameras",
    price: "₦1,200,000",
    features: ["16x 4MP Bullet/Dome Mix", "16-Channel NVR", "4TB Storage", "AI Analytics", "PTZ Camera", "3-Year Warranty"],
  },
  {
    name: "Enterprise",
    cameras: "Custom",
    price: "Custom Quote",
    features: ["Unlimited Cameras", "Multi-Site Setup", "Cloud + Local Storage", "AI-Powered Analytics", "Dedicated Support", "5-Year Warranty"],
  },
];

export default function CCTVInstallationPage() {
  return (
    <div className="bg-off-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/services" className="hover:text-blue">Services</Link><span>/</span>
          <span className="text-text-1 font-medium">CCTV Installation</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-300" />
                <span className="text-blue-300 font-syne font-600 text-sm">Professional Installation</span>
              </div>
              <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
                CCTV & Surveillance Installation
              </h1>
              <p className="text-blue-200 text-lg mb-8">
                Protect your property with professional CCTV installation. HD/4K cameras, remote monitoring,
                night vision, and AI-powered analytics — installed by certified technicians.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="cta" size="lg" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
                  Book Installation <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Link href="/category/surveillance">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Browse Cameras
                  </Button>
                </Link>
              </div>
              <div className="flex gap-8 mt-8">
                <div><p className="font-syne font-800 text-2xl">2,500+</p><p className="text-xs text-blue-300">Installations</p></div>
                <div><p className="font-syne font-800 text-2xl">4.9</p><p className="text-xs text-blue-300">Average Rating</p></div>
                <div><p className="font-syne font-800 text-2xl">24/7</p><p className="text-xs text-blue-300">Support</p></div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-80 h-80 bg-blue-800/50 rounded-3xl flex items-center justify-center">
                <Camera className="w-32 h-32 text-blue-400/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Install */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">What We Install</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: "IP Cameras", desc: "2MP to 8MP, dome, bullet, PTZ" },
              { icon: Monitor, title: "NVR/DVR Systems", desc: "4 to 64 channels, local & cloud" },
              { icon: Wifi, title: "Remote Access", desc: "Mobile app, web portal, alerts" },
              { icon: Shield, title: "AI Analytics", desc: "Face recognition, intrusion detection" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl border border-border p-6 text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue" />
                  </div>
                  <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-3 text-center">Installation Packages</h2>
          <p className="text-text-3 text-center mb-10">Choose a package or request a custom quote</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`rounded-xl border p-6 ${pkg.popular ? "border-blue bg-blue-50/30 relative" : "border-border bg-white"}`}>
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue text-white text-xs font-syne font-600 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-syne font-700 text-lg text-text-1 mb-1">{pkg.name}</h3>
                <p className="text-sm text-text-3 mb-3">{pkg.cameras}</p>
                <p className="font-syne font-800 text-2xl text-blue mb-4">{pkg.price}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={pkg.popular ? "default" : "outline"} className="w-full" size="sm">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Book Your Installation</h2>
            <p className="text-text-3 text-sm mb-6">Fill in your details and we&apos;ll contact you within 24 hours</p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Full Name</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="email@company.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Phone</label>
                  <input type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="+234 800 000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Property Type</label>
                  <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="estate">Estate / Compound</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Installation Address</label>
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Full address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Additional Notes</label>
                <textarea rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Describe your requirements..." />
              </div>
              <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                Submit Booking Request <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
