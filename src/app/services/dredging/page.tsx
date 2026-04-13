"use client";

import Link from "next/link";
import {
  Shovel,
  ArrowRight,
  Ship,
  MapPin,
  FileText,
  Camera,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  { title: "Capital Dredging", desc: "Creating new waterways, channels, and harbors for navigation and construction projects" },
  { title: "Maintenance Dredging", desc: "Removing sediment buildup to maintain navigable depths in existing channels and ports" },
  { title: "Land Reclamation", desc: "Creating new land from water bodies using dredged material for development projects" },
  { title: "Beach Nourishment", desc: "Restoring eroded beaches by depositing sand from offshore or other sources" },
  { title: "Environmental Dredging", desc: "Removing contaminated sediments to restore aquatic ecosystems and water quality" },
  { title: "Mining Dredging", desc: "Extracting valuable minerals and materials from underwater deposits" },
];

const pastProjects = [
  { name: "Bonny Channel Deepening", location: "Bonny, Rivers State", type: "Capital Dredging", year: "2025", image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&h=300&fit=crop&q=80" },
  { name: "Lagos Port Maintenance", location: "Apapa, Lagos", type: "Maintenance Dredging", year: "2025", image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=300&fit=crop&q=80" },
  { name: "Yenagoa Waterway Project", location: "Bayelsa State", type: "Land Reclamation", year: "2024", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&q=80" },
  { name: "Warri River Cleanup", location: "Delta State", type: "Environmental Dredging", year: "2024", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=300&fit=crop&q=80" },
  { name: "Onne Port Expansion", location: "Eleme, Rivers State", type: "Capital Dredging", year: "2024", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=300&fit=crop&q=80" },
  { name: "Escravos Bar Dredging", location: "Warri, Delta State", type: "Mining Dredging", year: "2023", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=300&fit=crop&q=80" },
];

export default function DredgingServicePage() {
  return (
    <div className="bg-off-white">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/services" className="hover:text-blue">Services</Link><span>/</span>
          <span className="text-text-1 font-medium">Dredging Services</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=700&fit=crop&q=80" alt="Dredging operations" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-amber-900/70" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shovel className="w-5 h-5 text-amber-300" />
                <span className="text-amber-300 font-syne font-600 text-sm">Project-Based Services</span>
              </div>
              <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
                Professional Dredging Services
              </h1>
              <p className="text-amber-200 text-lg mb-8">
                Complete dredging solutions for waterways, ports, and marine construction.
                Professional equipment, experienced crew, and environmental compliance guaranteed.
              </p>
              <Button variant="cta" size="lg" onClick={() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth" })}>
                Submit Project Brief <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=500&h=500&fit=crop&q=80" alt="Dredging equipment" className="w-80 h-80 rounded-3xl object-cover shadow-2xl border-4 border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-3 text-center">Our Capabilities</h2>
          <p className="text-text-3 text-center mb-10">Comprehensive dredging solutions for every need</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-syne font-700 text-text-1 mb-2">{cap.title}</h3>
                <p className="text-sm text-text-3">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-3 text-center">Our Equipment Fleet</h2>
          <p className="text-text-3 text-center mb-10">Modern, well-maintained dredging equipment for every project scale</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Cutter Suction Dredger", desc: "For hard soil and rock dredging", image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=400&h=300&fit=crop&q=80" },
              { name: "Trailing Suction Hopper", desc: "For large-volume maintenance dredging", image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&h=300&fit=crop&q=80" },
              { name: "Backhoe Dredger", desc: "For precision nearshore dredging", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop&q=80" },
              { name: "Survey & Support Vessels", desc: "Hydrographic survey and crew boats", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&q=80" },
            ].map((equip) => (
              <div key={equip.name} className="rounded-xl border border-border overflow-hidden group">
                <div className="h-40 relative overflow-hidden">
                  <img src={equip.image} alt={equip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-syne font-700 text-sm text-text-1">{equip.name}</h3>
                  <p className="text-xs text-text-3 mt-1">{equip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-off-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-10 text-center">Project Process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: FileText, step: "01", title: "Project Brief", desc: "Submit requirements and project details" },
              { icon: MapPin, step: "02", title: "Site Visit", desc: "On-site survey and environmental assessment" },
              { icon: ClipboardList, step: "03", title: "Quote & Contract", desc: "Detailed quotation and contract agreement" },
              { icon: Ship, step: "04", title: "Execution", desc: "Equipment deployment and project execution" },
              { icon: Camera, step: "05", title: "Completion", desc: "Final survey, report, and handover" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <span className="font-syne font-800 text-xs text-amber-600">STEP {item.step}</span>
                  <h3 className="font-syne font-700 text-text-1 mt-1 mb-2">{item.title}</h3>
                  <p className="text-xs text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Past Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Past Projects</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {pastProjects.map((project) => (
              <div key={project.name} className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="h-40 relative">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-syne font-700 text-text-1 mb-1">{project.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-text-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.location}</span>
                    <span>{project.year}</span>
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                    {project.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Brief Form */}
      <section id="brief" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-off-white rounded-2xl border border-border p-8">
            <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Submit Project Brief</h2>
            <p className="text-text-3 text-sm mb-6">Tell us about your project and we&apos;ll arrange a site visit</p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Company / Client Name" />
                <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Email Address" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Phone Number" />
                <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                  <option>Dredging Type</option>
                  <option>Capital Dredging</option>
                  <option>Maintenance Dredging</option>
                  <option>Land Reclamation</option>
                  <option>Beach Nourishment</option>
                  <option>Environmental Dredging</option>
                  <option>Mining Dredging</option>
                  <option>Other</option>
                </select>
              </div>
              <input type="text" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Project Location" />
              <textarea rows={4} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Project description: scope, estimated volume, timeline, and any special requirements..." />
              <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                Submit Brief <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
