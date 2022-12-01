/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: "/solid-quest",
  images: {
    loader: "custom",
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: "/",
        destination: "/solid-quest/",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
