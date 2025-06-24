// @file: client/src/app/[locale]/verify-email/page.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { api } from '@/lib/api/axios'
import { notify } from '@/store/notification.zustand'

export default function VerifyEmailPage() {
  const t = useTranslations('VerifyEmail')
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  useEffect(() => {
    if (token) verifyToken(token)
  }, [token])

  const verifyToken = async (token: string) => {
    setStatus('verifying')
    try {
      await api.post('/auth/verify-email-code', { token })
      setStatus('success')
      notify.success(t('success'), 5)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setStatus('error')
      setError(err.response?.data?.message || t('errors.default'))
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResendStatus('sending')
    try {
      await api.post('/auth/send-verification-code', { email })
      setResendStatus('sent')
      notify.success(t('resent'), 5)
    } catch {
      setResendStatus('failed')
      notify.error(t('errors.resendFailed'), 5)
    }
  }

  return (
    <main className="flex justify-center px-4 pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
      <div className="min-w-[320px] sm:min-w-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('title')}</h1>

        {email && !token && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('sentTo')} <strong>{email}</strong>
          </p>
        )}

        {status === 'verifying' && <p className="text-blue-500">{t('verifying')}</p>}
        {status === 'success' && <p className="text-green-600">{t('success')}</p>}
        {status === 'error' && <p className="text-red-600">{error}</p>}

        {email && !token && (
          <button
            onClick={handleResend}
            disabled={resendStatus === 'sending'}
            className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {resendStatus === 'sending'
              ? t('resending')
              : resendStatus === 'sent'
                ? t('resent')
                : t('resend')}
          </button>
        )}
      </div>
    </main>
  )
}
