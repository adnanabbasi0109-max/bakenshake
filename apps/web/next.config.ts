import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bakenshake.in",
      },
      {
        protocol: "https",
        hostname: "**.fal.media",
      },
    ],
  },
};

export default nextConfig;
