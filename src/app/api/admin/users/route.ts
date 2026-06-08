import { NextResponse } from 'next/server'
import { callHost } from '@/lib/admin'

type Body = { id: string; first_name: string; last_name?: string | null; phone: string }

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<Body> | null
  if (!body?.id || !body?.first_name || !body?.phone) {
    return NextResponse.json({ error: 'validation_failed', message: 'id, first_name, phone required' }, { status: 400 })
  }

  const upstream = await callHost('/api/admin/users', { method: 'POST', json: body })
  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  })
}
