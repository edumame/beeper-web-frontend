// src/lib/import.ts
// Pure helpers for parsing pasted-CSV / Apple-Contacts-VCard-export-as-CSV into
// the shape the /api/admin/contacts/import endpoint expects.

export type ContactRow = {
  id: string
  display_name: string
  phone: string
}

const NAME_KEYS = ['name', 'display_name', 'full name', 'fullname']
const PHONE_KEYS = ['phone', 'sms', 'mobile', 'cell', 'phone number']

export function slugify(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? ''
  return first.toLowerCase().replace(/[^a-z0-9_-]/g, '')
}

export function normalizePhone(raw: string): string {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  if (raw.trim().startsWith('+')) return '+' + digits
  if (digits.length === 10) return '+1' + digits
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits
  return '+' + digits
}

function parseRow(line: string): string[] {
  const out: string[] = []
  let buf = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { buf += '"'; i++; continue }
      if (ch === '"') { inQuotes = false; continue }
      buf += ch
      continue
    }
    if (ch === '"') { inQuotes = true; continue }
    if (ch === ',') { out.push(buf); buf = ''; continue }
    buf += ch
  }
  out.push(buf)
  return out.map(s => s.trim())
}

export function parseContactsCsv(csv: string): ContactRow[] {
  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return []
  const headers = parseRow(lines[0]).map(h => h.toLowerCase())
  const nameIdx = headers.findIndex(h => NAME_KEYS.includes(h))
  const phoneIdx = headers.findIndex(h => PHONE_KEYS.includes(h))
  if (nameIdx < 0 || phoneIdx < 0) return []
  const out: ContactRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cells = parseRow(lines[i])
    const name = (cells[nameIdx] ?? '').trim()
    const phone = normalizePhone(cells[phoneIdx] ?? '')
    if (!name || !phone) continue
    const id = slugify(name)
    if (!id) continue
    out.push({ id, display_name: name, phone })
  }
  return out
}
