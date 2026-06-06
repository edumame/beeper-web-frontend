import { Feature, ChatTurn } from './features-data'
import { TerminalCard } from './terminal-card'

function isCard(turn: ChatTurn): turn is Extract<ChatTurn, { cardTitle: string }> {
  return turn.side === 'in' && 'cardTitle' in turn && !!turn.cardTitle
}

function Bubble({ turn, showSender }: { turn: ChatTurn; showSender: boolean }) {
  if (turn.side === 'sys') {
    return (
      <div className="flex justify-center my-3">
        <span
          className="text-[11px] tracking-[0.18em]"
          style={{
            color: '#6a6a6a',
            fontFamily: 'var(--font-jetbrains-mono)',
          }}
        >
          {turn.text}
        </span>
      </div>
    )
  }

  if (isCard(turn)) {
    return (
      <div className="flex flex-col items-start mt-2">
        <TerminalCard title={turn.cardTitle}>{turn.text}</TerminalCard>
      </div>
    )
  }

  const isOut = turn.side === 'out'
  const sender = 'sender' in turn ? turn.sender : undefined

  return (
    <div className={`flex flex-col mt-2 ${isOut ? 'items-end' : 'items-start'}`}>
      {showSender && sender && (
        <span
          className="text-[10px] tracking-[0.2em] mb-1 mx-2"
          style={{
            color: '#6a6a6a',
            fontFamily: 'var(--font-jetbrains-mono)',
          }}
        >
          {sender.toUpperCase()}
        </span>
      )}
      <div className={isOut ? 'bubble-out' : 'bubble-in'}>
        <span className={turn.side === 'in' && 'mono' in turn && turn.mono ? 'bubble-mono' : ''}>
          {turn.text}
        </span>
      </div>
    </div>
  )
}

export function FeatureSection({ feature, index }: { feature: Feature; index: number }) {
  // collapse repeated sender labels so the same person speaking twice in a row
  // doesn't get a label both times
  let lastSender: string | undefined = undefined

  return (
    <section
      id={index === 0 ? 'how-it-works' : undefined}
      className="h-screen w-full snap-start snap-always relative flex flex-col crt-surface"
    >
      {/* Title pill at top */}
      <div className="flex w-full justify-center px-6 pt-12 pb-2">
        <div className="section-title-pill inline-flex items-center gap-2 px-5 py-2">
          <span
            className="text-[10px] tracking-widest lcd-glow"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            0{index + 1}
          </span>
          <span
            className="text-[17px] font-medium tracking-tight"
            style={{ color: '#fafafa', fontFamily: 'var(--font-serif)' }}
          >
            {feature.title}
          </span>
        </div>
      </div>

      {/* Conversation: top-aligned with breathing room above */}
      <div className="flex flex-1 items-start justify-center px-6 pt-6 pb-12 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col">
            {feature.turns.map((t, i) => {
              const sender = t.side === 'out' || t.side === 'in' ? ('sender' in t ? t.sender : undefined) : undefined
              const showSender = !!sender && sender !== lastSender
              if (sender) lastSender = sender
              if (t.side === 'sys') lastSender = undefined
              return <Bubble key={i} turn={t} showSender={showSender} />
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
