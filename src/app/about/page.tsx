"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Globe,
  Users,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Target,
  Zap,
  Heart,
  TrendingUp,
  Building2,
  Anchor,
  Flame,
  HardHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10+", label: "Years of Experience", icon: Clock },
  { value: "5,000+", label: "Products Available", icon: Shield },
  { value: "15,000+", label: "Customers Served", icon: Users },
  { value: "3", label: "Branches Nationwide", icon: MapPin },
  { value: "50+", label: "Team Members", icon: Building2 },
  { value: "20+", label: "Countries Shipped To", icon: Globe },
];

const services = [
  { icon: Shield, name: "Security Systems", desc: "CCTV, surveillance, access control" },
  { icon: Flame, name: "Fire Alarm Systems", desc: "Detection, alarm & suppression" },
  { icon: Anchor, name: "Marine & Boat Building", desc: "Engines, accessories & boat construction" },
  { icon: HardHat, name: "Safety Equipment", desc: "PPE, fire safety & emergency gear" },
  { icon: Zap, name: "Solar & Power", desc: "Solar panels, UPS & inverters" },
  { icon: Globe, name: "ICT & Networking", desc: "Switches, routers & infrastructure" },
];

const teamMembers = [
  { name: "Engr. Roshanal", role: "Founder & CEO", initials: "RG" },
  { name: "Adaobi Okonkwo", role: "Head of Operations", initials: "AO" },
  { name: "Chidi Nwankwo", role: "Technical Director", initials: "CN" },
  { name: "Fatima Aliyu", role: "Marketing Manager", initials: "FA" },
];

export default function AboutPage() {
  return (
    <div className="bg-off-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link>
          <span>/</span>
          <span className="text-text-1 font-medium">About Us</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden text-white py-20">
        <Image src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=800&fit=crop&q=80" alt="About Roshanal Global" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-syne font-600 text-sm mb-3 tracking-wide uppercase">About Roshanal Global</p>
            <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-6 leading-tight">
              Your Trusted Partner in Security, Marine & Professional Services
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              Roshanal Infotech Limited, trading as Roshanal Global, is a leading provider of security systems,
              marine products, safety equipment, and professional installation services. Based in Port Harcourt, Nigeria,
              we serve clients globally with enterprise-grade products and world-class service.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="cta" size="lg">
                  Explore Products <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl border border-border p-5 text-center">
                  <Icon className="w-6 h-6 text-blue mx-auto mb-3" />
                  <p className="font-syne font-800 text-2xl text-text-1">{stat.value}</p>
                  <p className="text-xs text-text-3 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-blue-50 rounded-2xl">
              <Target className="w-8 h-8 text-blue mb-4" />
              <h3 className="font-syne font-700 text-xl text-text-1 mb-3">Our Mission</h3>
              <p className="text-text-3 leading-relaxed">
                To provide premium-quality security, marine, and safety solutions backed by cutting-edge technology
                and exceptional customer service, making world-class products accessible to businesses and individuals across Africa and beyond.
              </p>
            </div>
            <div className="p-8 bg-green-50 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-success mb-4" />
              <h3 className="font-syne font-700 text-xl text-text-1 mb-3">Our Vision</h3>
              <p className="text-text-3 leading-relaxed">
                To become Africa&apos;s most trusted and innovative commerce platform for security, marine,
                and professional services — powered by AI automation and delivering unmatched customer experiences.
              </p>
            </div>
            <div className="p-8 bg-red-50 rounded-2xl">
              <Heart className="w-8 h-8 text-red mb-4" />
              <h3 className="font-syne font-700 text-xl text-text-1 mb-3">Our Values</h3>
              <p className="text-text-3 leading-relaxed">
                Integrity in every transaction. Excellence in every product. Innovation in every process.
                We believe in building lasting relationships through trust, quality, and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-syne font-800 text-3xl text-text-1 mb-3">What We Do</h2>
            <p className="text-text-3 max-w-xl mx-auto">
              From security systems to boat building, we offer comprehensive products and services across multiple industries.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="bg-white rounded-xl border border-border p-6 hover:border-blue/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue" />
                  </div>
                  <h3 className="font-syne font-700 text-lg text-text-1 mb-2">{service.name}</h3>
                  <p className="text-sm text-text-3">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-syne font-800 text-3xl text-text-1 mb-3">Our Team</h2>
            <p className="text-text-3">The people behind Roshanal Global</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <span className="font-syne font-700 text-2xl text-white">{member.initials}</span>
                </div>
                <h4 className="font-syne font-700 text-text-1">{member.name}</h4>
                <p className="text-sm text-text-3 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-syne font-800 text-3xl text-text-1 mb-3">Our Locations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Port Harcourt (HQ)", address: "14 Aba Road, Port Harcourt, Rivers State", phone: "+234 800 ROSHANAL", hours: "Mon–Sat 8AM–6PM" },
              { name: "Lagos", address: "25 Broad Street, Lagos Island, Lagos State", phone: "+234 800 ROSHANAL", hours: "Mon–Sat 8AM–6PM" },
              { name: "Bayelsa", address: "12 Mbiama Road, Yenagoa, Bayelsa State", phone: "+234 800 ROSHANAL", hours: "Mon–Sat 9AM–5PM" },
            ].map((branch) => (
              <div key={branch.name} className="bg-white rounded-xl border border-border p-6">
                <div className="w-full h-40 rounded-lg mb-4 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop" alt={branch.name} fill className="object-cover" unoptimized />
                </div>
                <h4 className="font-syne font-700 text-text-1 mb-2">{branch.name}</h4>
                <p className="text-sm text-text-3 mb-1">{branch.address}</p>
                <p className="text-sm text-text-3 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {branch.phone}
                </p>
                <p className="text-sm text-text-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {branch.hours}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=600&fit=crop&q=80" alt="CTA" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-syne font-800 text-3xl mb-4">Ready to Work With Us?</h2>
          <p className="text-blue-200 mb-8">
            Whether you need security systems, marine products, or professional services — we&apos;re here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/quote">
              <Button variant="cta" size="lg">Get a Quote</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
