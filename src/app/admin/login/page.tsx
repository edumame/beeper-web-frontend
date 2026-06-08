'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? `${res.status} ${res.statusText}`)
      }
      router.replace('/admin')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      setPending(false)
    }
  }

  return (
    <main className="flex-grow flex flex-col justify-center px-container-margin w-full max-w-sm mx-auto pt-8">
      <header className="mb-stack-md flex items-center justify-between border-b border-outline-variant pb-4">
        <h1 className="font-display text-display tracking-tight text-on-surface uppercase">
          🔒 ADMIN
        </h1>
        <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          login
        </span>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-stack-sm">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Admin password
        </label>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="brutalist-input w-full border border-outline-variant bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface rounded-md"
        />

        {error && (
          <div className="font-code-sm text-code-sm text-error border border-error px-stack-sm py-2 rounded-md bg-error-container">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending || !password}
          className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {pending ? 'CHECKING…' : 'LOG IN'}
        </button>
      </form>
    </main>
  )
}
