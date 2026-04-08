import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyStore {
  currency: string;
  currencySymbol: string;
  rates: Record<string, number>;
  detectedCountry: string;
  detectedCity: string;
  initialized: boolean;
  adminMarkup: number; // percentage added to converted prices (e.g. 2.5 = 2.5%)
  setCurrency: (currency: string) => void;
  setRates: (rates: Record<string, number>) => void;
  setLocation: (country: string, city: string) => void;
  setInitialized: (v: boolean) => void;
  setAdminMarkup: (markup: number) => void;
  convert: (amountNGN: number) => number;
  formatPrice: (amountNGN: number) => string;
  formatNGN: (amount: number) => string;
}

const SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  AED: "د.إ",
  CAD: "C$",
  AUD: "A$",
  ZAR: "R",
  KES: "KSh",
  JPY: "¥",
  CNY: "¥",
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: "NGN",
      currencySymbol: "₦",
      rates: { NGN: 1 },
      detectedCountry: "Nigeria",
      detectedCity: "Port Harcourt",
      initialized: false,
      adminMarkup: 2.5,

      setCurrency: (currency) => {
        set({
          currency,
          currencySymbol: SYMBOLS[currency] || currency,
        });
      },

      setRates: (rates) => set({ rates }),

      setLocation: (country, city) => {
        set({ detectedCountry: country, detectedCity: city });
      },

      setInitialized: (v) => set({ initialized: v }),

      setAdminMarkup: (markup) => set({ adminMarkup: markup }),

      convert: (amountNGN) => {
        const { currency, rates, adminMarkup } = get();
        if (currency === "NGN") return amountNGN;
        const rate = rates[currency] || 1;
        const converted = amountNGN * rate;
        // Apply admin markup to converted (non-NGN) prices
        return converted * (1 + adminMarkup / 100);
      },

      formatPrice: (amountNGN) => {
        const { currencySymbol, convert } = get();
        const converted = convert(amountNGN);
        return `${currencySymbol}${converted.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },

      formatNGN: (amount) => {
        return `₦${amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    }),
    { name: "roshanal-currency" }
  )
);
