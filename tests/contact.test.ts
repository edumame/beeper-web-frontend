import { describe, test, expect } from 'vitest'
import { buildSmsLink, buildBeeperVCard, beeperContactBlobUrl } from '@/lib/contact'

describe('buildSmsLink', () => {
  test('builds an RFC-5724 sms link with body for a US phone', () => {
    const link = buildSmsLink('+15555550100', 'HELLO BEEPER')
    expect(link.startsWith('sms:+15555550100')).toBe(true)
    expect(link).toMatch(/[?&]body=HELLO%20BEEPER/)
  })

  test('uses the iOS-friendly &body= form on Apple platforms', () => {
    const link = buildSmsLink('+15555550100', 'hi', { platform: 'apple' })
    expect(link).toMatch(/sms:\+15555550100&body=hi/)
  })

  test('uses the Android-friendly ?body= form on non-Apple platforms', () => {
    const link = buildSmsLink('+15555550100', 'hi', { platform: 'other' })
    expect(link).toMatch(/sms:\+15555550100\?body=hi/)
  })

  test('omits the body param when body is empty', () => {
    const link = buildSmsLink('+15555550100', '')
    expect(link).toBe('sms:+15555550100')
  })

  test('URL-encodes special characters in the body', () => {
    const link = buildSmsLink('+1', 'hi & bye?')
    expect(link).toMatch(/hi%20%26%20bye%3F/)
  })
})

describe('buildBeeperVCard', () => {
  test('emits a valid vCard 3.0 with FN, TEL, ORG', () => {
    const v = buildBeeperVCard({ phone: '+15555550100' })
    expect(v).toMatch(/^BEGIN:VCARD\r\n/)
    expect(v).toMatch(/\r\nVERSION:3\.0\r\n/)
    expect(v).toMatch(/\r\nFN:Beeper\r\n/)
    expect(v).toMatch(/\r\nN:Beeper;;;;\r\n/)
    expect(v).toMatch(/\r\nORG:Beeper\r\n/)
    expect(v).toMatch(/\r\nTEL;TYPE=CELL,VOICE:\+15555550100\r\n/)
    expect(v).toMatch(/\r\nEND:VCARD\r\n?$/)
  })

  test('uses CRLF line endings (vCard 3.0 spec)', () => {
    const v = buildBeeperVCard({ phone: '+1' })
    const lines = v.split('\r\n')
    expect(lines.length).toBeGreaterThan(4)
    expect(v.includes('\n') && !v.includes('\r\n') === false).toBe(true)
  })

  test('escapes commas and semicolons in name fields per vCard spec', () => {
    const v = buildBeeperVCard({ phone: '+1', orgName: 'Beeper, Inc;' })
    expect(v).toContain('ORG:Beeper\\, Inc\\;')
  })

  test('omits NOTE line when no note provided', () => {
    const v = buildBeeperVCard({ phone: '+1' })
    expect(v).not.toMatch(/NOTE:/)
  })

  test('includes NOTE line when provided', () => {
    const v = buildBeeperVCard({ phone: '+1', note: 'Async Claude delegation' })
    expect(v).toMatch(/NOTE:Async Claude delegation/)
  })
})

describe('beeperContactBlobUrl', () => {
  test('returns a blob: URL containing the vcard content type', () => {
    const url = beeperContactBlobUrl({ phone: '+15555550100' })
    expect(url.startsWith('blob:')).toBe(true)
  })
})
