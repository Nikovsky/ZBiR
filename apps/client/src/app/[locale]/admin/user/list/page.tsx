// @file: client/src/app/[locale]/admin/user/list/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  AdminPanelUserDto,
  PaginationResponse,
  AdminPanelUserSortFields,
  SortDirection,
  DEFAULT_PAGINATION_LIMIT,
  ALLOWED_PAGINATION_LIMITS,
} from '@zbir/types'
import Table from '@/components/ui/Table'
import Paginator from '@/components/ui/Paginator'
import { Throbber } from '@/components/ui/Throbber'
import { Check2, DashLg, Pencil, PersonAdd, Trash, XLg } from 'react-bootstrap-icons'
import { useMemo, useState } from 'react'
import { getUsers, deleteUser } from '@/lib/api/admin-user.api'
import { notify } from '@/store/notification.zustand'

export default function AdminUserListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const search = searchParams.get('search') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const rawLimit = Number(searchParams.get('limit'))
  const limit = (ALLOWED_PAGINATION_LIMITS as readonly number[]).includes(rawLimit)
    ? rawLimit
    : DEFAULT_PAGINATION_LIMIT
  const sortBy = (searchParams.get('sortBy') as AdminPanelUserSortFields) || 'createdAt'
  const rawSortDir = searchParams.get('sortDirection')
  const sortDirection: SortDirection = rawSortDir === 'desc' ? SortDirection.DESC : SortDirection.ASC
  const [filterInput, setFilterInput] = useState(search)

  const updateUrlParams = (params: Partial<Record<string, string | number>>) => {
    const q = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (!value) q.delete(key)
      else q.set(key, String(value))
    })
    router.push(`?${q.toString()}`)
  }

  const { data, isLoading, error, refetch } = useQuery<PaginationResponse<AdminPanelUserDto>>({
    queryKey: ['admin-users', { search, page, limit, sortBy, sortDirection }],
    queryFn: () => getUsers({ search, page, limit, sortBy, sortDirection }),
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return
    try {
      setDeletingId(id)
      await deleteUser(id)
      notify.success('Użytkownik został usunięty', 3)
      refetch()
    } catch (err) {
      console.error('[DELETE_USER_ERROR]', err)
    } finally {
      setDeletingId(null)
    }
  }

  const toggleSort = (field: string) => {
    const newDir = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc'
    updateUrlParams({ sortBy: field, sortDirection: newDir, page: 1 })
  }

  const columns = useMemo(() => [
    {
      label: '#',
      field: 'index',
      render: (_: any, i: number) => (page - 1) * limit + i + 1,
    },
    { field: 'email', label: 'Email', sortable: true },
    { field: 'username', label: 'Username', sortable: true },
    {
      field: 'name',
      label: 'Imię',
      sortable: true,
      render: (row: AdminPanelUserDto) => row.name || '-',
    },
    { field: 'role', label: 'Rola', sortable: true },
    {
      field: 'regionAccess',
      label: 'Region',
      sortable: true,
      render: (row: AdminPanelUserDto) => row.regionAccess || '-',
    },
    {
      field: 'isActive',
      label: 'Status',
      render: (row: AdminPanelUserDto) => row.isActive && !row.isBlocked
        ? <Check2 className="text-green-500" />
        : <XLg className="text-red-500" />,
    },
    {
      field: 'isEmailConfirmed',
      label: 'Email',
      render: (row: AdminPanelUserDto) => row.isEmailConfirmed
        ? <Check2 className="text-green-500" />
        : <XLg className="text-red-500" />,
    },
    {
      field: 'createdAt',
      label: 'Utworzono',
      sortable: true,
      render: (row: AdminPanelUserDto) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: 'lastLoginAt',
      label: 'Ostatnie logowanie',
      sortable: true,
      render: (row: AdminPanelUserDto) => row.lastLoginAt
        ? new Date(row.lastLoginAt).toLocaleString()
        : <DashLg className="text-gray-400" />,
    },
    {
      field: 'actions',
      label: 'Akcje',
      render: (row: AdminPanelUserDto) => (
        <div className="flex gap-1 flex-wrap">
          <Link href={`/admin/user/edit/${row.id}`} className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white">
            <Pencil className="inline mr-1" /> Edytuj
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white"
            disabled={deletingId === row.id}
          >
            {deletingId === row.id ? <Throbber /> : (<><Trash className="inline mr-1" />Usuń</>)}
          </button>
        </div>
      ),
    },
  ], [page, limit, deletingId])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        Zarządzanie użytkownikami
      </h1>

      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex flex-nowrap items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Szukaj po email lub username..."
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

        <Link href="/admin/user/create" className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded">
          <PersonAdd className="inline w-4 h-4 mr-2" /> Dodaj użytkownika
        </Link>
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
