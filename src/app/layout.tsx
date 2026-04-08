import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import ClientLayout from "@/components/layout/client-layout";
import GeoInitializer from "@/components/geo/geo-initializer";
import CookieConsent from "@/components/geo/cookie-consent";
import ServiceWorkerRegister from "@/components/pwa/sw-register";

export const metadata: Metadata = {
  title: {
    default: "Roshanal Global — Security Systems, Marine, Safety & Professional Services",
    template: "%s | Roshanal Global",
  },
  description:
    "Your trusted partner for CCTV, fire alarm, access control, marine accessories, boat engines, boat building, safety equipment, kitchen installation, dredging services, and more. Shipping worldwide from Port Harcourt, Nigeria.",
  keywords: [
    "CCTV", "security systems", "fire alarm", "access control", "marine accessories",
    "boat engines", "boat building", "safety equipment", "dredging", "kitchen installation",
    "Yamaha engines", "Hikvision", "Port Harcourt", "Nigeria", "surveillance",
  ],
  openGraph: {
    title: "Roshanal Global — Security, Marine & Professional Services",
    description: "Premium security, marine, safety & professional services. Worldwide shipping.",
    type: "website",
    locale: "en_US",
    siteName: "Roshanal Global",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Roshanal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0C1A36" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased bg-off-white text-text-1">
        <AuthProvider>
          <GeoInitializer />
          <ClientLayout>{children}</ClientLayout>
          <CookieConsent />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
