export function inboxRedirectFor(
  state: { pathname: string; me: string | null; loaded: boolean },
): string | null {
  if (!state.loaded) return null
  if (!state.me) return null
  if (state.pathname !== '/') return null
  return '/inbox'
}
