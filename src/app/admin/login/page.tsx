"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const ADMIN_ROLES = ["super-admin", "store-manager", "accountant", "marketing-manager", "technical-team", "customer-support", "content-editor", "warehouse-staff", "location-manager", "sales-staff"];

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setError("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);

      // Check if user has admin role
      const { user } = useAuthStore.getState();
      if (!user || !ADMIN_ROLES.includes(user.role)) {
        setError("Access denied. This account does not have admin privileges.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError(useAuthStore.getState().error || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full border border-white/20" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-blue-500/10" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-syne font-800 text-2xl text-white mb-1">Roshanal Admin</h1>
          <p className="text-blue-300 text-sm">Staff & administrator access only</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-border p-8">
          <div className="mb-6">
            <h2 className="font-syne font-700 text-xl text-text-1 mb-1">Admin Sign In</h2>
            <p className="text-text-3 text-xs">Enter your staff credentials to access the admin panel</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-2 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors"
                  placeholder="admin@roshanalglobal.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-2 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-4 hover:text-text-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="default"
              className="w-full py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Access Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-center text-[11px] text-text-4">
              This area is restricted to authorized personnel only.
              <br />
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
