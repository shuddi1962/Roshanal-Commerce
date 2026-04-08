"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shield,
  Check,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithOAuth, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<"customer" | "vendor">("customer");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    agreeTerms: false,
    agreeNewsletter: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    clearError();
    setIsSubmitting(true);
    try {
      const result = await signUp({
        email: form.email,
        password: form.password,
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
      });

      if (result.requireVerification) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        router.push("/account");
      }
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

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red", "bg-warning", "bg-blue", "bg-success"];

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-white/20" />
          <div className="absolute bottom-20 left-16 w-80 h-80 rounded-full border border-white/10" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-syne font-800 text-4xl mb-4">
              Join Roshanal<br />Global Today
            </h1>
            <p className="text-blue-200 text-lg max-w-md">
              Create your account and access thousands of professional security, marine, and safety products.
            </p>
          </div>
          <div className="space-y-4 mt-8">
            {[
              "Free account — no hidden fees",
              "Exclusive member-only discounts",
              "Earn loyalty points on every purchase",
              "Track orders in real time",
              "Save wishlists & quick reorder",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-300" />
                </div>
                <span className="text-blue-100 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Register Form */}
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
            <div className="mb-6">
              <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Create Account</h2>
              <p className="text-text-3 text-sm">Fill in your details to get started</p>
            </div>

            {/* Account Type Toggle */}
            <div className="flex bg-off-white rounded-lg p-1 mb-6">
              {(["customer", "vendor"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAccountType(type)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    accountType === type
                      ? "bg-white text-text-1 shadow-sm"
                      : "text-text-3 hover:text-text-2"
                  }`}
                >
                  {type === "customer" ? "Customer" : "Vendor / Seller"}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                      placeholder="First"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                    placeholder="Last"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>
              </div>

              {/* Vendor Shop Name */}
              {accountType === "vendor" && (
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Shop Name</label>
                  <input
                    type="text"
                    value={form.shopName}
                    onChange={(e) => handleChange("shopName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                    placeholder="Your store name"
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-4 hover:text-text-2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < strength ? strengthColors[strength - 1] : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-4 mt-1">
                      {strength > 0 ? strengthLabels[strength - 1] : "Too short"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                  placeholder="Re-enter your password"
                  required
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={form.agreeTerms}
                    onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-border text-blue focus:ring-blue/20"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-text-3">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-blue hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={form.agreeNewsletter}
                    onChange={(e) => handleChange("agreeNewsletter", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-border text-blue focus:ring-blue/20"
                  />
                  <label htmlFor="newsletter" className="text-sm text-text-3">
                    Send me exclusive deals and product updates
                  </label>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" variant="cta" className="w-full py-2.5" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create {accountType === "vendor" ? "Vendor" : ""} Account
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
                <span className="bg-white px-3 text-text-4">Or sign up with</span>
              </div>
            </div>

            {/* Social */}
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

            <p className="text-center text-sm text-text-3 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
