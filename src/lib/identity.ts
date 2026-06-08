'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const KEY = 'beeper_user'

/**
 * Identity is whatever /api/auth/me returns. The HttpOnly cookie is the source
 * of truth — localStorage just caches the user_id so the UI can render
 * optimistically while /api/auth/me is in flight.
 *
 * Returns `[me, setMe, loaded]` where `setMe(null)` clears the cache (used by
 * "switch identity" in the header — the cookie is cleared by hitting /login
 * which triggers a fresh verify flow).
 */
export function useIdentity(): [string | null, (id: string | null) => void, boolean] {
  const [me, setMe] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
    if (cached) setMe(cached)

    api.me()
      .then(m => {
        console.log(`[beeper] identity: signed in as ${m.user_id}`)
        setMe(m.user_id)
        if (typeof window !== 'undefined') localStorage.setItem(KEY, m.user_id)
      })
      .catch(e => {
        const status = (e as Error & { status?: number }).status
        if (status === 401) {
          console.log('[beeper] identity: no session, redirecting to /login')
        } else {
          console.error('[beeper] identity: /api/auth/me failed', e)
        }
        setMe(null)
        if (typeof window !== 'undefined') localStorage.removeItem(KEY)
      })
      .finally(() => setLoaded(true))
  }, [])

  const update = (id: string | null) => {
    if (typeof window !== 'undefined') {
      if (id) localStorage.setItem(KEY, id)
      else    localStorage.removeItem(KEY)
    }
    setMe(id)
  }
  return [me, update, loaded]
}
