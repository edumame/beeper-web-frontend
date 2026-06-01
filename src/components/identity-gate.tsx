'use client'
import { useEffect, useState } from 'react'
import { api, User } from '@/lib/api'
import { useIdentity } from '@/lib/identity'

export function IdentityGate({ children }: { children: React.ReactNode }) {
  const [me, setMe, loaded] = useIdentity()
  const [users, setUsers] = useState<User[]>([])
  const [picked, setPicked] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded || me) return
    api.listUsers().then(us => {
      setUsers(us)
      setPicked(us[0]?.id ?? '')
    }).catch(e => setError((e as Error).message))
  }, [loaded, me])

  if (!loaded) return null
  if (me) return <>{children}</>

  return (
    <div className="fixed inset-0 bg-surface-container-lowest/95 z-50 flex items-center justify-center px-container-margin">
      <div className="border border-outline bg-surface-container-lowest p-stack-md max-w-sm w-full flex flex-col gap-stack-sm">
        <h2 className="font-display text-display text-primary uppercase tracking-tight">Who are you?</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Pick your beeper identity. Saved locally; click your name in the header to change.
        </p>
        {error && <div className="font-code-sm text-code-sm text-error">{error}</div>}
        <select
          value={picked}
          onChange={e => setPicked(e.target.value)}
          className="brutalist-select brutalist-input w-full border border-outline bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface cursor-pointer"
        >
          {users.map(u => <option key={u.id} value={u.id}>{u.display_name} ({u.id})</option>)}
        </select>
        <button
          onClick={() => picked && setMe(picked)}
          disabled={!picked}
          className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 disabled:opacity-40"
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}
