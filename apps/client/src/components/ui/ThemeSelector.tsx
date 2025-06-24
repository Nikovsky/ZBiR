// @file: client/src/components/ui/ThemeSelector.tsx
'use client'

import { useTheme } from '@/lib/hooks/useTheme'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Laptop, Sun, MoonStars } from 'react-bootstrap-icons'

const themeCycle: Record<'system' | 'light' | 'dark', 'light' | 'dark' | 'system'> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  const handleClick = useCallback(() => {
    setTheme(themeCycle[theme])
  }, [theme, setTheme])

  const icons = {
    system: <Laptop className="w-5 h-5 mr-2" />,
    light: <Sun className="w-5 h-5 mr-2" />,
    dark: <MoonStars className="w-5 h-5 mr-2" />,
  }

  return (
    <button
      onClick={handleClick}
      title={t(`${theme}.title`)}
      className="flex items-center px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Zmień motyw"
    >
      {icons[theme]}
      <span className="text-sm font-medium">{t(`${theme}.label`)}</span>
    </button>
  )
}
