'use client'

import { useState } from 'react'
import { Hero } from './hero'
import { WhatIsBeeper } from './what-is-beeper'
import { FeatureSection } from './feature-section'
import { FEATURES } from './features-data'
import { ClosingCta } from './closing-cta'
import { FaqSection } from './faq-section'
import { IdentityPicker } from './identity-picker'

/**
 * Public-facing landing page. Mounted by IdentityGate when no
 * identity is set in localStorage. Covers the entire viewport so the
 * (still-mounted) light-themed dashboard chrome behind it is hidden.
 */
export function LandingPage() {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <>
      <div
        className="landing fixed inset-0 z-50 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scrollbar-hide touch-pan-y"
        style={{ scrollBehavior: 'smooth' }}
      >
        <Hero onLogin={() => setPickerOpen(true)} />
        <WhatIsBeeper />
        {FEATURES.map((f, i) => (
          <FeatureSection key={f.id} feature={f} index={i} />
        ))}
        <ClosingCta />
        <FaqSection />
      </div>
      <IdentityPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  )
}
