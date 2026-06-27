/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "trikalarchitects.com/"],
    },
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.js",
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  async headers() {
    return [
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "trikalarchitects.com",
      },
    ],
  },
  pageExtensions: ["ts", "tsx"],
  reactStrictMode: true,
};

export default nextConfig;
