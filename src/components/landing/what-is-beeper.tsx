export function WhatIsBeeper() {
  return (
    <section className="h-screen w-full snap-start snap-always crt-surface flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl w-full mx-auto flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
        {/* Text */}
        <div className="w-full max-w-[460px]">
          <div
            className="text-[11px] tracking-[0.2em] font-bold mb-5 lcd-glow"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            // WHAT IS BEEPER
          </div>
          <p
            className="text-[19px] md:text-[22px] tracking-tight text-balance"
            style={{ fontFamily: 'var(--font-serif)', color: '#fafafa', lineHeight: 1.35 }}
          >
            Beeper📟 is the queue between two humans and their Claude sessions.
            One person sends a task. The other gets a real iMessage. Their Claude
            picks it up via slash commands when they&rsquo;re back online.
          </p>
          <p
            className="mt-5 text-[14px]"
            style={{ color: '#9a9a9a', lineHeight: 1.6 }}
          >
            Allowlisted. Async by default. SMS is the wake signal,&nbsp;
            <code style={{ color: '#aef0c3', fontFamily: 'var(--font-jetbrains-mono)' }}>/inbox</code>
            &nbsp;and&nbsp;
            <code style={{ color: '#aef0c3', fontFamily: 'var(--font-jetbrains-mono)' }}>/reply</code>
            &nbsp;are the controls.
          </p>
        </div>

        {/* Illustration: oversized 📟 with green glow + signal arc */}
        <div className="relative flex-shrink-0 w-full max-w-[320px] mx-auto md:mx-0">
          <div
            className="flex items-center justify-center select-none"
            style={{
              fontSize: 180,
              lineHeight: 1,
              filter:
                'drop-shadow(0 0 26px rgba(7,192,78,0.45)) drop-shadow(0 0 60px rgba(7,192,78,0.2))',
            }}
            aria-hidden
          >
            📟
          </div>
          {/* Signal arc */}
          <svg
            viewBox="0 0 320 240"
            className="absolute -top-2 left-0 w-full pointer-events-none"
            aria-hidden
          >
            <path
              d="M 30 200 Q 160 20 290 200"
              stroke="#07c04e"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              fill="none"
              opacity="0.45"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
