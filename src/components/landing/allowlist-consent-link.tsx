'use client'

import { useEffect, useState } from 'react'

/**
 * Wraps the "JOIN ALLOWLIST" mailto CTA. Before opening the user's email
 * client, it shows a consent popup explaining that emailing us their phone
 * number constitutes consent to receive SMS from Beeper. Only after they
 * agree do we proceed to the mailto: link.
 */
export function AllowlistConsentLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  function proceed() {
    setOpen(false)
    window.location.href = href
  }

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        {children}
      </a>
      {open && <ConsentModal onCancel={() => setOpen(false)} onAgree={proceed} />}
    </>
  )
}

function ConsentModal({
  onCancel,
  onAgree,
}: {
  onCancel: () => void
  onAgree: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Card */}
      <div
        className="crt-surface relative w-[min(88vw,420px)] aspect-square max-h-[88vh] overflow-y-auto rounded-2xl border border-[#1f1f1f] p-7 flex flex-col justify-center gap-5"
        style={{ boxShadow: '0 24px 64px -16px rgba(0,0,0,0.8)' }}
      >
        <div
          className="text-[11px] tracking-[0.2em] font-bold lcd-glow"
          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
        >
          {'// BEFORE YOU EMAIL US'}
        </div>

        <h2
          id="consent-title"
          className="text-white"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 4vw, 26px)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          Emailing us your number is your consent.
        </h2>

        <p className="text-[13px] leading-relaxed text-[#a3a3a3]">
          By sending us an email with your phone number, you agree to receive
          recurring SMS text messages from Beeper (a text each time you&rsquo;re
          beeped). Message frequency varies. Message and data rates may apply.
          Reply STOP to unsubscribe at any time, or HELP for help. See our{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-[#07c04e] underline underline-offset-4 hover:text-white transition-colors"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="text-[#07c04e] underline underline-offset-4 hover:text-white transition-colors"
          >
            Terms
          </a>
          .
        </p>

        <div className="flex flex-col gap-3 pt-1">
          <button
            onClick={onAgree}
            className="cta-primary flex h-[3rem] items-center justify-center rounded-full text-[13px] tracking-[0.18em] font-bold"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            I AGREE — OPEN EMAIL
          </button>
          <button
            onClick={onCancel}
            className="text-[12px] text-[#8a8a8a] hover:text-white transition-colors"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
