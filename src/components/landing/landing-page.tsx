'use client'

import { useRouter } from 'next/navigation'
import { Hero } from './hero'
import { WhatIsBeeper } from './what-is-beeper'
import { FeatureSection } from './feature-section'
import { FEATURES } from './features-data'
import { ClosingCta } from './closing-cta'
import { FaqSection } from './faq-section'

/**
 * Public-facing landing page. Mounted by IdentityGate when no
 * identity is set in localStorage. Covers the entire viewport so the
 * (still-mounted) light-themed dashboard chrome behind it is hidden.
 */
export function LandingPage() {
  const router = useRouter()
  const goLogin = () => router.push('/login')

  return (
    <div
      className="landing fixed inset-0 z-50 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scrollbar-hide touch-pan-y"
      style={{ scrollBehavior: 'smooth' }}
    >
      <Hero onLogin={goLogin} />
      <WhatIsBeeper />
      {FEATURES.map((f, i) => (
        <FeatureSection key={f.id} feature={f} index={i} />
      ))}
      <ClosingCta />
      <FaqSection />
    </div>
  )
}
