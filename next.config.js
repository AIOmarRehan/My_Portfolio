/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Code splitting & optimization
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    optimizePackageImports: ['react-icons', '@supabase/supabase-js'],
    optimizeCss: true,
  },

  // Compression and headers for performance
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  generateEtags: true,

  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {},
  },

  // Disable Turbopack for production - use webpack instead
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    optimizePackageImports: ['react-icons', '@supabase/supabase-js'],
    optimizeCss: true,
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
        source: '/favicon-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/apple-touch-icon:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon.ico',
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};
