import { describe, test, expect } from 'vitest'
import { inboxRedirectFor } from '@/lib/landing-redirect'

describe('inboxRedirectFor', () => {
  test('redirects logged-in identity from / to /inbox', () => {
    expect(inboxRedirectFor({ pathname: '/', me: 'alice', loaded: true })).toBe('/inbox')
  })

  test('returns null when identity is not loaded yet', () => {
    expect(inboxRedirectFor({ pathname: '/', me: 'alice', loaded: false })).toBeNull()
  })

  test('returns null on / when no identity is saved', () => {
    expect(inboxRedirectFor({ pathname: '/', me: null, loaded: true })).toBeNull()
  })

  test('does not bounce off /inbox itself', () => {
    expect(inboxRedirectFor({ pathname: '/inbox', me: 'alice', loaded: true })).toBeNull()
  })

  test('does not bounce off other beeper pages', () => {
    expect(inboxRedirectFor({ pathname: '/access', me: 'alice', loaded: true })).toBeNull()
    expect(inboxRedirectFor({ pathname: '/compose', me: 'alice', loaded: true })).toBeNull()
    expect(inboxRedirectFor({ pathname: '/sent', me: 'alice', loaded: true })).toBeNull()
  })

  test('does not bounce off admin paths', () => {
    expect(inboxRedirectFor({ pathname: '/admin', me: 'alice', loaded: true })).toBeNull()
    expect(inboxRedirectFor({ pathname: '/admin/login', me: 'alice', loaded: true })).toBeNull()
  })
})
