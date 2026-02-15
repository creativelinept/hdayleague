import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/events/hybrid-day-madrid-2026",
        permanent: false,
      },
      {
        source: "/events",
        destination: "/events/hybrid-day-madrid-2026",
        permanent: false,
      },
      {
        source: "/events/hybrid-day-vigo-2025",
        destination: "/events/hybrid-day-madrid-2026",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
