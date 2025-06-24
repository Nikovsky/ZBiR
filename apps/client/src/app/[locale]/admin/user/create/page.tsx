// @file: client/src/app/[locale]/admin/user/create/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { createUser } from '@/lib/api/admin-user.api'
import { userFormSchema, UserFormData } from './userForm.schema'
import { UserRole } from '@zbir/types'
import KeyValueTable from '@/components/ui/KeyValueTable'
import { notify } from '@/store/notification.zustand'

export default function AdminUserCreatePage() {
  const router = useRouter()
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
      role: UserRole.USER,
      isActive: true,
      isBlocked: false,
      isEmailConfirmed: true,
      twoFactorEnabled: false,
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: UserFormData) => {
    try {
      const { confirmPassword, ...dto } = data
      const res = await createUser(dto)
      const msg = res.message || 'Użytkownik został utworzony.'
      notify.success(msg, 3)
      reset()
      router.push('/admin/user/list')
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Wystąpił błąd podczas tworzenia użytkownika'
      notify.error(message, 4)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Nowy użytkownik</h1>
        <button onClick={() => router.back()} className="btn btn-sm btn-outline">
          ⬅ Wróć
        </button>
      </div>

      <p className="text-sm text-base-content/70">
        Wypełnij poniższy formularz, aby utworzyć nowe konto użytkownika.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <KeyValueTable
          rows={[
            {
              label: 'Email',
              content: (
                <>
                  <input {...register('email')} className="input input-sm input-bordered w-full" />
                  {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                </>
              ),
            },
            {
              label: 'Imię',
              content: (
                <>
                  <input {...register('name')} className="input input-sm input-bordered w-full" />
                  {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                </>
              ),
            },
            {
              label: 'Username',
              content: (
                <>
                  <input {...register('username')} className="input input-sm input-bordered w-full" />
                  {errors.username && <p className="text-xs text-error mt-1">{errors.username.message}</p>}
                </>
              ),
            },
            {
              label: 'Rola',
              content: (
                <select {...register('role')} className="select select-sm select-bordered w-full">
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ),
            },
            {
              label: 'Hasło',
              content: (
                <>
                  <input type="password" {...register('password')} className="input input-sm input-bordered w-full" />
                  {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
                </>
              ),
            },
            {
              label: 'Powtórz hasło',
              content: (
                <>
                  <input type="password" {...register('confirmPassword')} className="input input-sm input-bordered w-full" />
                  {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
                </>
              ),
            },
            {
              label: 'Aktywny',
              content: (
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-sm mr-2" {...register('isActive')} /> Aktywny
                </label>
              ),
            },
            {
              label: 'Zablokowany',
              content: (
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-sm mr-2" {...register('isBlocked')} /> Zablokowany
                </label>
              ),
            },
            {
              label: 'Email potwierdzony',
              content: (
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-sm mr-2" {...register('isEmailConfirmed')} /> Potwierdzony
                </label>
              ),
            },
            {
              label: '2FA włączone',
              content: (
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-sm mr-2" {...register('twoFactorEnabled')} /> Włączone
                </label>
              ),
            },
          ]}
        />

        <div className="flex justify-end gap-4">
          <button type="submit" className="btn btn-success btn-sm" disabled={isSubmitting}>
            Utwórz użytkownika
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => reset()}>
            Resetuj formularz
          </button>
        </div>
      </form>
    </div>
  )
}
