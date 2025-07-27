// @file: client/src/app/api/fico/book/[bookId]/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { bookId: string } }) {
  const { bookId } = await params
  return proxyHandler(req, `/fico/book/${bookId}/page`)
}