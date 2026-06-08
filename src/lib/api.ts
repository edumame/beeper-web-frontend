// Empty default → calls hit the same-origin proxy from next.config.ts
// (`/api/:path*` → beeper-v2-host). Required because cross-origin set-cookie
// is blocked by Safari ITP / Chrome third-party cookie restrictions even
// with SameSite=None; Secure. Override available via the env var for any
// client that genuinely needs cross-origin (e.g. a local dev pointing at a
// remote host).
const BASE = process.env.NEXT_PUBLIC_BEEPER_API_URL ?? ''

export type Urgency = 'low' | 'normal' | 'high'
export type BeepStatus = 'open' | 'closed' | 'declined'

export type Beep = {
  id: string
  from: string
  to: string
  task: string
  cwd: string | null
  urgency: Urgency
  status: BeepStatus
  request_transcript: boolean
  created_at: string
  closed_at: string | null
  reply?: string
  decline_reason?: string
  transcript_status?: string | null
}

export type User = { id: string; display_name: string }
export type Me = {
  user_id: string
  display_name: string
  first_name: string | null
  last_name: string | null
  is_admin: boolean
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`
  const method = init?.method ?? 'GET'
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
      credentials: 'include',
      cache: 'no-store',
    })
  } catch (e) {
    // Network-level failure (DNS, offline, CORS preflight, cert). The browser
    // gives no useful message in console by default — surface what we know.
    console.error(`[beeper] ${method} ${url} → network error`, e)
    throw new Error(`network error: ${(e as Error).message}`)
  }
  const text = await res.text()
  let data: unknown = undefined
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    // Non-JSON body — usually Vercel's static 404 HTML. Keep `text` for the
    // error message so the user sees what actually came back.
  }
  if (!res.ok) {
    const errCode = (data && typeof data === 'object' && 'error' in data)
      ? (data as { error: string }).error : `http_${res.status}`
    const errMsg = (data && typeof data === 'object' && 'message' in data)
      ? (data as { message: string }).message
      : (text ? text.slice(0, 200) : res.statusText)
    console.error(`[beeper] ${method} ${url} → ${res.status} ${errCode}: ${errMsg}`)
    const err = new Error(`${errCode}: ${errMsg}`)
    ;(err as Error & { status: number; url: string; method: string }).status = res.status
    ;(err as Error & { status: number; url: string; method: string }).url = url
    ;(err as Error & { status: number; url: string; method: string }).method = method
    throw err
  }
  return data as T
}

export const api = {
  me: () => req<Me>('/api/auth/me'),

  requestCode: (phone: string) =>
    req<{ ok: true; request_id: string }>(
      '/api/auth/request', { method: 'POST', body: JSON.stringify({ phone }) },
    ),

  verifyCode: (phone: string, code: string) =>
    req<{ ok: true; user_id: string }>(
      '/api/auth/verify', { method: 'POST', body: JSON.stringify({ phone, code }) },
    ),

  listUsers: () => req<{ users: User[] }>('/api/users').then(r => r.users),

  inbox: (me: string) =>
    req<{ beeps: Beep[] }>(`/api/beeps?to=${encodeURIComponent(me)}&status=open`).then(r => r.beeps),

  sent: (me: string) =>
    req<{ beeps: Beep[] }>(`/api/beeps?from=${encodeURIComponent(me)}`).then(r => r.beeps),

  send: (body: { from: string; to: string; task: string; cwd?: string; urgency?: Urgency; request_transcript?: boolean }) =>
    req<{ id: string; created_at: string; recipient_notified: boolean }>(
      '/api/beeps', { method: 'POST', body: JSON.stringify(body) },
    ),

  reply: (id: string, by: string, reply: string) =>
    req<{ id: string; status: 'closed'; sender_notified: boolean }>(
      `/api/beeps/${id}/reply`, { method: 'POST', body: JSON.stringify({ by, reply }) },
    ),

  decline: (id: string, by: string, reason: string) =>
    req<{ id: string; status: 'declined'; sender_notified: boolean }>(
      `/api/beeps/${id}/decline`, { method: 'POST', body: JSON.stringify({ by, reason }) },
    ),

  allowlist: (owner: string) =>
    req<{ edges: { owner: string; sender: string; added_at: string }[] }>(
      `/api/allowlist?owner=${encodeURIComponent(owner)}`,
    ).then(r => r.edges),
}

export function formatTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()
  if (sameDay) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  if (isYesterday) return 'YESTERDAY'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
}
