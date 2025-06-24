// @file: client/src/components/ui/Table.tsx
'use client'
import React from 'react'

export type TableColumn<T> = {
  label: string
  field: keyof T | string
  sortable?: boolean
  render?: (row: T, index: number) => React.ReactNode
}

export type TableProps<T> = {
  data: T[]
  columns: TableColumn<T>[]
  rowKey: (row: T) => string | number
  sort?: string
  onSortChange?: (field: string) => void
}

export default function Table<T>({
  data,
  columns,
  sort,
  onSortChange,
  rowKey,
}: TableProps<T>) {
  const [sortField, sortDir] = (sort || '').split(':')

  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={col.field as string}
                className={`px-4 py-3 ${col.sortable ? 'cursor-pointer' : ''}`}
                onClick={() => col.sortable && onSortChange?.(col.field as string)}
              >
                {col.label}{' '}
                {col.sortable && sortField === col.field && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, i) => (
            <tr key={rowKey(row)} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {columns.map((col) => (
                <td key={col.field as string} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {col.render ? col.render(row, i) : (row as any)[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}