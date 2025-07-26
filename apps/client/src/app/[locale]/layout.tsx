// @file: client/src/app/[locale]/layout.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { themeInitScript } from '@/lib/theme/theme-init'
import '@/styles/globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { QueryProvider } from '@/lib/providers/query-provider'
import NotificationBanner from '@/components/ui/NotificationBanner'
import { AuthProvider } from '@/lib/auth/auth.context'

export const metadata: Metadata = {
  title: 'ZBIR',
  description: 'ZBIR - AUTH SYSTEM BASE',
  authors: [
    { name: 'bos-8', url: 'https://github.com/bos-8' },
    { name: 'Nikovsky', url: 'https://github.com/Nikovsky' }
  ],
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(['pl', 'en'], locale)) notFound()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <NextIntlClientProvider>
          <QueryProvider>
            <AuthProvider>
              <Navbar />
              <NotificationBanner />
              <main className="flex-grow">{children}</main>
              <Footer />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
