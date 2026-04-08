"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Percent, Mail, Bell, Clock, MapPin, ShoppingBag, Sparkles, Zap } from "lucide-react";

type PopupType = "welcome" | "newsletter" | "exit-intent" | "scroll" | "time-based" | "product-promo" | "seasonal" | "flash-sale" | "geolocation";

interface CampaignConfig {
  id: string;
  type: PopupType;
  title: string;
  subtitle: string;
  cta: string;
  image?: string;
  bgColor: string;
  accentColor: string;
  delay?: number;
  scrollPercent?: number;
  showOnce?: boolean;
  couponCode?: string;
  discountPercent?: number;
}

const defaultCampaigns: CampaignConfig[] = [
  {
    id: "welcome-10",
    type: "welcome",
    title: "Welcome to Roshanal Global!",
    subtitle: "Get 10% off your first order. Use code at checkout.",
    cta: "Shop Now",
    bgColor: "from-navy to-blue-900",
    accentColor: "bg-blue",
    couponCode: "WELCOME10",
    discountPercent: 10,
    delay: 3000,
    showOnce: true,
  },
  {
    id: "newsletter-sub",
    type: "newsletter",
    title: "Stay in the Loop",
    subtitle: "Subscribe for exclusive deals, new arrivals, and security tips delivered to your inbox.",
    cta: "Subscribe",
    bgColor: "from-purple-600 to-purple-900",
    accentColor: "bg-purple-500",
    delay: 15000,
    showOnce: true,
  },
  {
    id: "flash-sale",
    type: "flash-sale",
    title: "Flash Sale — 48 Hours Only!",
    subtitle: "Up to 40% off all CCTV cameras and security systems. Don't miss out!",
    cta: "View Deals",
    bgColor: "from-red to-orange-600",
    accentColor: "bg-red",
    couponCode: "FLASH40",
    discountPercent: 40,
  },
];

const iconMap: Record<PopupType, typeof Gift> = {
  "welcome": Gift,
  "newsletter": Mail,
  "exit-intent": Bell,
  "scroll": ShoppingBag,
  "time-based": Clock,
  "product-promo": Sparkles,
  "seasonal": Sparkles,
  "flash-sale": Zap,
  "geolocation": MapPin,
};

export default function CampaignPopup() {
  const [activePopup, setActivePopup] = useState<CampaignConfig | null>(null);
  const [email, setEmail] = useState("");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load dismissed popups from localStorage
    try {
      const stored = localStorage.getItem("roshanal-dismissed-popups");
      if (stored) setDismissed(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const dismiss = useCallback((id: string) => {
    setActivePopup(null);
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("roshanal-dismissed-popups", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Welcome popup with delay
  useEffect(() => {
    const campaign = defaultCampaigns.find((c) => c.type === "welcome");
    if (!campaign || dismissed.has(campaign.id)) return;

    const timer = setTimeout(() => {
      setActivePopup(campaign);
    }, campaign.delay || 3000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !activePopup) {
        const campaign = defaultCampaigns.find((c) => c.type === "exit-intent");
        if (campaign && !dismissed.has(campaign.id)) {
          setActivePopup(campaign);
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [activePopup, dismissed]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Icon = activePopup ? iconMap[activePopup.type] || Gift : Gift;

  return (
    <AnimatePresence>
      {activePopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => dismiss(activePopup.id)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Top gradient section */}
            <div className={`bg-gradient-to-br ${activePopup.bgColor} p-8 text-center text-white relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-full" />
                <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white/20 rounded-full" />
              </div>
              <button
                onClick={() => dismiss(activePopup.id)}
                className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
              <div className="relative">
                <div className={`w-14 h-14 rounded-full ${activePopup.accentColor} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                {activePopup.discountPercent && (
                  <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 mb-3">
                    <Percent size={12} />
                    <span className="text-sm font-bold">{activePopup.discountPercent}% OFF</span>
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{activePopup.title}</h2>
                <p className="text-sm text-white/80 leading-relaxed">{activePopup.subtitle}</p>
              </div>
            </div>

            {/* Content section */}
            <div className="p-6">
              {/* Coupon code */}
              {activePopup.couponCode && (
                <div className="mb-4">
                  <p className="text-[10px] text-text-4 uppercase tracking-wider font-semibold mb-1.5 text-center">Your Discount Code</p>
                  <button
                    onClick={() => copyCode(activePopup.couponCode!)}
                    className="w-full py-3 px-4 border-2 border-dashed border-blue/30 rounded-xl bg-blue/5 text-center hover:border-blue/50 transition-colors"
                  >
                    <span className="text-lg font-mono font-bold text-blue tracking-widest">{activePopup.couponCode}</span>
                    <p className="text-[10px] text-text-4 mt-0.5">{copied ? "Copied!" : "Click to copy"}</p>
                  </button>
                </div>
              )}

              {/* Newsletter input */}
              {activePopup.type === "newsletter" && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 h-11 px-4 rounded-xl border border-border text-sm focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
                    />
                    <button className="h-11 px-5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors">
                      {activePopup.cta}
                    </button>
                  </div>
                  <p className="text-[10px] text-text-4 mt-2 text-center">No spam, unsubscribe anytime.</p>
                </div>
              )}

              {/* CTA button (non-newsletter) */}
              {activePopup.type !== "newsletter" && (
                <button
                  onClick={() => dismiss(activePopup.id)}
                  className={`w-full h-12 rounded-xl text-white font-semibold text-sm ${activePopup.accentColor} hover:opacity-90 transition-opacity`}
                >
                  {activePopup.cta}
                </button>
              )}

              <button
                onClick={() => dismiss(activePopup.id)}
                className="w-full text-center text-xs text-text-4 hover:text-text-2 mt-3 transition-colors"
              >
                No thanks, I&apos;ll pass
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
