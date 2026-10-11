/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  webpack: (config) => {
    // lib/store.js is imported by a few client pages; stub out the Node `fs`
    // builtin in the client bundle (persistence only ever runs on the server).
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  },
}
module.exports = nextConfig
