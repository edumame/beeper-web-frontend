// src/lib/contact.ts
// Helpers for the "Message Beeper / Save contact" CTA on the homepage.
// Pure-function side covered by tests; the blob: URL helper requires
// a DOM (browser) and is therefore exercised only at runtime.

export type Platform = 'apple' | 'other'

export function buildSmsLink(
  phone: string,
  body: string,
  opts: { platform?: Platform } = {},
): string {
  if (!body) return `sms:${phone}`
  // iOS Mail/Messages treat `?body=` as part of the recipient on some versions
  // and only respect `&body=`; Android & web prefer `?body=`. We choose
  // based on a hint passed in (auto-detected by the calling component).
  const sep = opts.platform === 'apple' ? '&' : '?'
  return `sms:${phone}${sep}body=${encodeURIComponent(body)}`
}

function escapeVCardField(s: string): string {
  // vCard 3.0 spec: commas, semicolons, and backslashes must be escaped.
  return s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export function buildBeeperVCard(input: {
  phone: string
  orgName?: string
  note?: string
}): string {
  const org = escapeVCardField(input.orgName ?? 'Beeper')
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Beeper',
    'N:Beeper;;;;',
    `ORG:${org}`,
    `TEL;TYPE=CELL,VOICE:${input.phone}`,
  ]
  if (input.note) lines.push(`NOTE:${escapeVCardField(input.note)}`)
  lines.push('END:VCARD')
  return lines.join('\r\n') + '\r\n'
}

export function beeperContactBlobUrl(input: {
  phone: string
  orgName?: string
  note?: string
}): string {
  const vcard = buildBeeperVCard(input)
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  return URL.createObjectURL(blob)
}
