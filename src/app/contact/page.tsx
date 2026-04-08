"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const branches = [
  {
    name: "Port Harcourt (HQ)",
    address: "14 Aba Road, Port Harcourt, Rivers State, Nigeria",
    phone: "+234 800 ROSHANAL",
    email: "phc@roshanalglobal.com",
    hours: "Monday – Saturday: 8AM – 6PM WAT",
  },
  {
    name: "Lagos Office",
    address: "25 Broad Street, Lagos Island, Lagos State, Nigeria",
    phone: "+234 800 ROSHANAL",
    email: "lagos@roshanalglobal.com",
    hours: "Monday – Saturday: 8AM – 6PM WAT",
  },
  {
    name: "Bayelsa Office",
    address: "12 Mbiama Road, Yenagoa, Bayelsa State, Nigeria",
    phone: "+234 800 ROSHANAL",
    email: "bayelsa@roshanalglobal.com",
    hours: "Monday – Saturday: 9AM – 5PM WAT",
  },
];

const departments = [
  { name: "Sales & Inquiries", email: "sales@roshanalglobal.com", icon: MessageCircle },
  { name: "Technical Support", email: "support@roshanalglobal.com", icon: Globe },
  { name: "B2B / Wholesale", email: "b2b@roshanalglobal.com", icon: Building2 },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-off-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link>
          <span>/</span>
          <span className="text-text-1 font-medium">Contact Us</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden text-white py-16">
        <Image src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=600&fit=crop&q=80" alt="Contact Us" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-syne font-800 text-4xl mb-3">Get in Touch</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Have a question or need a quote? Our team is ready to assist you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-8">
              <h2 className="font-syne font-700 text-xl text-text-1 mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-success" />
                  </div>
                  <h3 className="font-syne font-700 text-xl text-text-1 mb-2">Message Sent!</h3>
                  <p className="text-text-3 mb-6">We&apos;ll get back to you within 24 hours.</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-2 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-2 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-2 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-2 mb-1.5">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="sales">Sales / Product Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="quote">Request a Quote</option>
                        <option value="service">Service Booking</option>
                        <option value="b2b">B2B / Wholesale</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-2 mb-1.5">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <Button type="submit" variant="cta" className="w-full sm:w-auto px-8">
                    Send Message <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-syne font-700 text-lg text-text-1 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-1">Main Office</p>
                    <p className="text-sm text-text-3">14 Aba Road, Port Harcourt, Rivers State, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-1">Phone</p>
                    <p className="text-sm text-text-3">+234 800 ROSHANAL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-1">Email</p>
                    <p className="text-sm text-text-3">info@roshanalglobal.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-1">Business Hours</p>
                    <p className="text-sm text-text-3">Mon – Sat: 8AM – 6PM WAT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-syne font-700 text-lg text-text-1 mb-4">Departments</h3>
              <div className="space-y-3">
                {departments.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <div key={dept.name} className="flex items-center gap-3 p-3 bg-off-white rounded-lg">
                      <Icon className="w-4 h-4 text-blue flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-text-1">{dept.name}</p>
                        <p className="text-xs text-text-3">{dept.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="h-48 relative">
                <Image src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=300&fit=crop" alt="Map" fill className="object-cover" unoptimized />
              </div>
              <div className="p-4">
                <Link href="/stores" className="text-sm text-blue font-medium hover:underline flex items-center gap-1">
                  View all store locations <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Cards */}
        <section className="mt-12">
          <h2 className="font-syne font-700 text-2xl text-text-1 mb-6">Our Branches</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div key={branch.name} className="bg-white rounded-xl border border-border p-6 hover:border-blue/30 transition-colors">
                <h4 className="font-syne font-700 text-text-1 mb-3">{branch.name}</h4>
                <div className="space-y-2 text-sm text-text-3">
                  <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-text-4" /> {branch.address}</p>
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0 text-text-4" /> {branch.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0 text-text-4" /> {branch.email}</p>
                  <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 flex-shrink-0 text-text-4" /> {branch.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
