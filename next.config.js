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

  // Experimental features - FIXED: No duplicate keys
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    // Optimize specific packages to reduce bundle size
    optimizePackageImports: [
      'react-icons',
      '@supabase/supabase-js',
      'react-icons/fa',
      'react-icons/si'
    ],
    optimizeCss: true,
  },

  // Compression and performance
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  generateEtags: true,

  // Output optimization
  output: 'standalone',

  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      // Optimize common imports
      '@': './src',
    },
  },

  // Webpack optimizations for production
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Optimize bundle size
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor chunks
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Supabase chunk
            supabase: {
              name: 'supabase',
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            // Auth chunk (next-auth)
            auth: {
              name: 'auth',
              test: /[\\/]node_modules[\\/]next-auth[\\/]/,
              priority: 33,
              reuseExistingChunk: true,
            },
            // Icons chunk - separate to avoid loading all icons
            icons: {
              name: 'icons',
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Commons chunk for shared code
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Lib chunk for other libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
          maxInitialRequests: 10,
          maxAsyncRequests: 10,
          minSize: 20000,
        },
      }
    }
    return config
  },

  // Headers for caching and security
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/demos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
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
      // Security headers
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
