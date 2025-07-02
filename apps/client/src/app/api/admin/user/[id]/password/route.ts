// @file: client/src/app/api/admin/user/[id]/password/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyHandler(req, `/admin/user/${params.id}/password`)
}
