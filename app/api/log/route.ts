import type { NextRequest } from 'next/server'
import { logResults } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const body = await request.json()
  await logResults(body)
  return Response.json({ ok: true })
}