import { describe, test, expect, vi, beforeEach } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    const err = new Error(`REDIRECT:${path}`) as Error & { digest?: string }
    // Mirror Next's redirect throwing behavior so the caller bails out.
    err.digest = `NEXT_REDIRECT;replace;${path};307;`
    throw err
  }),
}))

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type FakeCookieStore = { get: (name: string) => { value: string } | undefined }
function fakeCookies(map: Record<string, string>): FakeCookieStore {
  return { get: (name: string) => (map[name] ? { value: map[name] } : undefined) }
}

describe('/admin/login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('redirects to /inbox when admin cookie is present', async () => {
    vi.mocked(cookies).mockResolvedValue(fakeCookies({ beeper_admin_pwd: 'real-password' }) as never)
    const { default: AdminLoginPage } = await import('@/app/admin/login/page')
    await expect(AdminLoginPage()).rejects.toThrow('REDIRECT:/inbox')
    expect(redirect).toHaveBeenCalledWith('/inbox')
  })

  test('renders login form (no redirect) when admin cookie is absent', async () => {
    vi.mocked(cookies).mockResolvedValue(fakeCookies({}) as never)
    const { default: AdminLoginPage } = await import('@/app/admin/login/page')
    const result = await AdminLoginPage()
    expect(result).toBeTruthy()
    expect(redirect).not.toHaveBeenCalled()
  })
})
