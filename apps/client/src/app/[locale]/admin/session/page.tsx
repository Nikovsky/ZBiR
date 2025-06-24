// @file: client/src/app/[locale]/admin/sessions/page.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGroupedSessions, deleteUserSessions, deleteUserInactiveSessions, deleteAllInactiveSessions } from '@/lib/api/admin-session.api'
import { GroupedUserSession, PaginationResponse, SortDirection, DEFAULT_PAGINATION_LIMIT, ALLOWED_PAGINATION_LIMITS } from '@zbir/types'
import Paginator from '@/components/ui/Paginator'
import Table from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { notify } from '@/store/notification.zustand'

export default function AdminGroupedSessionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userEmail = searchParams.get('email') ?? 'Nieznany użytkownik'

  const search = searchParams.get('search') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const rawLimit = Number(searchParams.get('limit'))
  const limit = (ALLOWED_PAGINATION_LIMITS as readonly number[]).includes(rawLimit)
    ? rawLimit
    : DEFAULT_PAGINATION_LIMIT
  const sortBy = searchParams.get('sortBy') || 'email'
  const rawSortDir = searchParams.get('sortDirection')
  const sortDirection: SortDirection =
    rawSortDir === 'desc' ? SortDirection.DESC : SortDirection.ASC

  const [filterInput, setFilterInput] = useState(search)

  const updateUrlParams = (params: Partial<Record<string, string | number>>) => {
    const q = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (!value) q.delete(key)
      else q.set(key, String(value))
    })
    router.push(`?${q.toString()}`)
  }

  const { data, isLoading, error, refetch } = useQuery<PaginationResponse<GroupedUserSession>>({
    queryKey: ['admin-sessions', { search, page, limit, sortBy, sortDirection }],
    queryFn: () => getGroupedSessions({ search, page, limit, sortBy, sortDirection }),
  })

  const handleDeleteAllInactive = async () => {
    if (confirm('Czy na pewno chcesz usunąć WSZYSTKIE nieaktywne sesje?')) {
      await deleteAllInactiveSessions()
      refetch()
    }
  }

  const handleDeleteAll = async (userId: string) => {
    await deleteUserSessions(userId)
    notify.success(`Usunięto wszystkie sesje użytkownika ${userId}`, 3)
    refetch()
  }

  const handleDeleteInactive = async (userId: string) => {
    await deleteUserInactiveSessions(userId)
    notify.success(`Usunięto nieaktywne sesje użytkownika ${userId}`, 3)
    refetch()
  }

  const toggleSort = (field: string) => {
    const newDir = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc'
    updateUrlParams({ sortBy: field, sortDirection: newDir, page: 1 })
  }

  const columns: TableColumn<GroupedUserSession>[] = useMemo(() => [
    {
      label: '#',
      field: 'index',
      render: (_, i) => <span className="font-mono text-gray-500">{(page - 1) * limit + i + 1}</span>,
    },
    { label: 'Email', field: 'email', sortable: true },
    { label: 'Rola', field: 'role', sortable: true },
    { label: 'Sesje', field: 'sessionCount', sortable: true },
    { label: 'Aktywne', field: 'activeSessionCount', sortable: true },
    {
      label: 'Akcje',
      field: 'actions',
      render: (user) => (
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => router.push(`/admin/session/${user.userId}?email=${encodeURIComponent(user.email)}`)} className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white">Szczegóły</button>
          <button onClick={() => handleDeleteInactive(user.userId)} className="px-3 py-1 text-xs font-medium rounded bg-yellow-500 hover:bg-yellow-600 text-white">Usuń nieaktywne</button>
          <button onClick={() => handleDeleteAll(user.userId)} className="px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white">Usuń wszystkie</button>
        </div>
      ),
    },
  ], [page, limit])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        Sesje użytkowników
      </h1>

      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex flex-nowrap items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Szukaj po email..."
            className="w-[250px] px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <button
            onClick={() => updateUrlParams({ search: filterInput.trim(), page: 1 })}
            className="flex-shrink-0 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Szukaj
          </button>
          <button
            onClick={() => {
              setFilterInput('')
              updateUrlParams({ search: '', page: 1 })
            }}
            className="flex-shrink-0 px-4 py-2 text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 rounded"
          >
            Resetuj filtr
          </button>
        </div>


        <div>
          <button
            onClick={handleDeleteAllInactive}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Usuń wszystkie nieaktywne sesje
          </button>
        </div>
      </div>


      {isLoading ? (
        <p>Ładowanie danych...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">Błąd pobierania danych</p>
      ) : data?.data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Brak wyników.</p>
      ) : (
        <>
          <Table
            data={data?.data || []}
            columns={columns}
            rowKey={(row) => row.userId}
            sort={`${sortBy}:${sortDirection}`}
            onSortChange={toggleSort}
          />
          <Paginator
            page={page}
            total={data?.total || 0}
            limit={limit}
            allowedLimits={ALLOWED_PAGINATION_LIMITS}
            onPageChange={(newPage) => updateUrlParams({ page: newPage })}
            onLimitChange={(newLimit) => updateUrlParams({ limit: newLimit, page: 1 })}
          />
        </>
      )}
    </div>
  )
}
