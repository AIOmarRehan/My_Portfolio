import { MetadataRoute } from 'next'

// The project detail pages render client-side from these public read endpoints, so
// crawlers must be allowed to fetch them or Google renders "Project Not Found".
// A longer Allow path beats Disallow: /api. The JSON itself is sent with
// X-Robots-Tag: noindex (next.config.js), so it never appears in search results.
const PUBLIC_DATA_APIS = ['/api/projects', '/api/fullstack-projects', '/api/data-analytics-projects']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', ...PUBLIC_DATA_APIS],
        disallow: ['/admin', '/api'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', ...PUBLIC_DATA_APIS],
        disallow: ['/admin', '/api'],
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://omar-rehan.vercel.app/sitemap.xml',
  }
}
