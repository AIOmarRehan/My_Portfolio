import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppSessionProvider from '@/components/SessionProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import DynamicInteractiveBackground from '@/components/DynamicInteractiveBackground'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollProgress from '@/components/ScrollProgress'
import LoadingScreen from '@/components/LoadingScreen'
import type { Metadata } from 'next'

// Font config
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
})

// SEO metadata
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
  
  // Social sharing
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

  // Twitter card
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Rehan | AI & Full-Stack Engineer',
    description:
      'AI and Full-Stack Engineer specializing in Machine Learning, Deep Learning, and end-to-end AI solutions.',
    images: ['/favicon-512x512.png'],
    creator: '@omar_rehan',
  },

  // Search Console verification
  verification: {
    google: 'your-google-verification-code',
  },

  // Canonical
  alternates: {
    canonical: 'https://omar-rehan.vercel.app',
  },

  // SEO robots
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

  // iOS settings
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Omar Rehan',
  },

  // Auto-detection settings
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Category
  category: 'technology',
}

// Viewport config
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
        {/* Skip to content link for accessibility */}
        <link rel="skip" href="#main-content" />
        {/* Charset meta - must be first */}
        <meta charSet="utf-8" />
        
        {/* Theme initialization - prevent flash */}
        <script src="/theme-init.js" />
        
        {/* Essential meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Preconnect to external services - DNS prefetch only */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Person Schema - SEO Structured Data */}
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
              description: 'AI and Full-Stack Engineer specializing in Machine Learning and Deep Learning',
              sameAs: [
                'https://github.com/AIOmarRehan',
                'https://linkedin.com/in/omar-rehan-47b98636a',
                'https://medium.com/@ai.omar.rehan',
                'https://kaggle.com/aiomarrehan',
                'https://huggingface.co/AIOmarRehan',
              ],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ajman',
                addressCountry: 'UAE',
              },
              email: 'ai.omar.rehan@gmail.com',
              telephone: '+971509669311',
              image: 'https://omar-rehan.vercel.app/favicon-512x512.png',
              workLocation: {
                '@type': 'Place',
                name: 'Remote',
              },
            }),
          }}
        />

        {/* Organization Schema - SEO Structured Data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Omar Rehan Portfolio',
              url: 'https://omar-rehan.vercel.app',
              logo: 'https://omar-rehan.vercel.app/favicon-512x512.png',
              sameAs: [
                'https://github.com/AIOmarRehan',
                'https://linkedin.com/in/omar-rehan-47b98636a',
                'https://medium.com/@ai.omar.rehan',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'General',
                email: 'ai.omar.rehan@gmail.com',
                telephone: '+971509669311',
              },
            }),
          }}
        />

        {/* WebSite Schema with SearchAction - SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: 'https://omar-rehan.vercel.app',
              name: 'Omar Rehan Portfolio',
              description: 'AI and Full-Stack Engineer Portfolio',
              inLanguage: 'en-US',
              creator: {
                '@type': 'Person',
                name: 'Omar Rehan',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-950 light:bg-gray-50 text-gray-100 light:text-gray-900 transition-colors duration-300`}>
        {/* Skip to content link - visible on focus */}
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <LoadingScreen />
        <ScrollProgress />
        <ThemeProvider>
        <AppSessionProvider>
          <DynamicInteractiveBackground />
          <Header />
          <ScrollToTop />
          <main id="main-content" className="relative z-10 pt-20 pb-0 min-h-screen" role="main" aria-label="Main content">
            <div className="w-full max-w-none md:max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
              {children}
            </div>
          </main>
          <Footer />
        </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

