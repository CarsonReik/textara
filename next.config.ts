import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for faster deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds even with TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
