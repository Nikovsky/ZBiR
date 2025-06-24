// @file: client/src/lib/api/admin-session.api.ts
import { api } from '@/lib/api/axios'
import type {
  GroupedUserSession,
  UserSession,
  PaginationResponse,
  PaginationQuery,
} from '@zbir/types'

export async function getGroupedSessions(query: PaginationQuery): Promise<PaginationResponse<GroupedUserSession>> {
  const res = await api.get('/admin/session', { params: query })
  return res.data
}

export async function getSessions(query: PaginationQuery & { userId: string }): Promise<PaginationResponse<UserSession>> {
  const res = await api.get(`/admin/session/${query.userId}`, {
    params: {
      search: query.search,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    },
  })
  return res.data
}

export async function deleteSession(id: string) {
  await api.delete(`/admin/session/user/${id}`)
}

export async function deleteUserSessions(userId: string) {
  await api.delete(`/admin/session/${userId}`)
}

export async function deleteUserInactiveSessions(userId: string) {
  await api.delete(`/admin/session/inactive/${userId}`)
}

export async function deleteAllInactiveSessions() {
  await api.delete('/admin/session/inactive/all')
}
