// @file: client/src/app/[locale]/register/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { registerSchema, RegisterFormValues } from './registerForm.schema'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/axios'
import Input from '@/components/ui/Input'
import { notify } from '@/store/notification.zustand'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema(t)),
  })

  const onSubmit = async (formData: RegisterFormValues) => {
    console.log('[FORM]', formData)

    const { confirmPassword, ...payload } = formData

    try {
      await api.post('/auth/register', payload)
      notify.success(t('Register.success.message', { email: payload.email }), 3)
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`)
      }, 1000)
    } catch (err: any) {
      notify.error(err?.response?.data?.message || t('Register.errors.default'), 3)
    }
  }

  return (
    <main className="flex justify-center px-4 pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-[320px] sm:min-w-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          {t('Register.title')}
        </h1>

        <Input
          id="email"
          label={t('Register.email')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          type="password"
          label={t('Register.password')}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          id="confirmPassword"
          type="password"
          label={t('Register.confirmPassword')}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 p-2 rounded hover:bg-green-700 dark:hover:bg-green-400 transition"
          >
            {t('Register.submit')}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {t('Register.reset')}
          </button>
        </div>
      </form>
    </main>
  )
}
