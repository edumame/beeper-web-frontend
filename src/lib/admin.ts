import { cookies } from 'next/headers'

export const HOST = process.env.BEEPER_API_URL
  ?? process.env.NEXT_PUBLIC_BEEPER_API_URL
  ?? 'https://beeper-v2-host.vercel.app'

export const ADMIN_COOKIE = 'beeper_admin_pwd'

export async function getAdminPassword(): Promise<string | null> {
  const c = await cookies()
  return c.get(ADMIN_COOKIE)?.value ?? null
}

export async function callHost(path: string, init: RequestInit & { json?: unknown } = {}): Promise<Response> {
  const pwd = await getAdminPassword()
  if (!pwd) return new Response(JSON.stringify({ error: 'unauthorized', message: 'log in first' }), { status: 401 })

  const { json, headers, ...rest } = init
  const finalHeaders = new Headers(headers)
  finalHeaders.set('cookie', `beeper_admin=${pwd}`)
  if (json !== undefined) finalHeaders.set('content-type', 'application/json')

  return fetch(`${HOST}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : init.body,
    cache: 'no-store',
  })
}
