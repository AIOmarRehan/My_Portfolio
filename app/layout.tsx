import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppSessionProvider from '@/components/SessionProvider'
import InteractiveBackground from '@/components/InteractiveBackground'

export const metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio'
}

export default function RootLayout({children}: {children: ReactNode}){
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100">
        <AppSessionProvider>
          <InteractiveBackground />
          <Header />
          <main className="relative z-10 pt-20 pb-0 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-12">{children}</div>
          </main>
          <Footer />
        </AppSessionProvider>
      </body>
    </html>
  )
}
