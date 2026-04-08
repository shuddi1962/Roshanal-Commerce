"use client";

import { useEffect, useRef } from "react";
import { useCurrencyStore } from "@/store/currency-store";
import { detectLocation, fetchExchangeRates } from "@/lib/geo-currency";

const RATE_REFRESH_MS = 60 * 60 * 1000; // 1 hour
const MANUAL_CURRENCY_KEY = "roshanal-currency-manual";

/**
 * Invisible client component that runs once on mount to:
 *  1. Detect the user's geo-location
 *  2. Fetch live exchange rates
 *  3. Periodically refresh rates every hour
 *
 * Respects manual currency overrides stored in localStorage.
 */
export default function GeoInitializer() {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const store = useCurrencyStore.getState();

    // If already initialised this session, skip location detection
    if (store.initialized) {
      // Still refresh rates in the background
      fetchExchangeRates().then((er) => {
        useCurrencyStore.getState().setRates(er.rates);
      });
    } else {
      initialise();
    }

    // Set up periodic rate refresh
    const interval = setInterval(() => {
      fetchExchangeRates().then((er) => {
        useCurrencyStore.getState().setRates(er.rates);
      });
    }, RATE_REFRESH_MS);

    return () => clearInterval(interval);
  }, []);

  return null;
}

// ---------------------------------------------------------------------------

async function initialise() {
  const [location, exchangeRates] = await Promise.all([
    detectLocation(),
    fetchExchangeRates(),
  ]);

  const store = useCurrencyStore.getState();

  // Update location
  store.setLocation(location.country, location.city);

  // Update rates
  store.setRates(exchangeRates.rates);

  // Only auto-set currency if the user has NOT manually chosen one
  const manuallySet =
    typeof window !== "undefined" &&
    localStorage.getItem(MANUAL_CURRENCY_KEY) === "true";

  if (!manuallySet) {
    store.setCurrency(location.currency);
  }

  store.setInitialized(true);
}
