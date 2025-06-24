// @file: client/src/lib/auth/getSessionFromApi.ts
import axios from 'axios'
import { cookies } from 'next/headers'

export async function getSessionFromApi() {
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie: { name: string; value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/session`, {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    })
    return res.data
  } catch {
    return null
  }
}
