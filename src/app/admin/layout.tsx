"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const ADMIN_ROLES = ["super-admin", "store-manager", "accountant", "marketing-manager", "technical-team", "customer-support", "content-editor", "warehouse-staff", "location-manager", "sales-staff"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthStore();

  // Allow the login page to render without auth
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginPage) return;

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    if (!ADMIN_ROLES.includes(user.role)) {
      router.replace("/admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  // Login page renders without guard
  if (isLoginPage) return <>{children}</>;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue/30 border-t-blue rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-3">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong role
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
