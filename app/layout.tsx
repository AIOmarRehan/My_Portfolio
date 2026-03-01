import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppSessionProvider from '@/components/SessionProvider'
import DynamicInteractiveBackground from '@/components/DynamicInteractiveBackground'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata = {
  title: 'Omar Rehan | Portfolio',
  description: 'AI and Full-Stack Engineer specializing in Machine Learning and Deep Learning.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({children}: {children: ReactNode}){
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        
        {/* Font optimizations */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      </head>
      <body className="bg-gray-950 text-gray-100">
        <ScrollProgress />
        <AppSessionProvider>
          <DynamicInteractiveBackground />
          <Header />
          <ScrollToTop />
          <main className="relative z-10 pt-20 pb-0 min-h-screen">
            <div className="w-full max-w-none md:max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">{children}</div>
          </main>
          <Footer />
        </AppSessionProvider>
      </body>
    </html>
  )
}

