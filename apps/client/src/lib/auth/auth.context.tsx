// @file: client/src/lib/auth/auth.context.tsx
'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useSession, SESSION_QUERY_KEY } from '@/lib/hooks/useSession'
import type { SessionResponse } from '@zbir/types'
import { SessionExpiryPopup } from '@/components/ui/SessionExpiryPopup'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useSessionStore } from '@/store/session.zustand'
import { notify } from '@/store/notification.zustand'

type AuthContextValue = {
  sessionQuery: UseQueryResult<SessionResponse, Error>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const sessionQuery = useSession()
  const queryClient = useQueryClient()
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    expiresAt,
    setExpiresAt,
    visible,
    setVisible,
    reset,
    setSession,
    setHydrated
  } = useSessionStore()

  const logout = async () => {
    reset()
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY })
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const extendSession = async () => {
    try {
      await fetch('/api/auth/refresh', { method: 'POST' })
      setVisible(false)
      await sessionQuery.refetch()
    } catch {
      logout()
    }
  }

  useEffect(() => {
    setSession(sessionQuery.data ?? null)
    if (sessionQuery.data?.exp) {
      setExpiresAt(sessionQuery.data.exp * 1000)
    }
    setHydrated()
  }, [sessionQuery.data])

  useEffect(() => {
    if (!expiresAt) return

    const now = Date.now()
    const timeLeft = expiresAt - now

    if (timeLeft <= 0) {
      logout()
      return
    }

    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current)
    logoutTimeoutRef.current = setTimeout(logout, timeLeft)

    const warningTime = timeLeft - 5 * 60_000
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    if (warningTime <= 0) {
      setVisible(true)
    } else {
      warningTimeoutRef.current = setTimeout(() => {
        setVisible(true)
      }, warningTime)
    }

    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    }
  }, [expiresAt])

  return (
    <AuthContext.Provider value={{ sessionQuery, logout }}>
      {children}

      {expiresAt && visible && (
        <SessionExpiryPopup
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const reset = useSessionStore((s) => s.reset)

  return async () => {
    try {
      reset()
      queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY })
      await fetch('/api/auth/logout', { method: 'POST' })
      notify.success('Zostałeś wylogowany', 3)
    } catch {
      notify.error('Wylogowanie nie powiodło się', 5)
    } finally {
      window.location.href = '/login'
    }
  }
}
