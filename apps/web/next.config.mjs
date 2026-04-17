/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lifecreate/schema', '@lifecreate/market-reference'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
