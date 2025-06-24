// @file: client/src/components/ui/LangSelector.tsx
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition, useCallback } from 'react'
import { Translate, Flag } from 'react-bootstrap-icons'

export const LangSelector = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const nextLocale = locale === 'pl' ? 'en' : 'pl'
  const label = nextLocale === 'pl' ? 'PL' : 'EN'

  const handleClick = useCallback(() => {
    const segments = pathname.split('/')
    segments[1] = nextLocale
    const newPath = segments.join('/') || '/'

    startTransition(() => {
      router.replace(newPath)
    })
  }, [pathname, router, nextLocale])

  return (
    <button
      onClick={handleClick}
      title="Zmień język"
      aria-label="Zmień język"
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
    >
      <Translate className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )
}
//EOF
