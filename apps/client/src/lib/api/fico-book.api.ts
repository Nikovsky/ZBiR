// @file: client/src/lib/api/fico-book.api.ts
import { api } from '@/lib/api/axios'
import type { PaginationQuery, FicoBookPanelDto, FicoBookPanelCreateDto, FicoPagePanelSortFields, FicoBookPanelWithOwnerDto, FicoPanelViewDto, FicoPanelWithOwnerViewDto, FicoBookPanelSortFields, PaginationResponse, APIMessageResponse } from '@zbir/types'

export async function getFicoBooks(
  query: PaginationQuery<FicoBookPanelSortFields>
): Promise<PaginationResponse<FicoBookPanelDto | FicoBookPanelWithOwnerDto>> {
  const res = await api.get('/fico/books', { params: query })
  return res.data
}

export async function createFicoBook(data: FicoBookPanelCreateDto): Promise<APIMessageResponse> {
  return await api.post('/fico/book/create', data)
}

export async function getFicoBookPanel(
  bookId: string,
  query?: PaginationQuery<FicoPagePanelSortFields>
): Promise<PaginationResponse<FicoPanelViewDto | FicoPanelWithOwnerViewDto>> {
  const res = await api.get(`/fico/book/${bookId}`, {
    params: query,
  })
  return res.data
}