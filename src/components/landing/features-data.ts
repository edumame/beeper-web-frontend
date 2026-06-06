export type ChatTurn =
  | { side: 'out'; text: string; sender?: string }
  | { side: 'in'; text: string; sender?: string; mono?: boolean }
  | { side: 'in'; cardTitle: string; text: string }
  | { side: 'sys'; text: string }

export type Feature = {
  id: string
  title: string
  turns: ChatTurn[]
}

export const FEATURES: Feature[] = [
  {
    id: 'delegate-while-they-sleep',
    title: 'Delegate while they sleep',
    turns: [
      { side: 'out', sender: 'chinat', text: "/beep jeffrey 'check the staging deploy when you're back'" },
      { side: 'in', text: 'queued. jeffrey will be notified by sms.' },
      { side: 'sys', text: '⏰ 9 hours later' },
      { side: 'out', sender: 'jeffrey', text: '/inbox' },
      {
        side: 'in',
        cardTitle: 'INBOX · 1 BEEP',
        text: '• chinat → "check staging"',
      },
      { side: 'out', sender: 'jeffrey', text: 'claude, take it' },
      { side: 'in', text: '✓ staging looks healthy. 14 prs merged overnight, no rollbacks. closed the beep with the summary.' },
    ],
  },
  {
    id: 'imessage-is-the-wake-signal',
    title: 'iMessage is the wake signal',
    turns: [
      { side: 'in', text: '📟 New beep from chinat — reply YES to handle, or open Beeper for the full thread.' },
      { side: 'out', sender: 'jeffrey', text: 'yes' },
      { side: 'in', text: 'beep accepted. waking your claude now…' },
      { side: 'sys', text: '── 11 seconds later ──' },
      { side: 'in', text: 'claude is on it. you can keep doing whatever you were doing.' },
    ],
  },
  {
    id: 'slash-commands-inbox',
    title: 'Slash commands are the inbox',
    turns: [
      { side: 'out', sender: 'jeffrey', text: '/inbox' },
      {
        side: 'in',
        cardTitle: 'INBOX · 2 BEEPS',
        text: '• chinat  → staging deploy\n• kaan    → review PR #847',
      },
      { side: 'out', sender: 'jeffrey', text: '/reply chinat "done, staging is green"' },
      { side: 'in', text: '✓ sent. chinat was notified.' },
      { side: 'out', sender: 'jeffrey', text: '/decline kaan "not my repo, ask edward"' },
      { side: 'in', text: '✓ declined. kaan was notified with your reason.' },
    ],
  },
  {
    id: 'allowlist-only',
    title: 'Allowlist only',
    turns: [
      { side: 'out', sender: 'stranger', text: "/beep jeffrey 'urgent — review my pr'" },
      {
        side: 'in',
        text: '✗ you are not on jeffrey’s allowlist. nothing was sent.',
      },
      { side: 'in', text: 'ask jeffrey to run /allow stranger if you should be able to beep them.' },
      { side: 'sys', text: '── on jeffrey’s side ──' },
      { side: 'out', sender: 'jeffrey', text: '/access' },
      {
        side: 'in',
        cardTitle: 'ALLOWLIST · 3 SENDERS',
        text: 'chinat     · added 14d ago\nkaan       · added 14d ago\nedward     · added  9d ago',
      },
    ],
  },
  {
    id: 'sent-queued-declined',
    title: 'Sent, queued, declined',
    turns: [
      { side: 'out', sender: 'chinat', text: '/sent' },
      {
        side: 'in',
        cardTitle: 'SENT · 3 BEEPS',
        text: '✓ kaan    · replied 2m ago\n⋯ jeff    · queued (sms sent)\n✗ edward  · declined: "not today"',
      },
      { side: 'out', sender: 'chinat', text: '/resend edward "low urgency, whenever"' },
      { side: 'in', text: '✓ resent at low urgency. no sms this time.' },
    ],
  },
]
