import type { NextRequest } from 'next/server'
import { validate200Response } from '@/components/200response/validator'
import { validateH1 } from '@/components/h1-validator/validator'
import { validateCloudflare } from '@/components/cloudflare/validator'
import { validateMagentoVersion } from '@/components/magentoVersion/validator'

export async function POST(request: NextRequest) {
  let body: { url?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { url } = body
  if (!url) {
    return Response.json({ error: 'URL is required' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return Response.json({ error: 'Only http and https URLs are supported' }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteAudit/1.0)' },
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: `Could not reach URL: ${message}` }, { status: 400 })
  }

  if (res.status !== 200 && res.status !== 201) {
    return Response.json({
      type: 'http_status_error',
      statusCode: res.status,
      message: `Expected a 200 or 201 response but the server returned ${res.status} ${res.statusText}.`,
    })
  }

  const headers: Record<string, string> = {}
  res.headers.forEach((value, key) => { headers[key.toLowerCase()] = value })

  const html = await res.text()
  const results = [
    validate200Response(res.status),
    await validateMagentoVersion(parsed.origin),
    validateCloudflare(headers),
    validateH1(html),
  ]

  return Response.json({ url, results })
}
