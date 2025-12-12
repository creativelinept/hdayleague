import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/events/hybrid-day-vigo-2025",
        permanent: true,
      },
      {
        source: "/events",
        destination: "/events/hybrid-day-vigo-2025",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
