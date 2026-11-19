import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  outputFileTracingIncludes: {
    "/api/v1/analytics/location": ["./data/processed/location-analytics.json.gz"],
    "/api/v1/analytics/overview": ["./data/processed/location-analytics.json.gz"],
    "/api/v1/analytics/area": ["./data/processed/location-analytics.json.gz"],
    "/api/v1/analytics/location/records": [
      "./data/processed/location-record-index.json.gz",
      "./data/processed/location-record-shard-index.json.gz",
    ],
    "/api/v1/analytics/village-profile": ["./data/processed/village-census-2011.json.gz"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // FIX H-06: Complete security headers for a government portal.
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          // Strict Transport Security — enforce HTTPS for 1 year.
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Permissions — disable unused browser features.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Cross-Origin isolation headers.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // Content Security Policy — allow assets from self + Google Fonts + MapLibre tiles.
          // Adjust 'connect-src' when real API endpoints are added.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + inline eval needed by ECharts/MapLibre
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              // Styles: self + Google Fonts + inline styles (Framer Motion / ECharts)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN + openfreemap glyphs
              "font-src 'self' https://fonts.gstatic.com data: https://tiles.openfreemap.org",
              // Images: self + data URIs + blob (MapLibre sprites) + https tiles
              "img-src 'self' data: blob: https:",
              // Worker: blob (MapLibre web worker)
              "worker-src 'self' blob:",
              // Connect: self + MapLibre tile servers
              "connect-src 'self' https://tiles.openfreemap.org https://*.openfreemap.org https://api.maptiler.com https://*.maptiler.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com",
              // Frame: none
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
