import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/events",
        destination: "/events/hybrid-day-valencia",
        permanent: false,
      },
      {
        source: "/events/hybrid-day-santa-maria-da-feira",
        destination: "/events/hybrid-day-valencia",
        permanent: false,
      },
      {
        source: "/events/hybrid-day-vigo-2025",
        destination: "/events/hybrid-day-valencia",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
