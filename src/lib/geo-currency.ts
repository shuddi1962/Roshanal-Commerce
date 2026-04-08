/**
 * Geo-detection and live currency conversion utilities.
 *
 * - detectLocation()       → user country/city via ipapi.co
 * - fetchExchangeRates()   → live rates with NGN as base
 * - getCountryCurrency()   → map ISO country code → default currency
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeoLocation {
  country: string; // e.g. "Nigeria"
  countryCode: string; // e.g. "NG"
  city: string; // e.g. "Port Harcourt"
  currency: string; // e.g. "NGN"
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  updatedAt: number; // unix ms
}

// ---------------------------------------------------------------------------
// Country → Currency mapping (common countries)
// ---------------------------------------------------------------------------

const COUNTRY_CURRENCY: Record<string, string> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  GH: "GHS",
  AE: "AED",
  CA: "CAD",
  AU: "AUD",
  ZA: "ZAR",
  KE: "KES",
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  BR: "BRL",
  MX: "MXN",
  EG: "EGP",
  SA: "SAR",
  SG: "SGD",
  NZ: "NZD",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  CH: "CHF",
  PL: "PLN",
  TZ: "TZS",
  UG: "UGX",
  RW: "RWF",
  CM: "XAF",
  CI: "XOF",
  SN: "XOF",
};

// ---------------------------------------------------------------------------
// Fallbacks
// ---------------------------------------------------------------------------

const FALLBACK_LOCATION: GeoLocation = {
  country: "Nigeria",
  countryCode: "NG",
  city: "Port Harcourt",
  currency: "NGN",
};

const FALLBACK_RATES: ExchangeRates = {
  base: "NGN",
  rates: { NGN: 1 },
  updatedAt: Date.now(),
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return the default currency for an ISO-3166 alpha-2 country code.
 * Falls back to NGN for unknown codes.
 */
export function getCountryCurrency(countryCode: string): string {
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? "NGN";
}

/**
 * Detect user location via ipapi.co (free, no key required).
 * Returns GeoLocation with country, city, and mapped currency.
 */
export async function detectLocation(): Promise<GeoLocation> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`ipapi returned ${res.status}`);

    const data = await res.json();

    const countryCode: string = data.country_code ?? "NG";
    const country: string = data.country_name ?? "Nigeria";
    const city: string = data.city ?? "Unknown";
    const currency = getCountryCurrency(countryCode);

    return { country, countryCode, city, currency };
  } catch (err) {
    console.warn("[geo] Location detection failed, using fallback:", err);
    return FALLBACK_LOCATION;
  }
}

/**
 * Fetch live exchange rates with NGN as base currency.
 * Uses open.er-api.com (free, no key required).
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://open.er-api.com/v6/latest/NGN", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`exchange-rate API returned ${res.status}`);

    const data = await res.json();

    if (data.result !== "success" || !data.rates) {
      throw new Error("Unexpected response shape from exchange-rate API");
    }

    return {
      base: "NGN",
      rates: data.rates as Record<string, number>,
      updatedAt: Date.now(),
    };
  } catch (err) {
    console.warn("[geo] Exchange rate fetch failed, using fallback:", err);
    return FALLBACK_RATES;
  }
}
