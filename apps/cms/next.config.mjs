import { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig satisfies NextConfig;
