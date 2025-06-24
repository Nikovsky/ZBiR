// @file: client/src/app/api/admin/user/[id]/route.ts
import { NextRequest } from 'next/server'
import { proxyHandler } from '@/lib/api/proxyHandler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  return proxyHandler(req, `/admin/user/${id}`)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  return proxyHandler(req, `/admin/user/${id}`)
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  return proxyHandler(req, `/admin/user/${id}`)
}