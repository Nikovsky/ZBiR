// @file: client/src/app/api/admin/session/inactive/[userId]/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params
  return proxyHandler(req, `/admin/session/user/inactive/${userId}`)
}
