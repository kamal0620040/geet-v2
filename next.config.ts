import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.saavncdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.saavncdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
