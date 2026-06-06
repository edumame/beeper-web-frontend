'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useIdentity } from '@/lib/identity'
import { inboxRedirectFor } from '@/lib/landing-redirect'
import { LandingPage } from '@/components/landing/landing-page'

const PUBLIC_PATHS = new Set(['/login', '/'])
const PUBLIC_PREFIXES = ['/docs', '/admin']

export function IdentityGate({ children }: { children: React.ReactNode }) {
  const [me, , loaded] = useIdentity()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))

  useEffect(() => {
    if (!loaded) return
    if (!me && !isPublic) router.replace('/login')
  }, [loaded, me, isPublic, router])

  useEffect(() => {
    const target = inboxRedirectFor({ pathname: pathname ?? '', me, loaded })
    if (target) router.replace(target)
  }, [pathname, me, loaded, router])

  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center font-code-sm text-on-surface-variant">
        loading…
      </div>
    )
  }

  // Signed-out + on root → show the marketing landing instead of redirecting.
  if (!me && pathname === '/') return <LandingPage />
  if (!me && !isPublic) return null
  return <>{children}</>
}
