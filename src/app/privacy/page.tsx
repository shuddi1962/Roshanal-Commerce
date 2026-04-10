"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <div className="bg-navy text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white mb-4"><ArrowLeft size={14} /> Back to Home</Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="font-syne font-800 text-3xl">Privacy Policy</h1>
          </div>
          <p className="text-blue-200 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 prose prose-sm max-w-none">
        {[
          { title: "1. Information We Collect", content: "We collect information you provide directly: name, email, phone number, shipping/billing address, and payment details when you make a purchase. We also collect browsing data, device information, IP address, and cookies for analytics and improving your experience." },
          { title: "2. How We Use Your Information", content: "Your information is used to: process orders, provide customer support, send transactional emails (order confirmations, shipping updates), personalize your shopping experience, improve our services, detect and prevent fraud, and comply with legal obligations." },
          { title: "3. Information Sharing", content: "We share data with: payment processors (Paystack, Flutterwave), delivery partners for order fulfillment, cloud hosting providers (Insforge, Vercel), and analytics services. We never sell your personal data to third parties for marketing purposes." },
          { title: "4. Data Security", content: "We use industry-standard encryption (SSL/TLS) for all data transmission, secure server infrastructure with access controls, and regular security audits. Payment information is processed through PCI-DSS compliant payment gateways and is never stored on our servers." },
          { title: "5. Cookies", content: "We use cookies for: session management, shopping cart persistence, user preferences (language, currency), analytics, and personalization. You can control cookie settings through your browser. Essential cookies are required for the site to function." },
          { title: "6. Your Rights", content: "You have the right to: access your personal data, request correction of inaccurate data, request deletion of your data, opt out of marketing communications, and export your data. Contact us at privacy@roshanalglobal.com to exercise these rights." },
          { title: "7. Data Retention", content: "We retain account data while your account is active. Transaction records are kept for 7 years for legal and accounting purposes. You can request account deletion at any time, and we will remove your data within 30 days." },
          { title: "8. Children's Privacy", content: "Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected data from a minor, contact us immediately." },
          { title: "9. Changes to This Policy", content: "We may update this policy periodically. We will notify you of material changes via email or prominent notice on our website. Continued use after changes constitutes acceptance." },
          { title: "10. Contact Us", content: "For privacy inquiries: privacy@roshanalglobal.com | Phone: +234 800 ROSHANAL | Address: Lagos, Nigeria" },
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
