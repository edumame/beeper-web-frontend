import { NextResponse } from 'next/server'
import { HOST, ADMIN_COOKIE } from '@/lib/admin'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { password?: string } | null
  const password = body?.password
  if (!password) {
    return NextResponse.json({ error: 'validation_failed', message: 'password required' }, { status: 400 })
  }

  const verify = await fetch(`${HOST}/api/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
    cache: 'no-store',
  })

  if (!verify.ok) {
    return NextResponse.json({ error: 'unauthorized', message: 'bad password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
