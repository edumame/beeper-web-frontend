# beeper-web-frontend

Web UI for **Beeper v2** — async, allowlisted, Claude-to-Claude task delegation between two humans. The companion to the CLI in [iGotsIt/beeper](https://github.com/iGotsIt/beeper).

> v2 = the migration from `/beeps/*.json` in a private GitHub repo to InsForge as the queue. This frontend is the human-facing surface for that queue.

## Status

**Wired to live cloud backend.** Calls the JSON API at https://beeper-v2-host.vercel.app (CORS-allowed). Identity is set via a localStorage'd `beeper_user` slug (`chinat`/`edward`/`kaan`/`jeffrey`); the gate modal on first load lets you pick.

## Architecture

```
beeper-web-frontend (this) ─HTTPS─►  beeper-v2-host (Next.js on Vercel)
                                        ├─ InsForge (queue + audit)
                                        └─ Twilio (SMS notifications)
```

The host owns Twilio credentials, InsForge access, the close-before-notify ordering, and the admin auth. The frontend is a thin client.

## Env

`.env.local`:
```
NEXT_PUBLIC_BEEPER_API_URL=https://beeper-v2-host.vercel.app
```

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 (theme tokens in `src/app/globals.css` via `@theme`)
- Geist + JetBrains Mono via `next/font/google`
- Material Symbols (Outlined) via Google Fonts CDN
- TypeScript

## Routes

| Route | Page |
|---|---|
| `/` | Home — brand anchor + entry tiles |
| `/inbox` | Queued beeps to me (incoming) — with inline reply/decline |
| `/sent` | Beeps I sent + their reply/queued/declined status |
| `/compose` | New beep form — recipient / urgency L·N·H / task / optional transcript request |
| `/access` | Allowlist — who can beep you |

## Design

Brutalist minimalist: pure white surface, black ink, square corners (`* { border-radius: 0 !important }`), high information density. Color/spacing/typography tokens mirror the design-tokens block in the original mocks.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # all routes compiled
```
