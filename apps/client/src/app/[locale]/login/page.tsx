// @file: client/src/app/[locale]/login/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormValues } from './loginForm.schema'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/hooks/useSession'
import { Throbber } from '@/components/ui/Throbber'
import Input from '@/components/ui/Input'
import { notify } from '@/store/notification.zustand'
import { api } from '@/lib/api/axios'
import { useQueryClient } from '@tanstack/react-query'

export default function LoginPage() {
  const t = useTranslations('Login')
  const router = useRouter()
  const initializeUserSession = useSession()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await api.post('/auth/login', data)
      notify.success(t('success'), 3)
      window.location.href = '/dashboard'
    } catch (err: any) {
      notify.error(err?.response?.data?.message || t('errors.default'), 5)
    }
  }

  return (
    <main className="flex justify-center px-4 pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-[320px] sm:min-w-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          {t('title')}
        </h1>

        <Input
          id="email"
          type="email"
          label={t('email')}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          type="password"
          label={t('password')}
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 p-2 rounded hover:bg-green-700 dark:hover:bg-green-400 transition flex items-center justify-center"
        >
          {isSubmitting ? <Throbber className="w-5 h-5" /> : t('submit')}
        </button>
      </form>
    </main>
  )
}
