/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  // For API routes body size limit
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};
