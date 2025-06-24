// @file: client/src/app/api/auth/refresh/route.ts

import { type NextRequest } from 'next/server'
import { proxyHandler } from '@/lib/api/proxyHandler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  return proxyHandler(req, '/auth/refresh', 'POST')
}
