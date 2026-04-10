"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <div className="bg-navy text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white mb-4"><ArrowLeft size={14} /> Back to Home</Link>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="font-syne font-800 text-3xl">Terms & Conditions</h1>
          </div>
          <p className="text-blue-200 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 prose prose-sm max-w-none">
        {[
          { title: "1. Acceptance of Terms", content: "By accessing or using Roshanal Global (roshanalglobal.com), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. These terms apply to all users including customers, vendors, and visitors." },
          { title: "2. Account Registration", content: "You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 18 years old to create an account." },
          { title: "3. Products & Services", content: "We sell security systems, marine equipment, boat engines, safety equipment, kitchen equipment, and professional services. All product descriptions and specifications are provided in good faith. Colors and images may vary from actual products. Prices are in Nigerian Naira (₦) unless otherwise stated." },
          { title: "4. Orders & Payments", content: "All orders are subject to availability and confirmation. We accept payments via Paystack, Flutterwave, bank transfer, and wallet balance. Prices may change without notice but confirmed orders are honored at the quoted price." },
          { title: "5. Shipping & Delivery", content: "Delivery times are estimates and not guaranteed. Shipping fees are calculated based on destination and order weight. Risk of loss passes to you upon delivery. Free shipping promotions have minimum order requirements." },
          { title: "6. Returns & Refunds", content: "Most items can be returned within 14 days of delivery if unused and in original packaging. Customized products, installed systems, and perishables are non-returnable. Refunds are processed within 7-14 business days to the original payment method." },
          { title: "7. Vendor Marketplace", content: "Third-party vendors sell through our platform. While we vet vendors, Roshanal Global is not responsible for vendor products or services. Disputes between buyers and vendors should first be reported through our platform for mediation." },
          { title: "8. Intellectual Property", content: "All content on this website including text, graphics, logos, and software is the property of Roshanal Global or its licensors. Unauthorized reproduction or distribution is prohibited." },
          { title: "9. Limitation of Liability", content: "Roshanal Global is not liable for indirect, incidental, or consequential damages arising from use of our services. Our liability is limited to the purchase price of the relevant product or service." },
          { title: "10. Governing Law", content: "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria." },
          { title: "11. Contact Information", content: "Roshanal Global | Email: legal@roshanalglobal.com | Phone: +234 800 ROSHANAL | Address: Lagos, Nigeria" },
        ].map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-lg font-bold text-text-1 mb-2">{section.title}</h2>
            <p className="text-text-3 text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
