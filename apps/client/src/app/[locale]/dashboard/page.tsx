// @file: client/src/app/[locale]/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getUserDashboard, updateUserDashboard } from '@/lib/api/dashboard.api'
import { Throbber } from '@/components/ui/Throbber'
import { PublicUserAccountDto, Gender } from '@zbir/types'
import KeyValueTable from '@/components/ui/KeyValueTable'
import { useRouter } from 'next/navigation'
import { Pencil, Check2, X } from 'react-bootstrap-icons'
import { notify } from '@/store/notification.zustand'

export default function DashboardPage() {
  const router = useRouter()

  const { data, isPending, isError, error, refetch } = useQuery<PublicUserAccountDto>({
    queryKey: ['user', 'dashboard'],
    queryFn: getUserDashboard,
  })

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  const mutation = useMutation({
    mutationFn: updateUserDashboard,
    onSuccess: async () => {
      await refetch()
      setIsEditing(false)
      setFormData({})
      notify.success('Edytowano dane', 3)
    },
    onError: (err) => {
      notify.error(`Nie udało się zapisać zmian: ${err}`, 3)
    }
  })

  if (isPending) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        <Throbber className="w-8 h-8" />
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        <p className="text-red-500">
          Wystąpił błąd podczas ładowania profilu: {error instanceof Error ? error.message : 'Nieznany błąd'}
        </p>
      </main>
    )
  }

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const renderField = (field: string, value: string | null = '') => {
    return isEditing ? (
      <input
        type="text"
        className="input input-sm input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        value={formData[field] ?? value ?? ''}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    ) : (
      <span>{value || '—'}</span>
    )
  }

  const renderDate = (field: string, value: Date | null) => {
    const str = value ? new Date(value).toISOString().split('T')[0] : ''
    return isEditing ? (
      <input
        type="date"
        className="input input-sm input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        value={formData[field] ?? str}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    ) : (
      <span>{value ? new Date(value).toLocaleDateString() : '—'}</span>
    )
  }

  const renderSelect = (field: string, selected: string | null) => {
    return isEditing ? (
      <select
        className="select select-sm select-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        value={formData[field] ?? selected ?? ''}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        <option value="">—</option>
        <option value={Gender.MALE}>Mężczyzna</option>
        <option value={Gender.FEMALE}>Kobieta</option>
        <option value={Gender.OTHER}>Inna</option>
      </select>
    ) : (
      <span>{selected ?? '—'}</span>
    )
  }

  const personal = data.personalData

  const accountRows = [
    { label: 'Email', content: data.email },
    { label: 'ID', content: data.id },
    { label: 'Rola', content: data.role },
    { label: 'Ostatnie logowanie', content: data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : '—' },
    { label: 'Nazwa użytkownika', content: renderField('username', data.username) },
    { label: 'Nazwa wyświetlana', content: renderField('name', data.name) },
  ]

  const personalRows = [
    { label: 'Imię', content: renderField('firstName', personal?.firstName) },
    { label: 'Drugie imię', content: renderField('middleName', personal?.middleName) },
    { label: 'Nazwisko', content: renderField('lastName', personal?.lastName) },
    { label: 'Telefon', content: renderField('phoneNumber', personal?.phoneNumber) },
    { label: 'Adres', content: renderField('address', personal?.address) },
    { label: 'Kod pocztowy', content: renderField('zipCode', personal?.zipCode) },
    { label: 'Miasto', content: renderField('city', personal?.city) },
    { label: 'Kraj', content: renderField('country', personal?.country) },
    { label: 'Data urodzenia', content: renderDate('birthDate', personal?.birthDate ?? null) },
    { label: 'Płeć', content: renderSelect('gender', personal?.gender ?? '') },
  ]

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Twój profil</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                title="Zapisz zmiany"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-green-500 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                onClick={() => {
                  const {
                    username, name,
                    firstName, middleName, lastName, phoneNumber,
                    address, city, zipCode, country,
                    birthDate, gender
                  } = formData

                  mutation.mutate({
                    username,
                    name,
                    personalData: {
                      firstName,
                      middleName,
                      lastName,
                      phoneNumber,
                      address,
                      city,
                      zipCode,
                      country,
                      birthDate: birthDate || null,
                      gender: gender ? (gender as Gender) : null,
                    }
                  })
                  console.log(formData)
                  setIsEditing(false)
                }}
              >
                <Check2 className="w-5 h-5" />
                <span className="text-sm font-medium">Zapisz</span>
              </button>
              <button
                title="Anuluj"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setFormData({})
                  setIsEditing(false)
                }}
              >
                <X className="w-5 h-5" />
                <span className="text-sm font-medium">Anuluj</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                title="Edytuj dane"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Pencil className="w-5 h-5" />
                <span className="text-sm font-medium">Edytuj dane</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/change-password')}
                title="Zmień hasło"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Pencil className="w-5 h-5" />
                <span className="text-sm font-medium">Zmień hasło</span>
              </button>
            </>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Dane konta</h2>
        <KeyValueTable rows={accountRows} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Dane personalne</h2>
        <KeyValueTable rows={personalRows} />
      </section>
    </main>
  )
}
