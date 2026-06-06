'use client'

import { useEffect, useState } from 'react'
import { api, User } from '@/lib/api'
import { useIdentity } from '@/lib/identity'

/**
 * Modal that lets an allowlisted user pick which identity they are.
 * This is the original "Who are you?" picker, extracted so the landing
 * page can open it on-demand (via the nav "Log In" button or hero CTA).
 */
export function IdentityPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, setMe] = useIdentity()
  const [users, setUsers] = useState<User[]>([])
  const [picked, setPicked] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    api.listUsers().then(us => {
      setUsers(us)
      setPicked(us[0]?.id ?? '')
    }).catch(e => setError((e as Error).message))
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-[#1f1f1f] p-6 max-w-sm w-full flex flex-col gap-3 animate-fade-in"
        style={{ borderRadius: 14, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-[11px] tracking-widest font-bold" style={{ color: '#07c04e', fontFamily: 'var(--font-jetbrains-mono)' }}>
          <span className="beep-dot" /> AUTHENTICATE
        </div>
        <h2 className="font-serif text-2xl text-white">Who are you?</h2>
        <p className="text-[13px] text-[#a3a3a3]">
          Pick your beeper identity. Saved locally; click your name in the header to change.
        </p>
        {error && (
          <div className="text-xs text-red-300 bg-red-950/40 border border-red-900/60 px-2 py-1 rounded">
            {error}
          </div>
        )}
        <select
          value={picked}
          onChange={e => setPicked(e.target.value)}
          className="brutalist-select w-full bg-[#0a0a0a] border border-[#262626] px-3 py-2 rounded text-white"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 14 }}
        >
          {users.map(u => (
            <option key={u.id} value={u.id} style={{ background: '#0a0a0a' }}>
              {u.display_name} ({u.id})
            </option>
          ))}
        </select>
        <div className="flex gap-2 mt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded text-[11px] tracking-widest font-bold text-[#a3a3a3] border border-[#262626] hover:border-[#3a3a3a] transition-colors"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            CANCEL
          </button>
          <button
            onClick={() => picked && setMe(picked)}
            disabled={!picked}
            className="cta-primary flex-1 px-4 py-2.5 rounded text-[11px] tracking-widest font-bold disabled:opacity-40"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  )
}
