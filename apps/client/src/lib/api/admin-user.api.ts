// @file: client/src/lib/api/admin-user.api.ts
import { api } from '@/lib/api/axios'
import type { AdminPanelUserDto, AdminPanelUserSortFields, AdminPanelUserWithPersonalDataDto, PaginationQuery, AdminPanelEditUserWithPersonalDataDto, AdminPanelPasswordChangeDto, AdminPanelCreateUserDto, PaginationResponse, APIMessageResponse } from '@zbir/types'

export async function getUsers(
  query: PaginationQuery<AdminPanelUserSortFields>
): Promise<PaginationResponse<AdminPanelUserDto>> {
  const res = await api.get('/admin/user', { params: query })
  return res.data
}



export async function createUser(dto: AdminPanelCreateUserDto): Promise<APIMessageResponse> {
  return await api.post('/admin/user', dto)
}

export async function deleteUser(id: string): Promise<APIMessageResponse> {
  return await api.delete(`/admin/user/${id}`)
}

export async function updateUser(id: string, dto: AdminPanelEditUserWithPersonalDataDto): Promise<APIMessageResponse> {
  const res = await api.patch(`/admin/user/${id}`, dto)
  return res.data
}

export async function changePassword(dto: AdminPanelPasswordChangeDto): Promise<APIMessageResponse> {
  const res = await api.patch(`/admin/user/${dto.id}/password`, dto)
  return res.data
}

export const getUserById = async (id: string): Promise<AdminPanelUserWithPersonalDataDto> => {
  const res = await api.get(`/admin/user/${id}`)
  return res.data
}
