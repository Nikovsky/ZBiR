// @file: client/src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LogoutButton from '../ui/LogoutBtn'
import { AccessPreset } from '@zbir/types'
import { RbacOnly } from './RbacOnly'

export default function Navbar() {
  const t = useTranslations('Navbar')

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
          ZBIR
        </Link>

        {/* ADMIN NAV */}
        <RbacOnly preset={AccessPreset.ADMINS}>
          <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/admin/session" className="hover:text-black dark:hover:text-white">
              SESSION
            </Link>
            <Link href="/admin/user/list" className="hover:text-black dark:hover:text-white">
              USERS
            </Link>
          </div>
        </RbacOnly>

        {/* FICO NAV */}
        <RbacOnly preset={AccessPreset.MODERATORS}>
          <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/fico/books" className="hover:text-black dark:hover:text-white">
              KSIĘGI
            </Link>
          </div>
        </RbacOnly>

        {/* MAIN NAV */}
        <nav className="flex gap-4 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
          <RbacOnly preset={AccessPreset.LOGGED}>
            <Link href="/dashboard" className="hover:text-black dark:hover:text-white">
              {t('dashboard')}
            </Link>
          </RbacOnly>

          <RbacOnly preset={AccessPreset.NON_LOGGED}>
            <>
              <Link href="/register" className="hover:text-black dark:hover:text-white">
                {t('signup')}
              </Link>
              <Link href="/login" className="hover:text-black dark:hover:text-white">
                {t('login')}
              </Link>
            </>
          </RbacOnly>

          <RbacOnly preset={AccessPreset.LOGGED}>
            <LogoutButton />
          </RbacOnly>
        </nav>
      </div>
    </header>
  )
}
