// @file: client/src/app/api/user/dashboard/change-password/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  return proxyHandler(req, '/user/dashboard/password')
}
