// @file: client/src/lib/api/fico-book.api.ts
import { api } from '@/lib/api/axios'
import type { PaginationQuery, FicoBookPanelDto, FicoBookPanelWithOwnerDto, FicoBookPanelSortFields, PaginationResponse } from '@zbir/types'

export async function getFicoBooks(
  query: PaginationQuery<FicoBookPanelSortFields>
): Promise<PaginationResponse<FicoBookPanelDto | FicoBookPanelWithOwnerDto>> {
  const res = await api.get('/fico/books', { params: query })
  return res.data
}