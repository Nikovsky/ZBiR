// @file: client/src/app/api/admin/user/route.ts
import { proxyHandler } from '@/lib/api/proxyHandler'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return proxyHandler(req, '/admin/user')
}

export async function POST(req: NextRequest) {
  return proxyHandler(req, '/admin/user')
}