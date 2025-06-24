// @file: client/src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { proxyHandler } from '@/lib/api/proxyHandler';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: any): Promise<NextResponse> {
  return proxyHandler(req, '/auth/register');
}