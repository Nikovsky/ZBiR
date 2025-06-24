// @file: client/src/app/api/admin/session/user/[id]/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  return proxyHandler(req, `/admin/session/${id}`)
}
