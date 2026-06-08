'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { api, User } from '@/lib/api'
import { useIdentity } from '@/lib/identity'

export function IdentityGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false
  const [me, setMe, loaded] = useIdentity()
  const [users, setUsers] = useState<User[]>([])
  const [picked, setPicked] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded || me || isAdmin) return
    api.listUsers().then(us => {
      setUsers(us)
      setPicked(us[0]?.id ?? '')
    }).catch(e => setError((e as Error).message))
  }, [loaded, me, isAdmin])

  if (isAdmin) return <>{children}</>
  if (!loaded) return null
  if (me) return <>{children}</>

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-container-margin"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-surface-container-lowest border border-outline-variant p-6 max-w-sm w-full flex flex-col gap-stack-sm animate-fade-in"
        style={{
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2 className="font-display text-display text-on-surface uppercase tracking-tight">Who are you?</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Pick your beeper identity. Saved locally; click your name in the header to change.
        </p>
        {error && (
          <div className="font-code-sm text-code-sm text-error bg-error-container px-2 py-1 rounded-md">
            {error}
          </div>
        )}
        <select
          value={picked}
          onChange={e => setPicked(e.target.value)}
          className="brutalist-select brutalist-input w-full border border-outline-variant bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface cursor-pointer rounded-md"
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.display_name} ({u.id})
            </option>
          ))}
        </select>
        <button
          onClick={() => picked && setMe(picked)}
          disabled={!picked}
          className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}
