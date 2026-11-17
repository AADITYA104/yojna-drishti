import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  outputFileTracingIncludes: {
    "/api/v1/analytics/location": ["./data/processed/location-analytics.json.gz"],
    "/api/v1/analytics/location/records": ["./data/processed/location-record-index.json.gz"],
    "/api/v1/analytics/village-profile": ["./data/processed/village-census-2011.json.gz"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" }
    ] }];
  }
};

export default nextConfig;
