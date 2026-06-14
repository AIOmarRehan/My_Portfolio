'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const applyThemeClass = (nextTheme: Theme) => {
    document.documentElement.classList.toggle('dark-mode', nextTheme === 'dark')
  }

  useEffect(() => {
    // Load saved theme or default to normal mode
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme: Theme = savedTheme === 'dark' ? 'dark' : 'light'
    setTheme(initialTheme)
    applyThemeClass(initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    // Suppress transitions during the flip so colours change in one paint.
    root.classList.add('theme-switching')
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyThemeClass(newTheme)
    // Re-enable transitions after the paint that applied the new theme.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove('theme-switching'))
    )
  }

  // Always provide the context, even during SSR/first render
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
