// @file: client/src/lib/hooks/useTheme.ts
'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = stored ?? 'system'
    setThemeState(resolved)

    applyTheme(resolved, prefersDark)
  }, [])

  const applyTheme = (value: Theme, prefersDark: boolean = false) => {
    if (value === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (value === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      prefersDark
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark')
    }
  }

  const setTheme = (newTheme: Theme) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (newTheme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', newTheme)
    }

    setThemeState(newTheme)
    applyTheme(newTheme, prefersDark)
  }

  return { theme, setTheme }
}
//EOF
