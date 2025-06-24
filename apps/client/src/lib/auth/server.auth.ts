// @file: client/src/lib/auth/server.auth.ts
import { cookies } from 'next/headers'
import { SessionResponse } from '@zbir/types'

export async function getMe(): Promise<SessionResponse | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  if (!accessToken) return null

  try {
    const res = await fetch('http://localhost:3000/api/auth/session', {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) return null
    return (await res.json()) as SessionResponse
  } catch (err) {
    console.error('getMe() error:', err)
    return null
  }
}
