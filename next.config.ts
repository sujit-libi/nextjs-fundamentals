import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: 'intothecommerce.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'keen-pig-699.convex.cloud',
        protocol: 'https',
        port: '',
      },
    ],
  },
};

export default nextConfig;
