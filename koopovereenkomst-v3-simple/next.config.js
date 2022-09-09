/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/solid-quest',
  images: {
    loader: "custom",
  },
};

module.exports = nextConfig;
