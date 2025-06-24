// @file: client/src/lib/auth/withRolePresetGuard.ts
import { AccessMap, AccessPreset } from '@zbir/types'
import { redirect } from 'next/navigation'
import { getMe } from './server.auth'

export async function withRolePresetGuard(preset: AccessPreset, redirectTo = '/unauthorized') {
  const session = await getMe()

  if (preset === AccessPreset.NON_LOGGED) {
    if (session?.role) { redirect(redirectTo) }
    return null
  }

  const role = session?.role
  const allowedRoles = AccessMap[preset]

  if (!role || !allowedRoles.includes(role)) { redirect(redirectTo) }
  return session
}
