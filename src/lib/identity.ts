'use client'

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'

const KEY = 'beeper_user'

/**
 * Identity is whatever /api/auth/me returns, held in a single shared context so
 * every consumer reads the same value. The HttpOnly cookie is the source of
 * truth — localStorage just caches the user_id so the UI can render
 * optimistically while /api/auth/me is in flight.
 *
 * The provider fetches once on mount. After login, the verify flow calls
 * `setMe(user_id)` (or `refresh()`) so the gate flips without a full reload —
 * a client-side `router.replace` does not remount the provider.
 */
type IdentityContextValue = {
  me: string | null
  loaded: boolean
  /** Set (or clear, with null) the cached identity. Updates localStorage too. */
  setMe: (id: string | null) => void
  /** Re-fetch /api/auth/me — the authoritative check against the cookie. */
  refresh: () => Promise<void>
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [me, setMeState] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const setMe = useCallback((id: string | null) => {
    if (typeof window !== 'undefined') {
      if (id) localStorage.setItem(KEY, id)
      else localStorage.removeItem(KEY)
    }
    setMeState(id)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const m = await api.me()
      console.log(`[beeper] identity: signed in as ${m.user_id}`)
      setMe(m.user_id)
    } catch (e) {
      const status = (e as Error & { status?: number }).status
      if (status === 401) {
        console.log('[beeper] identity: no session')
      } else {
        console.error('[beeper] identity: /api/auth/me failed', e)
      }
      setMe(null)
    }
  }, [setMe])

  useEffect(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
    if (cached) setMeState(cached)
    refresh().finally(() => setLoaded(true))
  }, [refresh])

  return createElement(
    IdentityContext.Provider,
    { value: { me, loaded, setMe, refresh } },
    children,
  )
}

function useIdentityContext(): IdentityContextValue {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error('useIdentity must be used within <IdentityProvider>')
  return ctx
}

/**
 * Backward-compatible tuple API: `[me, setMe, loaded]`. Reads from the shared
 * provider, so all consumers see the same identity.
 */
export function useIdentity(): [string | null, (id: string | null) => void, boolean] {
  const { me, setMe, loaded } = useIdentityContext()
  return [me, setMe, loaded]
}

/** Full context access — `setMe`/`refresh` for the login flow. */
export function useIdentityActions(): IdentityContextValue {
  return useIdentityContext()
}
