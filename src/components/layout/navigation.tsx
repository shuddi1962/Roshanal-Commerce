"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Shield,
  Flame,
  Fingerprint,
  Sun,
  Wifi,
  Monitor,
  Anchor,
  HardHat,
  Shovel,
  ChefHat,
  Ship,
  Cog,
  Menu,
  X,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";

const departments = [
  {
    name: "Surveillance & CCTV",
    slug: "surveillance",
    icon: Shield,
    featured: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    subcategories: [
      { name: "IP Cameras", slug: "ip-cameras" },
      { name: "Dome Cameras", slug: "dome-cameras" },
      { name: "Bullet Cameras", slug: "bullet-cameras" },
      { name: "PTZ Cameras", slug: "ptz-cameras" },
      { name: "NVR Systems", slug: "nvr-systems" },
      { name: "DVR Systems", slug: "dvr-systems" },
      { name: "Camera Accessories", slug: "camera-accessories" },
    ],
  },
  {
    name: "Fire Alarm Systems",
    slug: "fire-alarm",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Smoke Detectors", slug: "smoke-detectors" },
      { name: "Heat Detectors", slug: "heat-detectors" },
      { name: "Fire Alarm Panels", slug: "fire-alarm-panels" },
      { name: "Manual Call Points", slug: "manual-call-points" },
      { name: "Fire Extinguishers", slug: "fire-extinguishers" },
    ],
  },
  {
    name: "Access Control",
    slug: "access-control",
    icon: Fingerprint,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Biometric Terminals", slug: "biometric-terminals" },
      { name: "Card Readers", slug: "card-readers" },
      { name: "Door Locks", slug: "door-locks" },
      { name: "Turnstiles", slug: "turnstiles" },
      { name: "Intercom Systems", slug: "intercom-systems" },
    ],
  },
  {
    name: "Solar & Power",
    slug: "solar-systems",
    icon: Sun,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Solar Panels", slug: "solar-panels" },
      { name: "Inverters", slug: "inverters" },
      { name: "Batteries", slug: "batteries" },
      { name: "Solar Kits", slug: "solar-kits" },
    ],
  },
  {
    name: "Networking",
    slug: "networking",
    icon: Wifi,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Switches", slug: "switches" },
      { name: "Routers", slug: "routers" },
      { name: "Access Points", slug: "access-points" },
      { name: "Cables & Connectors", slug: "cables-connectors" },
    ],
  },
  {
    name: "ICT Equipment",
    slug: "ict-equipment",
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Servers", slug: "servers" },
      { name: "Workstations", slug: "workstations" },
      { name: "Printers", slug: "printers" },
      { name: "Monitors", slug: "monitors" },
    ],
  },
  {
    name: "Marine Accessories",
    slug: "marine-accessories",
    icon: Anchor,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Navigation Lights", slug: "navigation-lights" },
      { name: "Bilge Pumps", slug: "bilge-pumps" },
      { name: "Anchors & Chains", slug: "anchors-chains" },
      { name: "Marine Electronics", slug: "marine-electronics" },
    ],
  },
  {
    name: "Boat Engines",
    slug: "boat-engines",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Outboard Engines", slug: "outboard-engines" },
      { name: "Inboard Engines", slug: "inboard-engines" },
      { name: "Engine Parts", slug: "engine-parts" },
      { name: "Propellers", slug: "propellers" },
    ],
  },
  {
    name: "Safety Equipment",
    slug: "safety-equipment",
    icon: HardHat,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Hard Hats", slug: "hard-hats" },
      { name: "Safety Vests", slug: "safety-vests" },
      { name: "Respirators", slug: "respirators" },
      { name: "Life Jackets", slug: "life-jackets" },
    ],
  },
  {
    name: "Dredging Equipment",
    slug: "dredging-equipment",
    icon: Shovel,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Dredgers", slug: "dredgers" },
      { name: "Pumps", slug: "pumps" },
      { name: "Pipes & Fittings", slug: "pipes-fittings" },
    ],
  },
  {
    name: "Kitchen Equipment",
    slug: "kitchen-equipment",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Commercial Ovens", slug: "commercial-ovens" },
      { name: "Extraction Hoods", slug: "extraction-hoods" },
      { name: "Outdoor Grills", slug: "outdoor-grills" },
      { name: "Kitchen Fittings", slug: "kitchen-fittings" },
    ],
  },
  {
    name: "UPS & Inverters",
    slug: "ups-inverters",
    icon: Cog,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop",
    subcategories: [
      { name: "UPS Systems", slug: "ups-systems" },
      { name: "Inverters", slug: "power-inverters" },
      { name: "Stabilizers", slug: "stabilizers" },
    ],
  },
];

