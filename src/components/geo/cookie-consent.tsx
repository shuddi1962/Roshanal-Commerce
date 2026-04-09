"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, Shield } from "lucide-react";

const CONSENT_KEY = "roshanal-cookie-consent";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

/**
 * GDPR / NDPR-compliant cookie consent banner.
 *
 * Appears fixed at the bottom of the viewport on first visit.
 * Stores consent choices in localStorage and never re-appears
 * once the user has accepted, rejected, or customised.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomise, setShowCustomise] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so the banner doesn't flash during SSR hydration
      const id = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(id);
    }
  }, []);

  function saveConsent(consent: ConsentState) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  function handleAcceptAll() {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  }

  function handleRejectAll() {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  }

  function handleSaveCustom() {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: Date.now(),
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 inset-x-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto bg-[#0C1A36] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Main banner */}
            <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              {/* Icon + text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    We value your privacy
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    We use cookies to enhance your browsing experience, serve
                    personalised content, and analyse our traffic. By clicking
                    &quot;Accept All&quot;, you consent to our use of cookies in
                    accordance with our{" "}
                    <a
                      href="/privacy"
                      className="underline underline-offset-2 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowCustomise((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-xs font-medium"
                >
                  <Settings size={14} />
                  Customise
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg bg-[#C8191C] hover:bg-[#a81416] text-white text-xs font-semibold transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-lg bg-[#1641C4] hover:bg-[#1236a6] text-white text-xs font-semibold transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>

            {/* Customise panel */}
            <AnimatePresence>
              {showCustomise && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-3 text-xs">
                      <Shield size={14} className="text-white/50" />
                      <span className="text-white/50">
                        Choose which cookies you allow. Necessary cookies cannot
                        be disabled.
                      </span>
                    </div>

                    {/* Cookie toggles */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Necessary — always on */}
                      <CookieToggle
                        label="Necessary"
                        description="Essential for the site to function."
                        checked={true}
                        disabled
                      />
                      <CookieToggle
                        label="Analytics"
                        description="Help us understand site usage."
                        checked={analytics}
                        onChange={setAnalytics}
                      />
                      <CookieToggle
                        label="Marketing"
                        description="Personalised ads and offers."
                        checked={marketing}
                        onChange={setMarketing}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveCustom}
                        className="px-5 py-2 rounded-lg bg-[#1641C4] hover:bg-[#1236a6] text-white text-xs font-semibold transition-colors"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: individual cookie toggle
// ---------------------------------------------------------------------------

function CookieToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 shrink-0 w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-[#1641C4]" : "bg-white/20"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <div className="min-w-0">
        <p className="text-white text-xs font-medium">{label}</p>
        <p className="text-white/40 text-[11px] leading-snug">{description}</p>
      </div>
    </div>
  );
}
