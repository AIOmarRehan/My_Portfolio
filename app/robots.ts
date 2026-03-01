import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api'],
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://omar-rehan.vercel.app/sitemap.xml',
  }
}
