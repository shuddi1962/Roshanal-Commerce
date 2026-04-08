"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ArrowRight, CheckCircle2, Search, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = ["Product Selection", "Requirements", "Preferences", "Review & Submit"];

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    productType: "",
    productName: "",
    productUrl: "",
    description: "",
    quantity: "1",
    category: "security",
    budget: "",
    timeline: "standard",
    brandPreference: "",
    deliveryLocation: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="bg-off-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-syne font-800 text-2xl text-text-1 mb-2">Quote Request Submitted!</h1>
          <p className="text-text-3 mb-2">Reference: <span className="font-mono font-medium">QUO-2026-{Math.floor(Math.random() * 9000 + 1000)}</span></p>
          <p className="text-sm text-text-3 mb-6">Our sales team will review your request and send a detailed quote within 24–48 hours.</p>
          <div className="flex justify-center gap-3">
            <Link href="/"><Button variant="default">Back to Home</Button></Link>
            <Link href="/shop"><Button variant="outline">Browse Products</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Request a Quote</span>
        </div>
      </div>

      <section className="bg-gradient-to-r from-navy to-blue-800 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FileText className="w-8 h-8 text-blue-300 mx-auto mb-3" />
          <h1 className="font-syne font-800 text-3xl mb-3">Request a Quote</h1>
          <p className="text-blue-200">Tell us what you need and we&apos;ll source it for you with the best pricing</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${i <= currentStep ? "text-blue" : "text-text-4"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-syne font-700 ${
                  i < currentStep ? "bg-success text-white" : i === currentStep ? "bg-blue text-white" : "bg-border text-text-4"
                }`}>
                  {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block text-xs font-medium">{step}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < currentStep ? "bg-success" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border p-8">
          {/* Step 1 - Product */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <h2 className="font-syne font-700 text-xl text-text-1 mb-4">What do you need?</h2>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">How would you like to specify the product?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "catalogue", label: "From Catalogue", icon: Package },
                    { value: "url", label: "Paste URL", icon: Search },
                    { value: "describe", label: "Describe It", icon: MessageCircle },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.value} onClick={() => handleChange("productType", opt.value)} className={`p-4 rounded-lg border text-center transition-colors ${form.productType === opt.value ? "border-blue bg-blue-50" : "border-border hover:border-blue/30"}`}>
                        <Icon className="w-5 h-5 mx-auto mb-2 text-text-3" />
                        <span className="text-sm text-text-2">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {form.productType === "catalogue" && (
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Product Name / SKU</label>
                  <input type="text" value={form.productName} onChange={(e) => handleChange("productName", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Search for a product..." />
                </div>
              )}
              {form.productType === "url" && (
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Product URL</label>
                  <input type="url" value={form.productUrl} onChange={(e) => handleChange("productUrl", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Paste a product link from any website..." />
                </div>
              )}
              {form.productType === "describe" && (
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Describe what you need</label>
                  <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Describe the product, its specifications, or use case..." />
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                    <option value="security">Security & CCTV</option>
                    <option value="fire-alarm">Fire Alarm</option>
                    <option value="access-control">Access Control</option>
                    <option value="marine">Marine Accessories</option>
                    <option value="safety">Safety Equipment</option>
                    <option value="dredging">Dredging Equipment</option>
                    <option value="kitchen">Kitchen Equipment</option>
                    <option value="networking">Networking</option>
                    <option value="solar">Solar & Power</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Quantity</label>
                  <input type="number" min="1" value={form.quantity} onChange={(e) => handleChange("quantity", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Requirements */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="font-syne font-700 text-xl text-text-1 mb-4">Your Requirements</h2>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Budget Range (NGN)</label>
                <select value={form.budget} onChange={(e) => handleChange("budget", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                  <option value="">Select budget range</option>
                  <option value="under-100k">Under ₦100,000</option>
                  <option value="100k-500k">₦100,000 – ₦500,000</option>
                  <option value="500k-1m">₦500,000 – ₦1,000,000</option>
                  <option value="1m-5m">₦1,000,000 – ₦5,000,000</option>
                  <option value="5m-plus">₦5,000,000+</option>
                  <option value="flexible">Flexible / Open Budget</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Timeline</label>
                <select value={form.timeline} onChange={(e) => handleChange("timeline", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue/20">
                  <option value="urgent">Urgent (1–3 days)</option>
                  <option value="standard">Standard (1–2 weeks)</option>
                  <option value="flexible">Flexible (no rush)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Brand Preference</label>
                <input type="text" value={form.brandPreference} onChange={(e) => handleChange("brandPreference", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Any specific brand? (optional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Delivery Location</label>
                <input type="text" value={form.deliveryLocation} onChange={(e) => handleChange("deliveryLocation", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="City, State, Country" />
              </div>
            </div>
          )}

          {/* Step 3 - Contact */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="font-syne font-700 text-xl text-text-1 mb-4">Your Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Company (Optional)</label>
                  <input type="text" value={form.company} onChange={(e) => handleChange("company", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Company name" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="email@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="+234 800 000 0000" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1.5">Additional Notes</label>
                <textarea value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20" placeholder="Any other details..." />
              </div>
            </div>
          )}

          {/* Step 4 - Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="font-syne font-700 text-xl text-text-1 mb-4">Review Your Request</h2>
              <div className="space-y-3 bg-off-white rounded-xl p-5">
                {[
                  ["Category", form.category],
                  ["Product Type", form.productType || "—"],
                  ["Quantity", form.quantity],
                  ["Budget", form.budget || "Not specified"],
                  ["Timeline", form.timeline],
                  ["Brand", form.brandPreference || "No preference"],
                  ["Delivery", form.deliveryLocation || "Not specified"],
                  ["Name", form.name],
                  ["Email", form.email],
                  ["Phone", form.phone],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-text-3">{label}</span>
                    <span className="text-text-1 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>Back</Button>
            ) : <div />}
            {currentStep < steps.length - 1 ? (
              <Button variant="default" onClick={() => setCurrentStep((s) => s + 1)}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button variant="cta" onClick={() => setSubmitted(true)}>
                Submit Quote Request <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
