import { describe, test, expect } from 'vitest'
import { parseContactsCsv, slugify, normalizePhone, type ContactRow } from '@/lib/import'

describe('parseContactsCsv', () => {
  test('parses a simple header + rows CSV', () => {
    const csv = 'name,phone,email\nAlice Doe,+14155550111,alice@x.com\nBob Smith,4155550222,bob@y.com\n'
    const rows = parseContactsCsv(csv)
    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ display_name: 'Alice Doe', phone: '+14155550111' })
    expect(rows[1]).toMatchObject({ display_name: 'Bob Smith', phone: '+14155550222' })
  })

  test('accepts header column aliases (Name, PHONE, Email)', () => {
    const csv = 'Name,PHONE,Email\nA,+1,a@x\n'
    const rows = parseContactsCsv(csv)
    expect(rows[0].display_name).toBe('A')
    expect(rows[0].phone).toBe('+1')
  })

  test('accepts "mobile" as a phone column synonym', () => {
    const csv = 'name,mobile\nAlice,4155550111\n'
    const rows = parseContactsCsv(csv)
    expect(rows[0].phone).toBe('+14155550111')
  })

  test('skips rows without a name', () => {
    const csv = 'name,phone\n,+1\nValid,+2\n'
    const rows = parseContactsCsv(csv)
    expect(rows).toHaveLength(1)
    expect(rows[0].display_name).toBe('Valid')
  })

  test('skips rows without a phone (E.164 required for SMS wake)', () => {
    const csv = 'name,phone\nNoPhone,\nValid,+15555550001\n'
    const rows = parseContactsCsv(csv)
    expect(rows.map(r => r.display_name)).toEqual(['Valid'])
  })

  test('auto-slugs id from first name lowercase', () => {
    const csv = 'name,phone\nAlice Wonderland,+15555550001\n'
    const rows = parseContactsCsv(csv)
    expect(rows[0].id).toBe('alice')
  })

  test('handles quoted fields with commas inside', () => {
    const csv = 'name,phone\n"Doe, Alice",+15555550001\n'
    const rows = parseContactsCsv(csv)
    expect(rows[0].display_name).toBe('Doe, Alice')
    expect(rows[0].id).toBe('doe')
  })

  test('returns empty array on empty or whitespace input', () => {
    expect(parseContactsCsv('')).toEqual([])
    expect(parseContactsCsv('   \n\n')).toEqual([])
  })
})

describe('slugify', () => {
  test('lowercases the first whitespace-delimited token', () => {
    expect(slugify('Alice Wonderland')).toBe('alice')
    expect(slugify('jeffrey')).toBe('jeffrey')
  })

  test('strips non-ascii chars from the slug', () => {
    expect(slugify('Chinαt Yu')).toBe('chint')
  })

  test('returns empty string on empty input', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
  })
})

describe('normalizePhone', () => {
  test('keeps an E.164 number as-is', () => {
    expect(normalizePhone('+14155550111')).toBe('+14155550111')
  })

  test('prepends +1 to a 10-digit US number', () => {
    expect(normalizePhone('4155550111')).toBe('+14155550111')
    expect(normalizePhone('(415) 555-0111')).toBe('+14155550111')
  })

  test('prepends + to an 11-digit number starting with 1', () => {
    expect(normalizePhone('14155550111')).toBe('+14155550111')
  })

  test('returns empty string for an empty or all-non-digit input', () => {
    expect(normalizePhone('')).toBe('')
    expect(normalizePhone('—')).toBe('')
  })
})
