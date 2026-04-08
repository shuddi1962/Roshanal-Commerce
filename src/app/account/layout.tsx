"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  Wallet,
  Trophy,
  MapPin,
  RotateCcw,
  Settings,
  Bell,
  Users,
  GitCompare,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const sidebarLinks = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Compare", href: "/account/compare", icon: GitCompare },
  { label: "Wallet", href: "/account/wallet", icon: Wallet },
  { label: "Loyalty & Rewards", href: "/account/loyalty", icon: Trophy },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Returns & RMA", href: "/account/returns", icon: RotateCcw },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Affiliate Dashboard", href: "/account/affiliate", icon: Users },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-off-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-3">
            <Link href="/" className="hover:text-blue">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-1 font-medium">My Account</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-border p-5 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-syne font-700 text-lg">
                  JD
                </div>
                <div>
                  <h3 className="font-syne font-700 text-sm text-text-1">John Doe</h3>
                  <p className="text-xs text-text-3">john@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-blue" />
                <span className="text-xs font-medium text-blue">Gold Member</span>
                <span className="text-xs text-text-4 ml-auto">2,450 pts</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-xl border border-border overflow-hidden">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-border last:border-b-0 transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue font-medium border-l-2 border-l-blue"
                        : "text-text-2 hover:bg-off-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <button className="flex items-center gap-3 px-4 py-3 text-sm text-red hover:bg-red-50 w-full transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
