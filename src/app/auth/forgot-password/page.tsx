"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const { error } = await insforge.auth.sendResetPasswordEmail({ email });
      if (error) { setError(error.message); setIsSubmitting(false); return; }
      setSent(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-xs text-text-3 hover:text-text-1 mb-6">
            <ArrowLeft size={14} /> Back to login
          </Link>

          {!sent ? (
            <>
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6 text-blue" />
                </div>
                <h2 className="font-syne font-700 text-2xl text-text-1 mb-2">Reset Password</h2>
                <p className="text-text-3 text-sm">Enter your email and we&apos;ll send you instructions to reset your password.</p>
              </div>

              {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm text-text-1 placeholder:text-text-4 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" placeholder="name@company.com" required />
                  </div>
                </div>
                <Button type="submit" variant="cta" className="w-full py-2.5" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : <span className="flex items-center gap-2">Send Reset Link <ArrowRight className="w-4 h-4" /></span>}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-syne font-700 text-xl text-text-1 mb-2">Check your email</h2>
              <p className="text-text-3 text-sm mb-6">We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.</p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">Back to login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
