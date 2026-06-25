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
  images: {
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
