'use client'

import { useEffect, useState } from 'react'

/**
 * Pulsing "● 47 beeps today" counter. Animates the digits on each tick.
 * Pulls a real count when /api/stats/today exists; falls back to a
 * deterministic seed + slow drift so it always looks alive.
 */
export function LiveCounter({ seed = 47 }: { seed?: number }) {
  const [count, setCount] = useState(seed)

  useEffect(() => {
    // attempt real count; quietly fall back if endpoint is absent
    const base = process.env.NEXT_PUBLIC_BEEPER_API_URL ?? 'https://beeper-v2-host.vercel.app'
    let cancelled = false
    fetch(`${base}/api/stats/today`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (!cancelled && j && typeof j.count === 'number') setCount(j.count)
      })
      .catch(() => {})

    // gentle drift so the page feels live
    const id = setInterval(() => {
      if (Math.random() < 0.35) setCount(c => c + 1)
    }, 9000)

    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const digits = String(count).split('')
  return (
    <div
      className="flex items-center gap-2 text-[13px]"
      style={{
        fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
        color: '#d0ffd9',
        textShadow: '0 0 10px rgba(7,192,78,0.45)',
      }}
    >
      <span className="beep-dot" />
      <span className="inline-flex tabular-nums" aria-label={`${count} beeps today`}>
        {digits.map((d, i) => (
          <span
            key={`${i}-${d}`}
            className="digit-roll inline-block"
            style={{ minWidth: '0.55em', textAlign: 'center' }}
          >
            {d}
          </span>
        ))}
      </span>
      <span style={{ color: '#7ab78c' }}>beeps today</span>
    </div>
  )
}
