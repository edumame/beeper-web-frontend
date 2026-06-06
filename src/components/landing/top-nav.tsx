'use client'

export function TopNav({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 px-4 sm:px-8 pt-6 pointer-events-none">
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Left: wordmark + status */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 select-none"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            <span
              aria-hidden
              className="text-[18px] leading-none"
              style={{ filter: 'drop-shadow(0 0 8px rgba(7,192,78,0.35))' }}
            >
              📟
            </span>
            <span className="text-[13px] font-bold tracking-widest text-white">
              <span className="lcd-glow">//</span>&nbsp;BEEPER
            </span>
          </a>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#9aa39c]"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            <span className="beep-dot" /> online
          </span>
        </div>

        {/* Right: nav links + login */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/iGotsIt/beeper"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-[13px] text-[#a3a3a3] hover:text-white transition-colors"
          >
            CLI
          </a>
          <a
            href="#faq"
            className="hidden sm:inline text-[13px] text-[#a3a3a3] hover:text-white transition-colors"
          >
            FAQ
          </a>
          <button
            onClick={onLogin}
            className="px-4 py-1.5 rounded-full text-[12px] tracking-widest font-bold bg-white text-black hover:bg-[#e5e5e5] transition-colors"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            LOG IN
          </button>
        </div>
      </div>
    </div>
  )
}
