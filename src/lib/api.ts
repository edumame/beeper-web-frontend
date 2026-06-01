const BASE = process.env.NEXT_PUBLIC_BEEPER_API_URL ?? 'https://beeper-v2-host.vercel.app'

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

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const err = (data && typeof data === 'object' && 'message' in data)
      ? new Error(`${(data as { error: string }).error}: ${(data as { message: string }).message}`)
      : new Error(`${res.status} ${res.statusText}`)
    ;(err as Error & { status: number }).status = res.status
    throw err
  }
  return data as T
}

export const api = {
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
