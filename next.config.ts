import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4300',
      },
      {
        protocol: 'http',
        hostname: 'mysagra-api',
        port: '4300',
      }
    ]
  }
};

export default nextConfig;
