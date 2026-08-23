import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.freepik.com", "res.cloudinary.com"],
  },
  // Keep firebase-admin out of the serverless bundle (otherwise import fails on Vercel)
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
