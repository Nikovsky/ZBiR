// @file: client/src/app/[locale]/admin/session/[userId]/page.tsx
'use client'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_PAGINATION_LIMIT, ALLOWED_PAGINATION_LIMITS, SortDirection, PaginationResponse, UserSession } from '@zbir/types'
import { getSessions, deleteSession } from '@/lib/api/admin-session.api'
import Table, { type TableColumn } from '@/components/ui/Table'
import Paginator from '@/components/ui/Paginator'
import { useMemo, useState } from 'react'
import { ArrowLeft } from 'react-bootstrap-icons'
import { notify } from '@/store/notification.zustand'

export default function AdminUserSessionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userId } = useParams<{ userId: string }>()
  const email = searchParams.get('email') || 'Nieznany użytkownik'

  const search = searchParams.get('search') || ''
  const rawSortDir = searchParams.get('sortDirection')
  const sortDirection: SortDirection =
    rawSortDir === 'desc' ? SortDirection.DESC : SortDirection.ASC
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const rawLimit = Number(searchParams.get('limit'))
  const limit = (ALLOWED_PAGINATION_LIMITS as readonly number[]).includes(rawLimit)
    ? rawLimit
    : DEFAULT_PAGINATION_LIMIT

  const [filterInput, setFilterInput] = useState(search)

  const updateUrlParams = (params: Partial<Record<string, string | number>>) => {
    const q = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (!value) q.delete(key)
      else q.set(key, String(value))
    })
    router.push(`?${q.toString()}`)
  }

  const { data, isLoading, error, refetch } = useQuery<PaginationResponse<UserSession>>({
    queryKey: ['user-sessions', { search, page, limit, sortBy, sortDirection, userId }],
    queryFn: () => getSessions({ search, page, limit, sortBy, sortDirection, userId }),
  })

  const handleDelete = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę sesję?')) {
      await deleteSession(id)
      notify.success('Sesja została usunięta', 3)
      refetch()
    }
  }

  const toggleSort = (field: string) => {
    const newDir = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc'
    updateUrlParams({ sortBy: field, sortDirection: newDir, page: 1 })
  }

  const columns: TableColumn<UserSession>[] = useMemo(() => [
    {
      label: '#',
      field: 'index',
      render: (_, i) => <span className="font-mono text-gray-500">{(page - 1) * limit + i + 1}</span>,
    },
    { label: 'IP', field: 'ip', sortable: true },
    { label: 'Urządzenie', field: 'deviceInfo', sortable: true },
    {
      label: 'Utworzono',
      field: 'createdAt',
      sortable: true,
      render: (row) => <span>{new Date(row.createdAt).toLocaleString()}</span>,
    },
    {
      label: 'Wygasa',
      field: 'expires',
      sortable: true,
      render: (row) => <span>{new Date(row.expires).toLocaleString()}</span>,
    },
    {
      label: 'Akcje',
      field: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Usuń
        </button>
      ),
    },
  ], [page, limit, sortBy, sortDirection])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
        <button
          onClick={() => router.push('/admin/session')}
          title="Powrót do listy"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Wróć do listy sesji</span>
        </button>

        <div className="flex-1 text-center text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
          Sesje użytkownika: <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Szukaj po IP lub urządzeniu..."
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            className="w-[250px] px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            onClick={() => updateUrlParams({ search: filterInput.trim(), page: 1 })}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Filtruj
          </button>
          <button
            onClick={() => {
              setFilterInput('')
              updateUrlParams({ search: '', page: 1 })
            }}
            className="px-4 py-2 text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 rounded"
          >
            Reset
          </button>
        </div>
      </div>


      {isLoading ? (
        <p>Ładowanie danych...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">Błąd pobierania danych</p>
      ) : data?.data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Brak sesji dla tego użytkownika.</p>
      ) : (
        <>
          <Table
            data={data?.data || []}
            columns={columns}
            rowKey={(row) => row.id}
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
