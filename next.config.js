/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  // For API routes body size limit
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};
