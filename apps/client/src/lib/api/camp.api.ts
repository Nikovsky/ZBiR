// @file: client/src/lib/api/camp.api.ts
import { api } from '@/lib/api/axios'
import type { CampPanelDto, CampPanelSortFields, PaginationResponse, PaginationQuery } from '@zbir/types'

export async function getCamps(query: PaginationQuery<CampPanelSortFields>
): Promise<PaginationResponse<CampPanelDto>> {
    const res = await api.get('/camp', { params: query })
    return res.data
}

export async function getCampById(id: string): Promise<CampPanelDto> {
    const res = await api.get(`/camp/${id}`)
    return res.data
}