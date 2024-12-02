/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "trikalarchitects.com/"],
    },
  },
  images: {
    domains: [
      "trikalarchitects.com/",
      "twitter.com",
      "www.canva.com",
      "utfs.io"
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
