'use client'

import { useEffect, useState } from 'react'

const KEY = 'beeper_user'

export function useIdentity(): [string | null, (id: string | null) => void, boolean] {
  const [me, setMe] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setMe(typeof window !== 'undefined' ? localStorage.getItem(KEY) : null)
    setLoaded(true)
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
