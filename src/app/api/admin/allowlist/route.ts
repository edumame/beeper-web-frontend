import { NextResponse } from 'next/server'
import { callHost } from '@/lib/admin'

type Body = { owner_id: string; sender_id: string }

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<Body> | null
  if (!body?.owner_id || !body?.sender_id) {
    return NextResponse.json({ error: 'validation_failed', message: 'owner_id, sender_id required' }, { status: 400 })
  }

  const upstream = await callHost('/api/admin/allowlist', { method: 'POST', json: body })
  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  })
}
