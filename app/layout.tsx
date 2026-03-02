import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppSessionProvider from '@/components/SessionProvider'
import DynamicInteractiveBackground from '@/components/DynamicInteractiveBackground'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollProgress from '@/components/ScrollProgress'
import LoadingScreen from '@/components/LoadingScreen'
import type { Metadata } from 'next'

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
})

// Comprehensive SEO metadata with OpenGraph and Twitter Cards
export const metadata: Metadata = {
  metadataBase: new URL('https://omar-rehan.vercel.app'),
  title: {
    default: 'Omar Rehan | AI & Full-Stack Engineer',
    template: '%s | Omar Rehan',
  },
  description:
    'AI and Full-Stack Engineer specializing in Machine Learning, Deep Learning, and end-to-end AI solutions. Expertise in data preprocessing, model optimization, and deployment.',
  keywords: [
    'AI Engineer',
    'Machine Learning',
    'Deep Learning',
    'Full-Stack Developer',
    'Omar Rehan',
    'Artificial Intelligence',
    'Data Science',
    'Model Optimization',
    'AI Solutions',
    'Next.js',
    'React',
    'TypeScript',
    'Python',
    'TensorFlow',
    'PyTorch',
  ],
  authors: [{ name: 'Omar Rehan', url: 'https://omar-rehan.vercel.app' }],
  creator: 'Omar Rehan',
  publisher: 'Omar Rehan',
  
  // OpenGraph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://omar-rehan.vercel.app',
    title: 'Omar Rehan | AI & Full-Stack Engineer',
    description:
      'AI and Full-Stack Engineer specializing in Machine Learning, Deep Learning, and end-to-end AI solutions.',
    siteName: 'Omar Rehan Portfolio',
    images: [
      {
        url: '/favicon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Omar Rehan Portfolio',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Rehan | AI & Full-Stack Engineer',
    description:
      'AI and Full-Stack Engineer specializing in Machine Learning, Deep Learning, and end-to-end AI solutions.',
    images: ['/favicon-512x512.png'],
    creator: '@omar_rehan',
  },

  // Verification and Search Console
  verification: {
    google: 'your-google-verification-code',
  },

  // Canonical URL
  alternates: {
    canonical: 'https://omar-rehan.vercel.app',
  },

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Manifest for PWA
  manifest: '/manifest.json',

  // Apple Web App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Omar Rehan',
  },

  // Format detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Additional metadata
  category: 'technology',
}

// Viewport configuration
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Essential meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Preconnect to external services - DNS prefetch only */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Omar Rehan',
              url: 'https://omar-rehan.vercel.app',
              jobTitle: 'AI & Full-Stack Engineer',
              description:
                'AI and Full-Stack Engineer specializing in Machine Learning and Deep Learning',
              sameAs: [
                'https://github.com/omar-rehan',
                'https://linkedin.com/in/omar-rehan',
                'https://medium.com/@ai.omar.rehan',
              ],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ajman',
                addressCountry: 'UAE',
              },
              email: 'ai.omar.rehan@gmail.com',
              telephone: '+971509669311',
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <LoadingScreen />
        <ScrollProgress />
        <AppSessionProvider>
          <DynamicInteractiveBackground />
          <Header />
          <ScrollToTop />
          <main className="relative z-10 pt-20 pb-0 min-h-screen">
            <div className="w-full max-w-none md:max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
              {children}
            </div>
          </main>
          <Footer />
        </AppSessionProvider>
      </body>
    </html>
  )
}

