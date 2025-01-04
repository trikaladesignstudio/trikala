/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "trikalarchitects.com/"],
    },
  },
  webpack: (config, options) => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });
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
  pageExtensions: ["mdx", "ts", "tsx"],
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
