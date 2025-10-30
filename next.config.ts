import type { NextConfig } from "next";

console.log("[DEBUG] CLOUDFLARE_R2_HOSTNAME:", process.env.CLOUDFLARE_R2_HOSTNAME);
const resolvedHostname = process.env.CLOUDFLARE_R2_HOSTNAME && process.env.CLOUDFLARE_R2_HOSTNAME.trim() !== ""
  ? process.env.CLOUDFLARE_R2_HOSTNAME
  : "pub-268b707399424b6499871d81274dac46.r2.dev";
if (resolvedHostname === "pub-268b707399424b6499871d81274dac46.r2.dev") {
  console.warn("[WARN] Usando valor fixo para CLOUDFLARE_R2_HOSTNAME");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: resolvedHostname,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' data: https://pub-268b707399424b6499871d81274dac46.r2.dev;",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
