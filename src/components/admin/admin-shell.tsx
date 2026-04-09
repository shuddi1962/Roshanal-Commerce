"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Image,
  Layers,
  Shield,
  Store,
  CreditCard,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  Truck,
  Wrench,
  Megaphone,
  Palette,
  Globe,
  Plug,
  Heart,
  AlertTriangle,
  Menu,
  ExternalLink,
  ArrowLeft,
  Gift,
  Ticket,
  BarChart3,
  Navigation,
  Anchor,
} from "lucide-react";

const sidebarSections = [
  {
    title: "Commerce",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Products", icon: Package, href: "/admin/products" },
      { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
      { label: "Customers", icon: Users, href: "/admin/customers" },
      { label: "Inventory", icon: Layers, href: "/admin/inventory" },
      { label: "Reviews", icon: Heart, href: "/admin/reviews" },
      { label: "Gift Cards", icon: Gift, href: "/admin/gift-cards" },
      { label: "Coupons", icon: Ticket, href: "/admin/coupons" },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Quotes", icon: FileText, href: "/admin/quotes" },
      { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
      { label: "POS", icon: CreditCard, href: "/admin/pos" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Campaigns", icon: Megaphone, href: "/admin/marketing" },
      { label: "Banners", icon: Image, href: "/admin/banners" },
      { label: "SEO Tools", icon: Search, href: "/admin/seo" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Payments & P&L", icon: CreditCard, href: "/admin/finance" },
    ],
  },
  {
    title: "Customers & CRM",
    items: [
      { label: "CRM Pipeline", icon: Users, href: "/admin/crm" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Delivery", icon: Truck, href: "/admin/delivery" },
      { label: "Warranty", icon: Shield, href: "/admin/warranty" },
      { label: "Field Team", icon: Wrench, href: "/admin/field-team" },
    ],
  },
  {
    title: "AI & Automation",
    items: [
      { label: "AI Tools", icon: Globe, href: "/admin/ai" },
    ],
  },
  {
    title: "Content & Design",
    items: [
      { label: "Homepage Builder", icon: Palette, href: "/admin/homepage" },
      { label: "Page Builder", icon: FileText, href: "/admin/pages" },
      { label: "Menu Builder", icon: Navigation, href: "/admin/menu" },
      { label: "Banner Builder", icon: Image, href: "/admin/banners/builder" },
      { label: "Footer Builder", icon: Layers, href: "/admin/footer" },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { label: "Vendors", icon: Store, href: "/admin/vendors" },
      { label: "Vendor Ads", icon: Megaphone, href: "/admin/vendor-ads" },
      { label: "Boat Configurator", icon: Anchor, href: "/admin/boat-configurator" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", icon: Settings, href: "/admin/settings" },
      { label: "Roles", icon: Shield, href: "/admin/roles" },
      { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
      { label: "Feature Flags", icon: Plug, href: "/admin/features" },
      { label: "Site Doctor", icon: AlertTriangle, href: "/admin/site-doctor" },
    ],
  },
];

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${
        sidebarCollapsed ? "w-[68px]" : "w-[250px]"
      } bg-navy text-white/80 flex flex-col shrink-0 overflow-y-auto fixed lg:relative h-full z-50 ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } transition-all duration-300`}>
        <div className="h-[60px] px-4 flex items-center gap-2.5 border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="font-bold text-xs text-white leading-tight tracking-tight">ROSHANAL</div>
                <div className="text-[9px] text-red font-medium">Admin Panel</div>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-1">
              {!sidebarCollapsed && (
                <p className="px-4 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-[13px] transition-colors ${
                      isActive
                        ? "bg-white/10 text-white font-medium"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon size={16} className="shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-3 border-t border-white/10 shrink-0">
            <Link href="/" target="_blank" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs py-2 transition-colors">
              <ExternalLink size={14} />
              <span>View Storefront</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-[60px] flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-text-3" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} className="text-text-3" /> : <ChevronLeft size={18} className="text-text-3" />}
            </button>

            {/* Back Button + Title */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-text-4 hover:text-blue text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="border-l border-gray-200 pl-3 hidden sm:block">
              <h1 className="font-bold text-base text-text-1 leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-text-4 -mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-52 pl-9 pr-3 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={18} className="text-text-3" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-blue-600 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">SA</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-text-1 leading-tight">Super Admin</p>
                <p className="text-[10px] text-text-4">admin@roshanalglobal.com</p>
              </div>
              <ChevronDown size={14} className="text-text-4 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Mobile Title */}
          <div className="sm:hidden mb-4">
            <h1 className="font-bold text-lg text-text-1">{title}</h1>
            {subtitle && <p className="text-xs text-text-4">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
