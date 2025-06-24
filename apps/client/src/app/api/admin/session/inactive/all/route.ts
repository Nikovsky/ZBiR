// @file: client/src/app/api/admin/session/inactive/all/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest) {
  return proxyHandler(req, `/admin/session/inactive/all`)
}
