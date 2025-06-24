// @file: client/src/app/[locale]/dashboard/change-password/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema, ChangePasswordFormData } from './changePassword.schema'
import { changeUserPassword } from '@/lib/api/dashboard.api'
import { useState } from 'react'
import { notify } from '@/store/notification.zustand'
import { useAuth } from '@/lib/auth/auth.context'
import KeyValueTable from '@/components/ui/KeyValueTable'
import { ArrowLeft } from 'react-bootstrap-icons'
import { useRouter } from 'next/navigation'


export default function ChangePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const { sessionQuery } = useAuth()
  const session = sessionQuery.data
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (values: ChangePasswordFormData) => {
    try {
      await changeUserPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      reset()
      setError(null)
      notify.success('Hasło zostało zmienione', 3)
    } catch (err: any) {
      setError('Nie udało się zmienić hasła. Sprawdź poprawność obecnego hasła.')
      notify.error('Zmiana hasła nie powiodła się', 3)
    }
  }

  const rows = [
    {
      label: 'Obecne hasło',
      content: (
        <div>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register('currentPassword')}
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
      ),
    },
    {
      label: 'Nowe hasło',
      content: (
        <div>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>
      ),
    },
    {
      label: 'Powtórz nowe hasło',
      content: (
        <div>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      ),
    },
  ]

  return (
    <main className="max-w-2xl mx-auto px-6 pt-20 pb-12 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Zmień hasło</h1>
        <button
          onClick={() => router.push('/dashboard')}
          title="Powrót do profilu"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Powrót</span>
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input
          type="email"
          name="email"
          autoComplete="username"
          value={session?.email ?? ''}
          readOnly
          hidden
        />

        <KeyValueTable rows={rows} />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          Zapisz nowe hasło
        </button>
      </form>
    </main>
  )
}