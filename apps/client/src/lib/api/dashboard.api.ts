// @file: client/src/lib/api/user/dashboard.api.ts
import { api } from '@/lib/api/axios'
import type { PublicUserAccountDto, UpdateUserAccountDto, APIMessageResponse } from '@zbir/types'

export async function getUserDashboard(): Promise<PublicUserAccountDto> {
  const res = await api.get<PublicUserAccountDto>('/user/dashboard')
  return res.data
}

export async function updateUserDashboard(payload: UpdateUserAccountDto): Promise<APIMessageResponse> {
  console.log(payload)
  return await api.patch('/user/dashboard/update', payload)
}

export const changeUserPassword = async (data: {
  currentPassword: string
  newPassword: string
}): Promise<APIMessageResponse> => {
  const res = await api.patch('/user/dashboard/change-password', data)
  return res.data
}