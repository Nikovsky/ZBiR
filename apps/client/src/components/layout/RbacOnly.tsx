// @file: client/src/components/rbac/RbacOnly.tsx
'use client'

import { ReactNode } from 'react'
import { useSessionStore } from '@/store/session.zustand'
import { AccessPreset } from '@zbir/types'

type Props = {
  preset: AccessPreset
  children: ReactNode
}

export function RbacOnly({ preset, children }: Props) {
  const hydrated = useSessionStore((s) => s.hydrated)
  const hasAccess = useSessionStore((s) => s.hasAccess)
  const session = useSessionStore((s) => s.session) // IMPORTANT: Ensure session is fetched before checking access

  if (!hydrated) return null
  if (!hasAccess(preset)) return null

  return <>{children}</>
}
