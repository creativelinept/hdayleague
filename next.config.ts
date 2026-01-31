import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/events/hybrid-day-aveiro-2026",
        permanent: true,
      },
      {
        source: "/events",
        destination: "/events/hybrid-day-aveiro-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
