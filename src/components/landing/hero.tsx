'use client'

import { LiveCounter } from './live-counter'
import { PixelPagerField } from './pixel-pager'
import { TopNav } from './top-nav'

export function Hero({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="h-screen w-full snap-start snap-always relative overflow-hidden crt-surface">
      <TopNav onLogin={onLogin} />

      {/* Centered stack */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 max-w-[640px] mx-auto md:mx-0 md:ml-[8vw]">
        {/* Kicker */}
        <div
          className="text-[11px] tracking-[0.2em] font-bold mb-6 lcd-glow"
          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
        >
          // ASYNC CLAUDE DELEGATION
        </div>

        {/* Headline */}
        <h1
          className="text-white mb-6"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 7vw, 72px)',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            fontWeight: 500,
          }}
        >
          Delegate to a friend&rsquo;s Claude<span className="lcd-glow">.</span>
        </h1>

        {/* Sub */}
        <p
          className="text-[15px] leading-relaxed mb-9 max-w-[460px]"
          style={{ color: '#b5b5b5' }}
        >
          Beeper queues a task in their iMessage so their Claude picks it up
          when they&rsquo;re back. Wake-up signal in, slash-command inbox out.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-stretch gap-3 w-[15rem]">
          <a
            href="mailto:chinatchinat123@gmail.com?subject=Beeper%20allowlist%20request&body=Hi%20Chinat%2C%0A%0AI%27d%20like%20to%20be%20added%20to%20the%20Beeper%20allowlist.%0A%0AMy%20iMessage%3A%20%0AMy%20use%20case%3A%20"
            className="cta-primary relative flex h-[3.25rem] items-center justify-between rounded-full pl-6 pr-1.5"
          >
            <span
              className="text-[13px] tracking-[0.18em] font-bold"
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              JOIN ALLOWLIST
            </span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: '#062614' }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aef0c3"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: 'rotate(45deg)' }}
                aria-hidden
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </a>
          <a
            href="#how-it-works"
            className="cta-secondary flex h-[3.25rem] items-center justify-center rounded-full text-[13px] tracking-[0.18em] font-bold"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            WATCH A BEEP
          </a>
        </div>

        {/* Live counter */}
        <div className="mt-7">
          <LiveCounter seed={47} />
        </div>

        {/* Hint */}
        <p
          className="hidden md:block mt-3 text-[11px]"
          style={{ color: '#5a6a5e', fontFamily: 'var(--font-jetbrains-mono)' }}
        >
          tip: drop /beeper-v2 in your Claude Code session
        </p>
      </div>

      {/* Pixel pager mascots wandering at the bottom */}
      <PixelPagerField count={4} />

      {/* Bottom fade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 100%)',
        }}
      />
    </section>
  )
}
