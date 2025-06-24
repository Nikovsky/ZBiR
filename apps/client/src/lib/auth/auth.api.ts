// @file: client/src/lib/auth/auth.api.ts
import { api } from '@/lib/api/axios'
import type { SessionResponse } from '@zbir/types'

export const fetchMe = async (): Promise<SessionResponse> => {
  const res = await api.get('/auth/session')
  return res.data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const refreshSession = async (): Promise<SessionResponse> => {
  const res = await api.post<SessionResponse>('/auth/refresh')
  return res.data
}