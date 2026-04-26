import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'magecloud.agency',
      },
    ],
  },
};

export default nextConfig;
