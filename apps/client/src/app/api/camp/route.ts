// @file: client/src/app/api/camp/route.ts
import { proxyHandler } from "@/lib/api/proxyHandler";
import { NextRequest } from "next/server";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    return proxyHandler(req, '/camp')
}