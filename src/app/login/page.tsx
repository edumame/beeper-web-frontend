'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

type Step = 'phone' | 'code'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function normalizePhone(raw: string): string {
    // Accept "415-555-0100" or "(415) 555-0100" or "+14155550100" — strip
    // non-digits and prepend "+" if missing. US default: prepend "+1" when
    // the user enters 10 digits.
    const trimmed = raw.trim()
    if (trimmed.startsWith('+')) return '+' + trimmed.slice(1).replace(/\D/g, '')
    const digits = trimmed.replace(/\D/g, '')
    if (digits.length === 10) return '+1' + digits
    return '+' + digits
  }

  async function submitPhone(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const normalized = normalizePhone(phone)
    console.log(`[beeper] login: requesting code for ${normalized}`)
    try {
      await api.requestCode(normalized)
      console.log('[beeper] login: code request OK, advancing to code step')
      setStep('code')
    } catch (err) {
      console.error('[beeper] login: code request failed', err)
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const normalized = normalizePhone(phone)
    console.log(`[beeper] login: verifying code for ${normalized}`)
    try {
      const r = await api.verifyCode(normalized, code.trim())
      console.log(`[beeper] login: verify OK, user_id=${r.user_id}, redirecting to /`)
      router.replace('/')
    } catch (err) {
      console.error('[beeper] login: verify failed', err)
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-stack-md px-container-margin">
      <div
        className="bg-surface-container-lowest border border-outline-variant p-6 max-w-sm w-full flex flex-col gap-stack-sm"
        style={{ borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
      >
        <h2 className="font-display text-display text-on-surface uppercase tracking-tight">
          {step === 'phone' ? 'log in' : 'enter code'}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {step === 'phone'
            ? 'Enter your phone number. We will text you a 6-digit code.'
            : `Code sent to ${normalizePhone(phone)}. Check your messages.`}
        </p>

        {error && (
          <div className="font-code-sm text-code-sm text-error bg-error-container px-2 py-1 rounded-md">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={submitPhone} className="flex flex-col gap-stack-sm">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 415 555 0100"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={busy}
              className="brutalist-input w-full border border-outline-variant bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface rounded-md"
            />
            <button
              type="submit"
              disabled={busy || !phone.trim()}
              className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {busy ? 'SENDING…' : 'SEND CODE'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="flex flex-col gap-stack-sm">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoFocus
              disabled={busy}
              className="brutalist-input w-full border border-outline-variant bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface rounded-md tracking-widest text-center"
            />
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2.5 rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {busy ? 'VERIFYING…' : 'CONTINUE'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('phone'); setCode(''); setError(null) }}
              disabled={busy}
              className="font-label-caps text-label-caps text-on-surface-variant px-3 py-2 rounded-md hover:bg-surface-container transition-colors duration-150 ease-out"
            >
              ← USE A DIFFERENT NUMBER
            </button>
          </form>
        )}
      </div>
      <Link
        href="/docs"
        className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary uppercase tracking-widest"
      >
        ↗ READ THE DOCS
      </Link>
    </div>
  )
}
