// @file: client/src/components/ui/Paginator.tsx
'use client'

import { useMemo, useState } from 'react'
import { ALLOWED_PAGINATION_LIMITS } from '@zbir/types'

export type PaginatorProps = {
  page: number
  limit: number
  total: number
  allowedLimits?: readonly number[]
  onPageChange: (newPage: number) => void
  onLimitChange: (newLimit: number) => void
}

export default function Paginator({
  page,
  limit,
  total,
  allowedLimits = ALLOWED_PAGINATION_LIMITS,
  onPageChange,
  onLimitChange,
}: PaginatorProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const [inputPage, setInputPage] = useState<number>(page)

  const pagesToShow = useMemo(() => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
    return Array.from({ length: 5 }, (_, i) => start + i).filter(p => p <= totalPages)
  }, [page, totalPages])

  const handlePageInput = () => {
    if (inputPage >= 1 && inputPage <= totalPages && inputPage !== page) {
      onPageChange(inputPage)
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Strona {page} z {totalPages} • Łącznie {total} wierszy
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-gray-600 dark:text-gray-400">Na stronę:</label>
        <select
          className="px-2 py-1 border-none focus:outline-none rounded bg-white dark:bg-gray-800 text-sm"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {allowedLimits.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <button
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          First
        </button>

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          ←
        </button>

        {pagesToShow.map((p) => (
          p === page ? (
            <input
              key="input"
              type="number"
              min={1}
              max={totalPages}
              value={inputPage}
              onBlur={handlePageInput}
              onKeyDown={(e) => e.key === 'Enter' && handlePageInput()}
              onChange={(e) => setInputPage(Number(e.target.value))}
              className="w-16 px-3 py-1 text-sm text-center bg-blue-600 text-white rounded outline-none border-0 ring-2 ring-blue-500 focus:ring-blue-400
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              [appearance:textfield]"
            />
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              {p}
            </button>
          )
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          →
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  )
}