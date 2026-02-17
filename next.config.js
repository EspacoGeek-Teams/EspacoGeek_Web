/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
  // Configuração do webpack para incluir extensões .js com JSX
  webpack: (config) => {
    config.resolve.extensions = ['.js', '.jsx', '.json', ...config.resolve.extensions];
    return config;
  },
};

module.exports = nextConfig;
