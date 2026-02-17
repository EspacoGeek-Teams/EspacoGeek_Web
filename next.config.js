/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // TODO: Replace wildcards with specific trusted domains for production
    // Currently allows all domains to support various media image sources
    // Security: Restrict to specific domains (e.g., api.espacogeek.com, cdn.example.com)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Empty turbopack config to acknowledge we're using Turbopack
  turbopack: {},
};

module.exports = nextConfig;
