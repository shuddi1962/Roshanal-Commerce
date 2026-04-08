"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Package,
  RotateCcw,
  CreditCard,
  Shield,
  Wrench,
  Building2,
  Phone,
  ChevronRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "getting-started", label: "Getting Started", icon: ShoppingCart },
  { id: "orders", label: "Orders & Shipping", icon: Package },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "products", label: "Products", icon: Shield },
  { id: "technical", label: "Technical Support", icon: Wrench },
  { id: "b2b", label: "B2B & Wholesale", icon: Building2 },
  { id: "contact", label: "Contact Us", icon: Phone },
];

const helpContent: Record<string, { title: string; articles: { q: string; a: string }[] }> = {
  "getting-started": {
    title: "Getting Started",
    articles: [
      { q: "How do I create an account?", a: "Click 'My Account' in the header, then 'Create Account'. Fill in your details, verify your email, and you're ready to shop." },
      { q: "How do I place my first order?", a: "Browse products, add items to your cart, proceed to checkout, enter your delivery address, select shipping method, choose payment, and confirm your order." },
      { q: "What currencies do you accept?", a: "We display prices in your local currency (auto-detected). All payments are processed in NGN (Nigerian Naira). We support NGN, USD, GBP, EUR, GHS, and more." },
      { q: "Do you ship internationally?", a: "Yes! We ship to over 20 countries worldwide. International shipping rates and delivery times vary by destination." },
    ],
  },
  orders: {
    title: "Orders & Shipping",
    articles: [
      { q: "How do I track my order?", a: "Go to Track Order in the header or visit /track-order. Enter your order ID (found in your confirmation email) to see real-time status." },
      { q: "What shipping methods are available?", a: "Standard (3-5 days), Express (1-2 days), Same-Day (PHC only), and Store Pickup. Methods vary by location and product type." },
      { q: "Can I change my delivery address after ordering?", a: "Contact support within 1 hour of placing your order. Once the order is packed or dispatched, the address cannot be changed." },
      { q: "What carriers do you use?", a: "GIG Logistics, DHL, FedEx, Aramex, and our own delivery fleet for local orders in Port Harcourt and Lagos." },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    articles: [
      { q: "What is your return policy?", a: "Most products can be returned within 7 days of delivery in original packaging. Some items like custom installations are non-returnable." },
      { q: "How do I initiate a return?", a: "Go to My Account → Orders → select the order → click 'Request Return'. Choose items and reason, then our team will process your RMA." },
      { q: "How long do refunds take?", a: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. Credit appears in 5-10 business days depending on your bank." },
      { q: "Can I get store credit instead?", a: "Yes! Store credit is available as an alternative to refund. It's processed instantly and added to your wallet." },
    ],
  },
  payments: {
    title: "Payments",
    articles: [
      { q: "What payment methods do you accept?", a: "Credit/Debit Card, Bank Transfer, USSD, Mobile Money, Crypto (Bitcoin, USDT), Roshanal Wallet, and Pay on Delivery (select areas)." },
      { q: "Is my payment information secure?", a: "Yes. All payments are processed through PCI-DSS compliant gateways (Paystack, Flutterwave, Stripe). We never store your card details." },
      { q: "How does the Roshanal Wallet work?", a: "Top up your wallet via bank transfer or card. Use wallet balance for faster checkout. You can also receive refunds and loyalty rewards in your wallet." },
      { q: "Do you offer installment payments?", a: "We're working on integrating installment payment options. Currently, bulk/B2B orders can negotiate payment terms." },
    ],
  },
  products: {
    title: "Products",
    articles: [
      { q: "Are your products genuine/original?", a: "100%. We are authorized distributors for Hikvision, Dahua, Bosch, Yamaha, Mercury, ZKTeco, and other brands. All products come with manufacturer warranty." },
      { q: "Do you offer product warranties?", a: "Yes. Warranty periods vary by product (typically 1-3 years). Register your product in My Account after purchase to activate warranty." },
      { q: "Can I request a product not listed?", a: "Use our Quote & Sourcing system at /quote. Describe the product and we'll source it from our global network of suppliers." },
      { q: "How do I compare products?", a: "Click the compare icon on any product card. You can compare up to 4 products side by side including specs, pricing, and availability." },
    ],
  },
  technical: {
    title: "Technical Support",
    articles: [
      { q: "Do you offer installation services?", a: "Yes! We provide professional installation for CCTV, fire alarm, access control, kitchen equipment, and more. Book via /services." },
      { q: "What if my product is defective?", a: "Contact support within 48 hours of delivery. We'll arrange replacement or repair under warranty. Include photos of the defect." },
      { q: "Do you offer maintenance contracts?", a: "Yes. Annual maintenance contracts cover regular servicing, priority support, and discounted repairs. Visit /services/maintenance." },
      { q: "Can I get remote technical support?", a: "Yes. Our technical team offers remote support via phone, chat, and video call for configuration and troubleshooting." },
    ],
  },
  b2b: {
    title: "B2B & Wholesale",
    articles: [
      { q: "How do I access wholesale pricing?", a: "Apply for a B2B account at /wholesale. Once approved, you'll see wholesale prices and can place bulk orders with NET payment terms." },
      { q: "What are the minimum order quantities?", a: "MOQs vary by product category. Generally, 5+ units qualify for wholesale pricing. Custom MOQs available for large accounts." },
      { q: "Do you offer NET payment terms?", a: "Approved B2B customers can access NET 30 and NET 60 payment terms based on credit assessment and order history." },
      { q: "Can I get a custom quote for large projects?", a: "Absolutely. Use our Quote system at /quote or email b2b@roshanalglobal.com with your requirements. We handle large-scale deployments." },
    ],
  },
  contact: {
    title: "Contact Us",
    articles: [
      { q: "How can I reach customer support?", a: "Live chat (bottom-right), email support@roshanalglobal.com, phone +234 800 ROSHANAL, or visit any of our branches." },
      { q: "What are your support hours?", a: "Monday – Saturday, 8AM – 6PM WAT. AI chat assistant available 24/7 for common queries." },
      { q: "Where are your offices located?", a: "Port Harcourt (HQ): 14 Aba Road. Lagos: 25 Broad Street. Bayelsa: 12 Mbiama Road. Visit /stores for maps." },
      { q: "How do I report an issue?", a: "Email support@roshanalglobal.com with your order ID and description. For urgent issues, call our hotline." },
    ],
  },
};

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const content = helpContent[activeTab];

  return (
    <div className="bg-off-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link>
          <span>/</span>
          <span className="text-text-1 font-medium">Help Center</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-navy to-blue-800 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-syne font-800 text-3xl mb-4">How Can We Help You?</h1>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-text-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-border overflow-hidden lg:sticky lg:top-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm border-b border-border last:border-0 transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue font-medium border-l-2 border-l-blue"
                        : "text-text-2 hover:bg-off-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-syne font-700 text-xl text-text-1">{content.title}</h2>
              </div>
              <div className="divide-y divide-border">
                {content.articles.map((article, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedQ(expandedQ === `${activeTab}-${i}` ? null : `${activeTab}-${i}`)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-off-white/50 transition-colors"
                    >
                      <span className="font-syne font-600 text-sm text-text-1 pr-4">{article.q}</span>
                      <ChevronRight className={`w-4 h-4 text-text-4 flex-shrink-0 transition-transform ${expandedQ === `${activeTab}-${i}` ? "rotate-90" : ""}`} />
                    </button>
                    {expandedQ === `${activeTab}-${i}` && (
                      <div className="px-5 pb-5 -mt-2">
                        <p className="text-sm text-text-3 leading-relaxed">{article.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Still need help */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-syne font-700 text-text-1 mb-1">Still need help?</h3>
                <p className="text-sm text-text-3">Our support team is ready to assist you.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/contact">
                  <Button variant="default" size="sm">
                    <Mail className="w-3 h-3 mr-1" /> Email
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-3 h-3 mr-1" /> Live Chat
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
