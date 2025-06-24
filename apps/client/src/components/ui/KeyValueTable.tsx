// @file: client/src/components/ui/KeyValueTable.tsx
'use client'
import React from 'react'

type Row = {
  label: string
  content: React.ReactNode
}

export default function KeyValueTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left">
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 w-1/3">
                {row.label}
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {row.content}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}