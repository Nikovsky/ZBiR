// @file: client/src/store/session.zustand.ts

import { create } from 'zustand'
import { SessionResponse, UserRole, AccessPreset, AccessMap } from '@zbir/types'

interface SessionState {
  session: SessionResponse | null
  hydrated: boolean
  expiresAt: number | null
  visible: boolean
  countdown: number
  setSession: (s: SessionResponse | null) => void
  setExpiresAt: (ts: number | null) => void
  setVisible: (v: boolean) => void
  setCountdown: (c: number) => void
  setHydrated: () => void
  hasAccess: (preset: AccessPreset) => boolean
  reset: () => void
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  session: null,
  hydrated: false,
  expiresAt: null,
  visible: false,
  countdown: 0,

  setSession: (s) => set({ session: s, expiresAt: s?.exp ? s.exp * 1000 : null }),
  setExpiresAt: (ts) => set({ expiresAt: ts }),
  setVisible: (v) => set({ visible: v }),
  setCountdown: (c) => set({ countdown: c }),
  setHydrated: () => set({ hydrated: true }),

  hasAccess: (preset) => {
    const role = get().session?.role
    if (!role && preset === AccessPreset.NON_LOGGED) return true
    if (!role) return false
    return AccessMap[preset].includes(role)
  },

  reset: () => set({ session: null, hydrated: false, expiresAt: null, visible: false, countdown: 0 }),
}))
