// @file: client/src/app/[locale]/camp/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { getCamps } from '@/lib/api/camp.api'
import { CampTable } from '@/components/tanstack/camp/CampTable'
import { useSearchParams, useRouter } from 'next/navigation'
import { SortingState } from '@tanstack/react-table'
import { CampPanelSortFields, SortDirection } from '@zbir/types'
import type { OnChangeFn } from '@tanstack/react-table'
import Paginator from '@/components/ui/Paginator'

export default function CampListPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    
    const sortByRaw = searchParams.get('sortBy')
    const sortDirectionRaw = searchParams.get('sortDirection')

    const sortBy = sortByRaw ? (sortByRaw as CampPanelSortFields) : undefined
    const sortDirection = sortDirectionRaw ? (sortDirectionRaw as SortDirection) : undefined

    const sorting: SortingState = sortBy && sortDirection
    ? [{ id: sortBy, desc: sortDirection === SortDirection.DESC }]
    : []

    const params = { sortBy, sortDirection, page, limit }

    const onSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
        let nextState: SortingState
        if (typeof updaterOrValue === 'function') {
            nextState = updaterOrValue(sorting)
        } else {
            nextState = updaterOrValue
        }

        const q = new URLSearchParams(searchParams.toString())

        if (nextState.length === 0) {
            q.delete('sortBy')
            q.delete('sortDirection')
            router.push(`?${q.toString()}`)
            return
        }

        const next = nextState[0]
        q.set('sortBy', next.id)
        q.set('sortDirection', next.desc ? 'desc' : 'asc')
        router.push(`?${q.toString()}`)
    }

    const { data, isLoading } = useQuery({
        queryKey: ['camp-list', { params }],
        queryFn: () => getCamps(params),
    })

    return(
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>Twoje obozy</h1>

            {isLoading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <>
                    <CampTable data={data?.data ?? []}
                    sorting={sorting}
                    onSortingChange={onSortingChange} 
                    />
                    <Paginator
                        page={page}
                        limit={limit}
                        total={data?.total ?? 0}
                        onPageChange={(newPage) => {
                            const q = new URLSearchParams(searchParams.toString())
                            q.set('page', String(newPage))
                            router.push(`?${q.toString()}`)
                        }}
                        onLimitChange={(newLimit) => {
                            const q = new URLSearchParams(searchParams.toString())
                            q.set('limit', String(newLimit))
                            q.set('page', '1')
                            router.push(`?${q.toString()}`)
                        }}
                    />
                </>
            )}
        </div>
    )
}