import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/business-account/:path*",
        destination: "http://160.79.116.212:8099/business-account/:path*",
      },
    ];
  },
};

export default nextConfig;
