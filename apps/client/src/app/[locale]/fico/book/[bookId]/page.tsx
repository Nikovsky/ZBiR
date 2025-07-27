// @file: client/src/app/[locale]/fico/book/[bookId]/page.tsx
'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  FicoPanelViewDto,
  FicoPanelWithOwnerViewDto,
  FicoPageWithEntriesPanelDto,
  FicoEntryType,
  FicoMoneyValue,
  PaginationResponse,
  DEFAULT_PAGINATION_LIMIT,
  ALLOWED_PAGINATION_LIMITS,
  FicoPagePanelSortFields,
  SortDirection,
} from '@zbir/types'
import { getFicoBookPanel } from '@/lib/api/fico-book.api'
import Table from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import Paginator from '@/components/ui/Paginator'
import { FicoBookPanelDto, FicoBookPanelWithOwnerDto } from '@zbir/types'

function formatMoney(value: FicoMoneyValue): string {
  const amount = Number(value?.valueOf()) || 0
  const currency = value && typeof value === 'object' && value !== null && 'currency' in value
    ? (value as { currency: string }).currency
    : 'PLN'
  return amount.toLocaleString('pl-PL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

type Panel = FicoPanelViewDto | FicoPanelWithOwnerViewDto

export default function FicoBookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const rawLimit = Number(searchParams.get('limit'))
  const limit = (ALLOWED_PAGINATION_LIMITS as readonly number[]).includes(rawLimit)
    ? rawLimit
    : DEFAULT_PAGINATION_LIMIT
  const sortBy = (searchParams.get('sortBy') as FicoPagePanelSortFields) || 'timestamp'
  const rawSortDir = searchParams.get('sortDirection')
  const sortDirection: SortDirection = rawSortDir === 'desc' ? SortDirection.DESC : SortDirection.ASC

  const updateUrlParams = (params: Partial<Record<string, string | number>>) => {
    const q = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (!value) q.delete(key)
      else q.set(key, String(value))
    })
    router.push(`?${q.toString()}`)
  }

  const toggleSort = (field: string) => {
    const newDir = sortBy === field && sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    updateUrlParams({ sortBy: field, sortDirection: newDir, page: 1 })
  }

  const { data, isLoading, error, refetch } = useQuery<PaginationResponse<FicoPanelViewDto | FicoPanelWithOwnerViewDto>>({
    queryKey: ['fico-book', { page, limit, sortBy, sortDirection }],
    queryFn: () => getFicoBookPanel(bookId as string, { page, limit, sortBy, sortDirection }),
  })

  const columns: TableColumn<FicoPageWithEntriesPanelDto>[] = useMemo(() => [
    { label: 'Nazwa strony', field: 'name', sortable: true },
    { label: 'Numer faktury', field: 'invoiceNumber', sortable: true },
    {
      label: 'Data',
      field: 'timestamp',
      sortable: true,
      render: (p) => formatDate(p.timestamp),
    },
    {
      label: 'Typ',
      field: 'type',
      sortable: true,
      render: (p) => p.type === FicoEntryType.INCOME ? 'Przychód' : 'Wydatek',
    },
    {
      label: 'Wartość',
      field: 'value',
      sortable: true,
      render: (p) => formatMoney(p.value),
    },
    {
      label: 'Liczba pozycji',
      field: 'entriesCount',
      render: (p) => p.entries.length,
    },
    {
      label: 'Akcje',
      field: 'actions',
      render: (p) => (
        <button
          onClick={() => router.push(`/fico/page/${p.id}`)}
          className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          Szczegóły
        </button>
      ),
    },
  ], [router, sortBy, sortDirection])

  function Owner(book: FicoBookPanelDto | FicoBookPanelWithOwnerDto): book is FicoBookPanelWithOwnerDto {
    return typeof book === 'object' && book !== null && 'owner' in book
  }

  if (isLoading) return <p className="p-6">Ładowanie danych...</p>
  if (error) return <p className="p-6 text-red-600 dark:text-red-400">Błąd pobierania danych</p>
  if (!data || data.data.length === 0) return <p className="p-6 italic text-gray-500">Nie znaleziono danych dla księgi.</p>

  const panel = data.data[0]
  const { book, pages, categories } = panel
  const hasOwner = Owner(book)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          {book.name}
        </h1>
        <button onClick={() => router.back()} className="btn btn-sm btn-outline">
          ⬅ Wróć
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div><strong>Region:</strong> {book.region}</div>
        <div><strong>Status:</strong> {book.isClosed ? 'Zamknięta' : 'Otwarta'}</div>
        <div><strong>Data otwarcia:</strong> {formatDate(book.openedAt)}</div>
        {book.closedAt && <div><strong>Data zamknięcia:</strong> {formatDate(book.closedAt)}</div>}
        {hasOwner && (
          <div className="sm:col-span-2">
            <strong>Właściciel:</strong> {book.owner.name ?? book.owner.email}
          </div>
        )}
        {book.description && (
          <div className="sm:col-span-2">
            <strong>Opis:</strong> {book.description}
          </div>
        )}
        <div><strong>Przychody:</strong> {formatMoney(book.incomeSum)}</div>
        <div><strong>Wydatki:</strong> {formatMoney(book.expenseSum)}</div>
        <div><strong>Bilans:</strong> {formatMoney(book.balanceSum)}</div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Strony księgi</h2>

      {!pages || pages.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">Brak stron w tej księdze.</p>
      ) : (
        <Table
          data={pages}
          columns={columns}
          rowKey={(p) => p.id}
          sort={`${sortBy}:${sortDirection}`}
          onSortChange={toggleSort}
        />
      )}

      <Paginator
        page={page}
        total={data.total || 0}
        limit={limit}
        allowedLimits={ALLOWED_PAGINATION_LIMITS}
        onPageChange={(newPage) => updateUrlParams({ page: newPage })}
        onLimitChange={(newLimit) => updateUrlParams({ limit: newLimit, page: 1 })}
      />

      {categories && categories.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">Kategorie</h2>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span> ({c.type === 'INCOME' ? 'Przychód' : 'Wydatek'})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
