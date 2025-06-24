// @file: client/src/hooks/useSession.ts

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'
import { useSessionStore } from '@/store/session.zustand'
import type { SessionResponse } from '@zbir/types'

export const SESSION_QUERY_KEY = ['auth', 'session'] as const

export function useSession() {
  const setExpiresAt = useSessionStore((s) => s.setExpiresAt)

  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<SessionResponse>('/auth/session')
      const data = res.data
      if (data?.exp) {
        setExpiresAt(data.exp * 1000)
      }
      return data
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  })
}
