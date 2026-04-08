"use client";

import { MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";
import { useCurrencyStore } from "@/store/currency-store";
import { useState } from "react";
import Link from "next/link";
import LocationOverrideModal from "@/components/geo/location-override-modal";

const currencies = ["NGN", "USD", "GBP", "EUR", "GHS", "CAD", "AUD", "ZAR", "KES", "JPY", "CNY"];

const topLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Affiliates", href: "/affiliate" },
  { label: "B2B/Wholesale", href: "/wholesale" },
  { label: "Track Order", href: "/track-order" },
];

export default function Topbar() {
  const { currency, setCurrency, detectedCity, detectedCountry } = useCurrencyStore();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <div className="bg-navy text-white/70 text-[11px] h-[34px] hidden lg:flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link href="/stores" className="flex items-center gap-1 hover:text-white transition-colors">
            <MapPin size={11} />
            <span>Find a Store</span>
          </Link>
          <span className="text-white/20">|</span>
          <a href="tel:+234800ROSHANAL" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone size={10} />
            <span>+234 800 ROSHANAL</span>
          </a>
          <span className="text-white/20">|</span>
          <a href="mailto:info@roshanalglobal.com" className="flex items-center gap-1 hover:text-white transition-colors">
            <Mail size={10} />
            <span>info@roshanalglobal.com</span>
          </a>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            <span>Mon-Sat 8AM-6PM WAT</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {topLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          <span className="text-white/20">|</span>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors font-medium"
            >
              {currency}
              <ChevronDown size={10} />
            </button>
            {currencyOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-strong border border-border py-1 z-50 min-w-[100px]">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setCurrencyOpen(false); localStorage.setItem("roshanal-currency-manual", "true"); }}
                    className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 transition-colors ${
                      c === currency ? "text-blue font-bold" : "text-text-2"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Mark currency as manually set when user picks from dropdown */}
            {/* (handled inline above via setCurrency + localStorage flag) */}
          </div>

          <span className="text-white/20">|</span>

          {/* Location Pill */}
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-0.5 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <MapPin size={10} />
            <span className="text-[10px]">{detectedCity}, {detectedCountry}</span>
          </button>
        </div>
      </div>

      {/* Location Override Modal */}
      <LocationOverrideModal
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </div>
  );
}
