// @file: client/src/app/[locale]/admin/user/edit/[id]/page.tsx
'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import {
  AdminPanelEditUserWithPersonalDataDto,
  AdminPanelPasswordChangeDto,
  AdminPanelUserWithPersonalDataDto,
  UserRole,
  Gender,
  UserRegion
} from '@zbir/types'
import {
  editUserFormSchema,
  EditUserFormData,
  changePasswordSchema,
  ChangePasswordFormData
} from './userForm.schema'
import {
  getUserById,
  updateUser,
  changePassword
} from '@/lib/api/admin-user.api'
import KeyValueTable from '@/components/ui/KeyValueTable'
import { notify } from '@/store/notification.zustand'

export default function AdminUserEditPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const userForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {}
  })

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      id: id!,
      newPassword: ''
    }
  })

  const {
    data: userData,
    isPending,
    refetch
  } = useQuery<AdminPanelUserWithPersonalDataDto>({
    queryKey: ['admin-user', id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })

  useEffect(() => {
    if (userData) {
      resetUserFormFromData(userData)
    }
  }, [userData])


  const resetUserFormFromData = (data: AdminPanelUserWithPersonalDataDto) => {
    userForm.reset({
      id: data.id,
      name: data.name ?? undefined,
      username: data.username ?? undefined,
      email: data.email,
      emailVerified: data.emailVerified ?? undefined,
      isActive: data.isActive,
      isBlocked: data.isBlocked,
      isEmailConfirmed: data.isEmailConfirmed,
      twoFactorEnabled: data.twoFactorEnabled,
      role: data.role,
      regionAccess: data.regionAccess,
      personalData: data.personalData
        ? {
          ...data.personalData,
          firstName: data.personalData.firstName ?? undefined,
          middleName: data.personalData.middleName ?? undefined,
          lastName: data.personalData.lastName ?? undefined,
          phoneNumber: data.personalData.phoneNumber ?? undefined,
          address: data.personalData.address ?? undefined,
          city: data.personalData.city ?? undefined,
          zipCode: data.personalData.zipCode ?? undefined,
          country: data.personalData.country ?? undefined,
          birthDate: data.personalData.birthDate
            ? new Date(data.personalData.birthDate).toISOString().split('T')[0]
            : undefined,
          gender: data.personalData.gender ?? undefined
        }
        : undefined
    })
  }


  const updateUserMutation = useMutation({
    mutationFn: (dto: AdminPanelEditUserWithPersonalDataDto) =>
      updateUser(id!, dto),
    onSuccess: async () => {
      await refetch()
      notify.success('Dane użytkownika zaktualizowane', 3)
    },
    onError: () => notify.error('Błąd podczas aktualizacji danych')
  })

  const changePasswordMutation = useMutation({
    mutationFn: (dto: AdminPanelPasswordChangeDto) => changePassword(dto),
    onSuccess: () => {
      notify.success('Hasło zostało zmienione', 3)
      passwordForm.reset()
    },
    onError: () => notify.error('Błąd przy zmianie hasła')
  })

  const onSubmitUser = (data: EditUserFormData) => {
    const dto: AdminPanelEditUserWithPersonalDataDto = {
      ...data,
      personalData: data.personalData
        ? {
          ...data.personalData,
          birthDate: data.personalData.birthDate
            ? new Date(data.personalData.birthDate)
            : undefined
        }
        : undefined
    }

    updateUserMutation.mutate(dto)
  }

  const onSubmitPassword = (data: ChangePasswordFormData) =>
    changePasswordMutation.mutate(data)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edycja użytkownika</h1>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => router.push('/admin/user/list')}
        >
          ← Wróć do listy
        </button>
      </div>

      <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-6">
        <h2 className="text-lg font-medium">Dane konta użytkownika</h2>
        <KeyValueTable
          rows={[
            { label: 'Email', content: <input {...userForm.register('email')} className="input input-sm input-bordered w-full" /> },
            { label: 'Imię', content: <input {...userForm.register('name')} className="input input-sm input-bordered w-full" /> },
            { label: 'Username', content: <input {...userForm.register('username')} className="input input-sm input-bordered w-full" /> },
            {
              label: 'Rola',
              content: (
                <select {...userForm.register('role')} className="select select-sm select-bordered w-full">
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              )
            },
            {
              label: 'Region',
              content: (
                <select {...userForm.register('regionAccess')} className="select select-sm select-bordered w-full">
                  {Object.values(UserRegion).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              )
            },
            { label: 'Aktywny', content: <input type="checkbox" {...userForm.register('isActive')} /> },
            { label: 'Zablokowany', content: <input type="checkbox" {...userForm.register('isBlocked')} /> },
            { label: 'Email potwierdzony', content: <input type="checkbox" {...userForm.register('isEmailConfirmed')} /> },
            { label: '2FA włączone', content: <input type="checkbox" {...userForm.register('twoFactorEnabled')} /> }
          ]}
        />

        <h2 className="text-lg font-medium pt-4">Dane personalne</h2>
        <KeyValueTable
          rows={[
            { label: 'Imię', content: <input {...userForm.register('personalData.firstName')} className="input input-sm input-bordered w-full" /> },
            { label: 'Nazwisko', content: <input {...userForm.register('personalData.lastName')} className="input input-sm input-bordered w-full" /> },
            { label: 'Telefon', content: <input {...userForm.register('personalData.phoneNumber')} className="input input-sm input-bordered w-full" /> },
            { label: 'Miasto', content: <input {...userForm.register('personalData.city')} className="input input-sm input-bordered w-full" /> },
            { label: 'Kraj', content: <input {...userForm.register('personalData.country')} className="input input-sm input-bordered w-full" /> },
            { label: 'Data urodzenia', content: <input type="date" {...userForm.register('personalData.birthDate')} className="input input-sm input-bordered w-full" /> },
            {
              label: 'Płeć',
              content: (
                <select {...userForm.register('personalData.gender')} className="select select-sm select-bordered w-full">
                  {Object.values(Gender).map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              )
            }
          ]}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={!userData}
            onClick={() => userData && resetUserFormFromData(userData)}
          >
            Anuluj zmiany
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={updateUserMutation.isPending}>
            Zapisz zmiany
          </button>
        </div>

      </form>

      <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
        <h2 className="text-lg font-semibold">Zmiana hasła</h2>
        <KeyValueTable
          rows={[
            { label: 'Nowe hasło', content: <input type="password" {...passwordForm.register('newPassword')} className="input input-sm input-bordered w-full" /> }
          ]}
        />
        <div className="flex justify-end">
          <button type="submit" className="btn btn-warning btn-sm" disabled={changePasswordMutation.isPending}>Zmień hasło</button>
        </div>
      </form>
    </div>
  )
}
