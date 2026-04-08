"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Globe, Building2 } from "lucide-react";
import { useCurrencyStore } from "@/store/currency-store";
import { getCountryCurrency } from "@/lib/geo-currency";

// ---------------------------------------------------------------------------
// Country list (subset of commonly-used countries)
// ---------------------------------------------------------------------------

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "EG", name: "Egypt" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "CH", name: "Switzerland" },
  { code: "NZ", name: "New Zealand" },
  { code: "PL", name: "Poland" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "CM", name: "Cameroon" },
  { code: "CI", name: "Cote d'Ivoire" },
  { code: "SN", name: "Senegal" },
  { code: "RW", name: "Rwanda" },
] as const;

const MANUAL_CURRENCY_KEY = "roshanal-currency-manual";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LocationOverrideModalProps {
  open: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LocationOverrideModal({
  open,
  onClose,
}: LocationOverrideModalProps) {
  const { detectedCountry, detectedCity, setCurrency, setLocation } =
    useCurrencyStore();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync form state when modal opens
  useEffect(() => {
    if (open) {
      const match = COUNTRIES.find((c) => c.name === detectedCountry);
      setSelectedCountry(match?.code ?? "NG");
      setCity(detectedCity);
      // Focus city input after animation
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open, detectedCountry, detectedCity]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleSave() {
    const country = COUNTRIES.find((c) => c.code === selectedCountry);
    if (!country) return;

    setLocation(country.name, city.trim() || "Unknown");

    // Auto-switch currency to match new country
    const newCurrency = getCountryCurrency(selectedCountry);
    setCurrency(newCurrency);

    // Mark as manually set so geo-initializer doesn't override
    localStorage.setItem(MANUAL_CURRENCY_KEY, "true");

    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0C1A36] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">
                    Change Location
                  </h2>
                  <p className="text-white/50 text-[11px]">
                    Update your country and city
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4">
              {/* Country dropdown */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <Globe size={13} />
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F7F8FC] px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1641C4] focus:ring-2 focus:ring-[#1641C4]/20 transition-all"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City input */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <Building2 size={13} />
                  City
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Port Harcourt"
                  className="w-full rounded-xl border border-gray-200 bg-[#F7F8FC] px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1641C4] focus:ring-2 focus:ring-[#1641C4]/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
              </div>

              {/* Detected currency hint */}
              <p className="text-[11px] text-gray-400">
                Currency will switch to{" "}
                <span className="font-semibold text-gray-600">
                  {getCountryCurrency(selectedCountry)}
                </span>{" "}
                when you save.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-[#1641C4] hover:bg-[#1236a6] text-white text-xs font-semibold transition-colors"
              >
                Save Location
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
