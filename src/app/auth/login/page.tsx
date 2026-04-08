"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Smartphone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/account");
    } catch {
      // error is set in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    try {
      await signInWithOAuth(provider);
    } catch {
      // error is set in the store
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border border-white/20" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-500/10" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-syne font-800 text-4xl mb-4">
              Welcome Back to<br />Roshanal Global
            </h1>
            <p className="text-blue-200 text-lg max-w-md">
              Your trusted partner for security systems, marine products, safety equipment, and professional services worldwide.
            </p>
          </div>
          <div className="space-y-4 mt-8">
            {[
              "Track orders & manage deliveries",
              "Access exclusive deals & loyalty rewards",
              "Manage wishlists & saved items",
              "Quick reorders from order history",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-blue-300" />
                </div>
                <span className="text-blue-100 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-syne font-700 text-xl text-text-1">Roshanal Global</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <div className="mb-8">
              <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Sign In</h2>
              <p className="text-text-3 text-sm">Enter your credentials to access your account</p>
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text-2">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-blue hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-blue focus:ring-blue/20"
                />
                <label htmlFor="remember" className="text-sm text-text-3">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="cta"
                className="w-full py-2.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-text-4">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth("google")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-text-2 hover:bg-off-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                Google
              </button>
              <button
                onClick={() => handleOAuth("github")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-text-2 hover:bg-off-white transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                GitHub
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-text-3 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          {/* Vendor Login */}
          <div className="mt-4 text-center">
            <Link
              href="/vendor/login"
              className="text-sm text-text-3 hover:text-blue transition-colors"
            >
              Vendor? Sign in to your vendor dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
