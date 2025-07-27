// @file: client/src/app/api/fico/books/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  return proxyHandler(req, '/fico/book', 'POST')
}