/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Code splitting & optimization
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    optimizePackageImports: ['react-icons'],
  },

  // Compression and headers for performance
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {},
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/svg-icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
};
