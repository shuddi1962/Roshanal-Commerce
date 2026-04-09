/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization — allow external image sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    // Use default loader for Vercel, unoptimized for static export on Netlify/others
    ...(process.env.NEXT_EXPORT === "true" ? { unoptimized: true } : {}),
  },

  // Ensure trailing slashes for compatibility across platforms
  trailingSlash: false,

  // Powered-by header removal for security
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Environment variables available at build time
  env: {
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "Roshanal Global",
  },

  // Headers for security and PWA
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
