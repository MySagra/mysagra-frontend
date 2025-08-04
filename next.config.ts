import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      new URL(`${process.env.API_URL}/images/**`),
      new URL(`${process.env.API_URL}/uploads/**`)
    ]
  }
};

export default nextConfig;
