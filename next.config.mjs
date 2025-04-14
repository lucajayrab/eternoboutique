/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add any external domains if you host videos/images externally
  },
  // Remove experimental features that might cause issues
  experimental: {},
}

export default nextConfig
