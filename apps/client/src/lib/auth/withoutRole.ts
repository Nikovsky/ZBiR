// @file: client/src/lib/auth/withoutRole.ts
import { getMe } from './server.auth'
import { redirect } from 'next/navigation'

export async function withoutRole(redirectTo = '/dashboard') {
  const user = await getMe()
  if (user?.role) { redirect(redirectTo) }
}
