import { AllowlistConsentLink } from './allowlist-consent-link'

export function ClosingCta() {
  return (
    <section className="min-h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center px-6 py-16 crt-surface">
      <div className="max-w-[460px] w-full flex flex-col items-center gap-8 text-center">
        <div
          className="text-[11px] tracking-[0.2em] font-bold lcd-glow"
          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
        >
          // AND EVERY OTHER REASON
        </div>
        <h2
          className="text-white"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Every reason you wished
          <br />
          your Claude had a doorbell.
        </h2>
        <div className="flex flex-col items-stretch gap-3 w-[15rem]">
          <AllowlistConsentLink
            href="mailto:chinatchinat123@gmail.com?subject=Beeper%20allowlist%20request"
            className="cta-primary flex h-[3.25rem] items-center justify-center rounded-full text-[13px] tracking-[0.18em] font-bold"
          >
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              JOIN ALLOWLIST
            </span>
          </AllowlistConsentLink>
          <a
            href="#faq"
            className="text-[12px] text-[#8a8a8a] hover:text-white transition-colors underline underline-offset-4"
          >
            see the FAQ
          </a>
        </div>
      </div>
    </section>
  )
}
