// @file: client/src/components/tanstack/camp/CampTable.tsx
'use client'

import { useReactTable, getCoreRowModel, flexRender, ColumnDef, SortingState, getSortedRowModel, OnChangeFn } from '@tanstack/react-table'
import { CampPanelDto, UserRole } from '@zbir/types'
import Link from 'next/link'
import { useSessionStore } from '@/store/session.zustand'

type Props = {
    data: CampPanelDto[]
    sorting: SortingState
    onSortingChange: OnChangeFn<SortingState>
}

const defaultColumns: ColumnDef<CampPanelDto>[] = [
    {
        header: 'Nazwa',
        accessorKey: 'name',
    },
    {
        header: 'Rok',
        accessorKey: 'year',
    },
    {
        header: 'Region',
        accessorKey: 'region',
    },
    {
        header: 'Status',
        accessorKey: 'isClosed',
        cell: ({ getValue }) => {
            const isClosed = getValue<boolean>()
            return (
                <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isClosed
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}
                >
                    {isClosed ? 'Zamknięte' : 'Otwarte'}
                </span>
            )
        }
    },
    {
        id: 'actions',
        header: 'Akcje',
        cell: ({ row }) => {
            const camp = row.original
            const { session, hydrated } = useSessionStore()
            const role = session?.role
            const userId = session?.id

            const canEdit =
            role === UserRole.SKARBNIK ||
            role === UserRole.SKARBNIK_REGION ||
            (role === UserRole.USER && userId === camp.ownerId && !camp.isClosed)

            const canDelete =
            (role === UserRole.SKARBNIK || role === UserRole.SKARBNIK_REGION) && !camp.isClosed

            if (!hydrated) return null

            return (
            <div className="flex gap-2 flex-wrap">
                <Link
                href={`/camp/${camp.id}`}
                className="inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                Szczegóły
                </Link>

                {canEdit && (
                <Link
                    href={`/camp/${camp.id}/edit`}
                    className="inline-block px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
                >
                    Edytuj
                </Link>
                )}

                {canDelete && (
                <button
                    onClick={() => alert(`Potwierdź usunięcie obozu ${camp.name}`)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                    Usuń
                </button>
                )}
            </div>
            )
        },
    }
]

export function CampTable({ data, sorting, onSortingChange }: Props) {
    const table = useReactTable({
        data,
        columns: defaultColumns,
        state: {
            sorting,
        },
        onSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <table className="min-w-full divide-y divide-gray-200 dark:divided-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none" onClick={header.column.getToggleSortingHandler()}
                                >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === 'asc' && ' ↑'}
                                {header.column.getIsSorted() === 'desc' && ' ↓'}
                                </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}