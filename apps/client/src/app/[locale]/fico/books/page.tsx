'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getFicoBooks
} from '@/lib/api/fico-book.api'
import {
  FicoBookPanelDto,
  FicoBookPanelWithOwnerDto,
  PaginationResponse,
  SortDirection,
  DEFAULT_PAGINATION_LIMIT,
  ALLOWED_PAGINATION_LIMITS,
  FicoBookPanelSortFields
} from '@zbir/types'
import Paginator from '@/components/ui/Paginator'
import Table from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { notify } from '@/store/notification.zustand'

type Book = FicoBookPanelDto | FicoBookPanelWithOwnerDto

export default function FicoBookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const rawLimit = Number(searchParams.get('limit'))
  const limit = (ALLOWED_PAGINATION_LIMITS as readonly number[]).includes(rawLimit)
    ? rawLimit
    : DEFAULT_PAGINATION_LIMIT
  const sortBy = searchParams.get('sortBy') || 'name'
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

  const { data, isLoading, error, refetch } = useQuery<PaginationResponse<FicoBookPanelDto | FicoBookPanelWithOwnerDto>>({
    queryKey: ['fico-books', { search, page, limit, sortBy, sortDirection }],
    queryFn: () => getFicoBooks({ search, page, limit, sortBy: sortBy as FicoBookPanelSortFields, sortDirection }),
  })

  const handleDelete = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć księgę?')) {
      // await deleteFicoBook(id)
      // notify.success('Usunięto księgę.', 3)
      // refetch()
    }
  }

  const toggleSort = (field: string) => {
    const newDir = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc'
    updateUrlParams({ sortBy: field, sortDirection: newDir, page: 1 })
  }

  const columns: TableColumn<Book>[] = useMemo(() => [
    {
      label: '#',
      field: 'index',
      render: (_, i) => <span className="font-mono text-gray-500">{(page - 1) * limit + i + 1}</span>,
    },
    { label: 'Nazwa', field: 'name', sortable: true },
    { label: 'Opis', field: 'description' },
    { label: 'Region', field: 'region', sortable: true },
    { label: 'Otwarcie', field: 'openedAt', sortable: true },
    { label: 'Zamknięcie', field: 'closedAt' },
    { label: 'Bilans', field: 'balanceSum' },
    {
      label: 'Właściciel',
      field: 'owner',
      render: (b) =>
        'owner' in b
          ? <span>{b.owner.name ?? b.owner.email}</span>
          : <span className="italic text-gray-400">Brak</span>,
    },
    {
      label: 'Akcje',
      field: 'actions',
      render: (book) => (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => router.push(`/fico/book/${book.id}`)}
            className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Szczegóły
          </button>
          <button
            onClick={() => handleDelete(book.id)}
            className="px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Usuń
          </button>
        </div>
      ),
    },
  ], [page, limit])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        Księgi finansowe
      </h1>

      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div className="flex flex-nowrap items-center gap-2">
          <input
            type="text"
            placeholder="Szukaj po nazwie lub opisie..."
            className="w-[250px] px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <button
            onClick={() => updateUrlParams({ search: filterInput.trim(), page: 1 })}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Szukaj
          </button>
          <button
            onClick={() => {
              setFilterInput('')
              updateUrlParams({ search: '', page: 1 })
            }}
            className="px-4 py-2 text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 rounded"
          >
            Resetuj filtr
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
