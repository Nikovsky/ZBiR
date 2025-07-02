// @file: client/src/app/api/camp/[id]/route.ts
import { NextRequest } from 'next/server'
import { proxyHandler } from '@/lib/api/proxyHandler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return proxyHandler(req, `/camp/${id}`)
}