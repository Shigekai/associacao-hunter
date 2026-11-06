import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
  },
};

export default nextConfig;