const mainNav = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/shop?sort=bestselling" },
      { label: "Brands", href: "/brands" },
    ],
  },
  {
    label: "Deals",
    href: "/deals",
    children: [
      { label: "Flash Sales", href: "/deals" },
      { label: "Clearance", href: "/deals" },
      { label: "Bundle Deals", href: "/deals" },
    ],
  },
  { label: "New Arrivals", href: "/new-arrivals" },
  {
    label: "Brands",
    href: "/brands",
    children: [
      { label: "Hikvision", href: "/brands" },
      { label: "Dahua", href: "/brands" },
      { label: "Yamaha", href: "/brands" },
      { label: "Bosch", href: "/brands" },
      { label: "All Brands", href: "/brands" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "CCTV Installation", href: "/services/cctv-installation" },
      { label: "Fire Alarm Installation", href: "/services/fire-alarm" },
      { label: "Access Control", href: "/services/access-control" },
      { label: "Kitchen Installation", href: "/services/kitchen-installation" },
      { label: "Boat Building", href: "/services/boat-building" },
      { label: "Dredging Services", href: "/services/dredging" },
      { label: "Maintenance", href: "/services/maintenance" },
      { label: "Consultation", href: "/services/consultation" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [deptOpen, setDeptOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const hoveredDept = departments.find((d) => d.slug === activeDept);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-blue hidden lg:block">
        <div className="w-full max-w-[1440px] mx-auto px-4 flex items-center h-12">
          {/* ALL DEPARTMENTS - Mega Menu */}
          <div className="relative"
            onMouseLeave={() => { setDeptOpen(false); setActiveDept(null); }}
          >
            <button
              onMouseEnter={() => setDeptOpen(true)}
              className="bg-red hover:bg-red-600 text-white h-12 px-6 flex items-center gap-2 font-semibold text-sm transition-colors"
            >
              <LayoutGrid size={16} />
              All Departments
              <ChevronDown size={14} className={`transition-transform ${deptOpen ? "rotate-180" : ""}`} />
            </button>

            {deptOpen && (
              <div className="absolute top-full left-0 bg-white rounded-b-lg shadow-strong z-50 flex" style={{ width: "820px" }}>
                {/* Department List */}
                <div className="w-[260px] border-r border-border py-2">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <div
                        key={dept.slug}
                        onMouseEnter={() => setActiveDept(dept.slug)}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                          activeDept === dept.slug ? "bg-blue-50 text-blue" : "text-text-2 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={16} className={activeDept === dept.slug ? "text-blue" : "text-text-4"} />
                        <span className="text-sm font-medium flex-1">{dept.name}</span>
                        <ChevronRight size={14} className="text-text-4" />
                        {dept.featured && (
                          <span className="text-[9px] bg-red/10 text-red px-1.5 py-0.5 rounded-full font-bold">
                            HOT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Subcategories + Banner */}
                <div className="flex-1 p-5">
                  {hoveredDept ? (
                    <div>
                      <h3 className="font-bold text-base text-text-1 mb-3">{hoveredDept.name}</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                        {hoveredDept.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${hoveredDept.slug}`}
                            className="text-sm text-text-3 hover:text-blue transition-colors py-1"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                      {/* Category Banner Image */}
                      <div className="relative rounded-lg overflow-hidden h-[140px] mt-3">
                        <Image
                          src={hoveredDept.image}
                          alt={hoveredDept.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent flex items-center">
                          <div className="pl-5">
                            <p className="text-white font-bold text-sm">Shop {hoveredDept.name}</p>
                            <Link
                              href={`/category/${hoveredDept.slug}`}
                              className="text-xs text-blue-200 hover:text-white mt-1 inline-flex items-center gap-1 transition-colors"
                            >
                              View All <ChevronRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-text-4 text-sm">
                      Hover a department to see subcategories
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Nav Links */}
          <div className="flex items-center h-full ml-1">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className="relative h-full"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 h-full px-4 text-white/90 hover:text-white text-[13px] font-medium transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown size={12} />}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-white rounded-b-lg shadow-strong border border-border z-50 min-w-[200px] py-1 animate-slide-down">
                    {item.children.map((child) => (
                      <Link
                        key={child.href + child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-text-2 hover:bg-blue-50 hover:text-blue transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-blue px-4 h-12 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white flex items-center gap-2"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-sm font-semibold">Menu</span>
        </button>
        <Link href="/shop" className="text-white text-sm font-semibold">
          Shop All
        </Link>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-[85%] max-w-[360px] bg-white h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-blue-700 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RS</span>
                </div>
                <span className="font-bold text-sm">ROSHANAL GLOBAL</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-3">
              {/* Departments with expandable subcategories */}
              <p className="px-3 py-2 text-xs text-text-4 font-bold uppercase tracking-wider">Departments</p>
              {departments.map((dept) => {
                const Icon = dept.icon;
                const isExpanded = mobileExpanded === dept.slug;
                return (
                  <div key={dept.slug}>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : dept.slug)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Icon size={16} className="text-text-4" />
                      <span className="text-sm text-text-2 font-medium flex-1 text-left">{dept.name}</span>
                      <ChevronDown size={14} className={`text-text-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    {isExpanded && (
                      <div className="pl-10 pb-2 space-y-1">
                        <Link
                          href={`/category/${dept.slug}`}
                          className="block text-sm text-blue font-medium py-1.5"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          View All {dept.name}
                        </Link>
                        {dept.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${dept.slug}`}
                            className="block text-sm text-text-3 py-1.5"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="border-t border-border my-3" />
              <p className="px-3 py-2 text-xs text-text-4 font-bold uppercase tracking-wider">Navigate</p>
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-3 text-sm text-text-2 font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
