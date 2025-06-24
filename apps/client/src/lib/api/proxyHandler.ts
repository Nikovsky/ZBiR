// @file: client/src/lib/api/proxyHandler.ts
import { type NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL!
if (!API_URL) throw new Error('API_URL is not defined')

export async function proxyHandler(
  req: NextRequest,
  backendPath: string,
  methodOverride?: string
): Promise<NextResponse> {
  const method = methodOverride || req.method

  const search = req.nextUrl.search || ''
  const url = `${API_URL}${backendPath}${search}`

  const headers = new Headers(req.headers)
  const cookie = req.headers.get('cookie')
  if (cookie) headers.set('cookie', cookie)
  if (!headers.has('content-type')) headers.set('Content-Type', 'application/json')

  const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await req.text() : undefined

  const backendResponse = await fetch(url, {
    method,
    headers,
    body,
    credentials: 'include',
  })

  const setCookies = backendResponse.headers.getSetCookie?.() || []
  const responseHeaders = new Headers()
  const contentType = backendResponse.headers.get('content-type') || 'application/json'
  responseHeaders.set('Content-Type', contentType)
  responseHeaders.set('Access-Control-Allow-Credentials', 'true')
  for (const cookie of setCookies) {
    responseHeaders.append('set-cookie', cookie)
  }

  const responseText = await backendResponse.text()
  console.log('[PROXY] Forwarded Set-Cookie headers:', setCookies)

  return new NextResponse(responseText, {
    status: backendResponse.status,
    headers: responseHeaders,
  })
}
