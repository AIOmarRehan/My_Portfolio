import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppSessionProvider from '@/components/SessionProvider'
import InteractiveBackground from '@/components/InteractiveBackground'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio'
}

export default function RootLayout({children}: {children: ReactNode}){
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100">
        <ScrollProgress />
        <AppSessionProvider>
          <InteractiveBackground />
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
