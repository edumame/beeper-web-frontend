/**
 * A small CRT/terminal "card" that stands in for slash-command output
 * inside a conversation. Replaces the previous ASCII box-drawing which
 * misaligned inside the rounded bubble container.
 *
 * Pattern: header strip with a green pulsing dot + title in mono caps,
 * then a body block with monospace pre-wrap text.
 */
export function TerminalCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="w-fit max-w-full overflow-hidden"
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(7, 192, 78, 0.28)',
        borderRadius: 10,
        fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
        boxShadow:
          'inset 0 0 28px rgba(7, 192, 78, 0.05), 0 0 22px rgba(7, 192, 78, 0.08)',
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          borderBottom: '1px solid rgba(7, 192, 78, 0.15)',
          background:
            'linear-gradient(to bottom, rgba(7, 192, 78, 0.06), rgba(7, 192, 78, 0.02))',
        }}
      >
        <span className="beep-dot" />
        <span
          className="text-[10.5px] tracking-[0.18em] font-bold"
          style={{
            color: '#07c04e',
            textShadow: '0 0 6px rgba(7, 192, 78, 0.45)',
          }}
        >
          {title}
        </span>
      </div>
      <div
        className="px-3.5 py-3 text-[13px] whitespace-pre-wrap"
        style={{ color: '#e5e5e5', lineHeight: 1.6 }}
      >
        {children}
      </div>
    </div>
  )
}
