'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, User } from '@/lib/api'

type Status = { kind: 'idle' } | { kind: 'pending' } | { kind: 'ok'; message: string } | { kind: 'error'; message: string }

export function AdminClient() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [refreshTick, setRefreshTick] = useState(0)

  // Add-user form
  const [id, setId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [userStatus, setUserStatus] = useState<Status>({ kind: 'idle' })

  // Add-allowlist form
  const [owner, setOwner] = useState('')
  const [sender, setSender] = useState('')
  const [edgeStatus, setEdgeStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => {
    api.listUsers().then(setUsers).catch(() => {})
  }, [refreshTick])

  async function addUser(e: React.FormEvent) {
    e.preventDefault()
    setUserStatus({ kind: 'pending' })
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: id.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
          phone: phone.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? `${res.status} ${res.statusText}`)
      }
      setUserStatus({ kind: 'ok', message: `Added ${id.trim()}.` })
      setId(''); setFirstName(''); setLastName(''); setPhone(''); setConsent(false)
      setRefreshTick(t => t + 1)
    } catch (err) {
      setUserStatus({ kind: 'error', message: (err as Error).message })
    }
  }

  async function addEdge(e: React.FormEvent) {
    e.preventDefault()
    setEdgeStatus({ kind: 'pending' })
    try {
      const res = await fetch('/api/admin/allowlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ owner_id: owner.trim(), sender_id: sender.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? `${res.status} ${res.statusText}`)
      }
      setEdgeStatus({ kind: 'ok', message: `${sender.trim()} can now beep ${owner.trim()}.` })
      setOwner(''); setSender('')
    } catch (err) {
      setEdgeStatus({ kind: 'error', message: (err as Error).message })
    }
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <main className="flex-grow px-container-margin max-w-3xl mx-auto w-full pt-4 md:pt-8 pb-12">
      <header className="mb-stack-md flex items-center justify-between border-b border-outline-variant pb-4">
        <h1 className="font-display text-display tracking-tight text-on-surface uppercase">
          🛠️ ADMIN
        </h1>
        <button
          onClick={logout}
          className="font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-3 py-1 rounded-md hover:bg-surface-container transition-colors duration-150"
        >
          LOG OUT
        </button>
      </header>

      <Section title="Add a person">
        <form onSubmit={addUser} className="flex flex-col gap-stack-sm">
          <Field label="ID (lowercase, e.g. edward)" value={id} onChange={setId} required autoComplete="off" />
          <div className="grid grid-cols-2 gap-stack-sm">
            <Field label="First name" value={firstName} onChange={setFirstName} required autoComplete="off" />
            <Field label="Last name (optional)" value={lastName} onChange={setLastName} autoComplete="off" />
          </div>
          <Field label="Phone (e.g. +15555550000)" value={phone} onChange={setPhone} required autoComplete="off" />
          <ConsentCheckbox checked={consent} onChange={setConsent} />
          <Submit pending={userStatus.kind === 'pending'} disabled={!consent} label="ADD / UPDATE PERSON" />
          <StatusLine status={userStatus} />
        </form>
      </Section>

      <Section title="Grant beep access (owner ← sender)">
        <form onSubmit={addEdge} className="flex flex-col gap-stack-sm">
          <div className="grid grid-cols-2 gap-stack-sm">
            <Field label="Owner ID (recipient)" value={owner} onChange={setOwner} required autoComplete="off" />
            <Field label="Sender ID (can beep them)" value={sender} onChange={setSender} required autoComplete="off" />
          </div>
          <Submit pending={edgeStatus.kind === 'pending'} label="ADD ALLOWLIST EDGE" />
          <StatusLine status={edgeStatus} />
        </form>
      </Section>

      <Section title="Existing people">
        {users.length === 0 ? (
          <div className="font-code-sm text-code-sm text-on-surface-variant py-4">NO USERS</div>
        ) : (
          <div className="border border-outline-variant rounded-md overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="grid grid-cols-[1fr_2fr] gap-stack-sm px-stack-sm py-2 bg-surface-container border-b border-outline-variant">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">ID</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">DISPLAY NAME</span>
            </div>
            {users.map((u, idx) => (
              <div
                key={u.id}
                className={`grid grid-cols-[1fr_2fr] gap-stack-sm px-stack-sm py-2 border-b border-outline-variant last:border-b-0 font-data-value text-data-value text-on-surface ${
                  idx % 2 === 1 ? 'bg-surface-container-low' : 'bg-surface-container-lowest'
                }`}
              >
                <span className="uppercase font-semibold">{u.id}</span>
                <span className="text-on-surface-variant">{u.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm uppercase tracking-widest">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({
  label, value, onChange, required, autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  autoComplete?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-code-sm text-code-sm text-on-surface-variant">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="brutalist-input w-full border border-outline-variant bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface rounded-md"
      />
    </label>
  )
}

function Submit({ pending, label, disabled }: { pending: boolean; label: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {pending ? 'SAVING…' : label}
    </button>
  )
}

function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-stack-sm cursor-pointer border border-outline-variant bg-surface-container-low px-stack-sm py-stack-sm rounded-md">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
      />
      <span className="font-code-sm text-code-sm text-on-surface-variant leading-relaxed">
        This person has agreed to receive recurring SMS text messages from Beeper
        at the number above (a text each time they are beeped). Message frequency
        varies. Message and data rates may apply. They can reply STOP to
        unsubscribe at any time or HELP for help. See our{' '}
        <a
          href="/privacy"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="/terms"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          Terms
        </a>
        .
      </span>
    </label>
  )
}

function StatusLine({ status }: { status: Status }) {
  if (status.kind === 'ok') {
    return (
      <div className="font-code-sm text-code-sm text-on-surface border border-outline-variant bg-surface-container px-stack-sm py-2 rounded-md">
        ✓ {status.message}
      </div>
    )
  }
  if (status.kind === 'error') {
    return (
      <div className="font-code-sm text-code-sm text-error border border-error bg-error-container px-stack-sm py-2 rounded-md">
        {status.message}
      </div>
    )
  }
  return null
}
