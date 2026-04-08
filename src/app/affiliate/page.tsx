"use client";

import Link from "next/link";
import { Users, ArrowRight, DollarSign, Link2, TrendingUp, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AffiliatePage() {
  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Affiliate Program</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-green-300" />
            <span className="text-green-300 font-syne font-600 text-sm">Earn With Us</span>
          </div>
          <h1 className="font-syne font-800 text-4xl sm:text-5xl mb-4">Roshanal Affiliate Program</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto mb-8">
            Earn commission on every sale you refer. Share products you love and get paid when your audience buys.
          </p>
          <Link href="/auth/register">
            <Button variant="cta" size="lg">Join the Program <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-10 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Link2, step: "1", title: "Get Your Link", desc: "Sign up and receive your unique affiliate referral link" },
              { icon: Users, step: "2", title: "Share & Promote", desc: "Share your link on social media, blogs, or with your network" },
              { icon: DollarSign, step: "3", title: "Earn Commission", desc: "Earn up to 10% commission on every completed sale" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-success" />
                  </div>
                  <span className="font-syne font-800 text-xs text-success">STEP {item.step}</span>
                  <h3 className="font-syne font-700 text-lg text-text-1 mt-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Program Benefits</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, title: "Up to 10% Commission", desc: "Competitive rates on all product categories" },
              { icon: TrendingUp, title: "Real-Time Tracking", desc: "Track clicks, conversions, and earnings live" },
              { icon: Gift, title: "₦2,000 Welcome Bonus", desc: "Get ₦2,000 credit on your first successful referral" },
              { icon: Star, title: "Tiered Rewards", desc: "Higher commissions as you refer more sales" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-off-white rounded-xl p-6 text-center">
                  <Icon className="w-8 h-8 text-success mx-auto mb-3" />
                  <h3 className="font-syne font-700 text-text-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-3">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-syne font-800 text-3xl text-text-1 mb-8 text-center">Commission Structure</h2>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-off-white">
                  <th className="p-4 text-left text-sm font-syne font-600 text-text-2">Category</th>
                  <th className="p-4 text-right text-sm font-syne font-600 text-text-2">Commission</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Security & CCTV", "8%"],
                  ["Fire Alarm Systems", "8%"],
                  ["Marine & Boat Engines", "5%"],
                  ["Safety Equipment", "10%"],
                  ["Networking & ICT", "7%"],
                  ["Solar & Power", "6%"],
                  ["Kitchen Equipment", "8%"],
                  ["Services (Bookings)", "3%"],
                ].map(([cat, rate]) => (
                  <tr key={cat} className="border-t border-border">
                    <td className="p-4 text-sm text-text-2">{cat}</td>
                    <td className="p-4 text-right font-syne font-700 text-success">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-emerald-800">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-syne font-800 text-3xl mb-4">Ready to Start Earning?</h2>
          <p className="text-green-200 mb-8">Join thousands of affiliates already earning with Roshanal Global</p>
          <Link href="/auth/register">
            <Button variant="cta" size="lg">Apply Now <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
