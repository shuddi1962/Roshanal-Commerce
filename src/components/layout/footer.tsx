"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Globe,
  MessageCircle,
  Camera,
  Briefcase,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", url: "/shop" },
      { label: "New Arrivals", url: "/new-arrivals" },
      { label: "Deals & Offers", url: "/deals" },
      { label: "Brands", url: "/brands" },
      { label: "Gift Cards", url: "/shop" },
      { label: "Boat Engines", url: "/category/boat-engines" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "CCTV Installation", url: "/services/cctv-installation" },
      { label: "Fire Alarm", url: "/services/fire-alarm" },
      { label: "Kitchen Installation", url: "/services/kitchen-installation" },
      { label: "Boat Building", url: "/services/boat-building" },
      { label: "Dredging Services", url: "/services/dredging" },
      { label: "Maintenance", url: "/services/maintenance" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", url: "/help" },
      { label: "FAQ", url: "/faq" },
      { label: "Track Order", url: "/track-order" },
      { label: "Returns & Refunds", url: "/help" },
      { label: "Warranty", url: "/help" },
      { label: "Contact Us", url: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", url: "/about" },
      { label: "Blog", url: "/blog" },
      { label: "Affiliate Program", url: "/affiliate" },
      { label: "B2B/Wholesale", url: "/wholesale" },
      { label: "Vendor Marketplace", url: "/vendor/dashboard" },
      { label: "Store Locator", url: "/stores" },
    ],
  },
];

const socialLinks = [
  { icon: Globe, url: "#", label: "Facebook" },
  { icon: MessageCircle, url: "#", label: "Twitter" },
  { icon: Camera, url: "#", label: "Instagram" },
  { icon: Briefcase, url: "#", label: "LinkedIn" },
  { icon: Play, url: "#", label: "YouTube" },
];

const paymentLogos = ["Visa", "Mastercard", "Paystack", "Flutterwave", "Stripe", "Bitcoin"];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-navy text-white/70">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl text-white tracking-tight">Stay Updated</h3>
              <p className="text-sm text-white/40 mt-1">Get the latest deals, new products & industry insights.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-80">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-blue backdrop-blur-sm"
                />
              </div>
              <Button variant="cta" className="h-11 px-6 shrink-0">
                Subscribe <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full max-w-[1440px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">RS</span>
              </div>
              <div>
                <div className="font-bold text-[16px] text-white leading-tight tracking-tight">
                  ROSHANAL GLOBAL
                </div>
                <div className="text-[9px] text-red font-semibold -mt-0.5 uppercase">
                  Infotech Limited
                </div>
              </div>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Your trusted partner for security systems, marine accessories, safety equipment,
              and professional installation services. Serving clients globally from Port Harcourt, Nigeria.
            </p>
            <div className="space-y-2.5 text-sm text-white/50">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-blue-400 shrink-0" />
                <span>14 Aba Road, Port Harcourt, Rivers State</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <span>+234 800 ROSHANAL</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span>info@roshanalglobal.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-blue-400 shrink-0" />
                <span>Mon-Sat 8AM-6PM WAT</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.url + link.label}>
                    <Link
                      href={link.url}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Roshanal Infotech Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/about" className="text-xs text-white/30 hover:text-white/60 transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-2">
            {paymentLogos.map((logo) => (
              <div
                key={logo}
                className="h-6 px-2 bg-white/5 rounded text-[9px] font-mono text-white/30 flex items-center"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
