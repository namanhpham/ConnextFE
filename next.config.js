/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(','),
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
