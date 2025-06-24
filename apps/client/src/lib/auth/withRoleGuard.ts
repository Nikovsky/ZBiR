// @file: client/src/lib/auth/withRoleGuard.ts
import { redirect } from 'next/navigation'
import { getMe } from './server.auth'
import { UserRole } from '@zbir/types'

export async function withRoleGuard(
  allowedRoles: UserRole[],
  redirectTo = '/unauthorized'
) {
  const user = await getMe()
  if (!user || !allowedRoles.includes(user.role)) { redirect(redirectTo) }
  return user
}
