'use client'
// Small fetch helper for the admin: JSON in/out, and back to the login page when signed out.
export const STATUS = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost' }
export const KIND = { idea: 'Idea', career: 'Careers', partner: 'Partner' }

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
  if (res.status === 401 && !path.endsWith('/login')) { location.replace('/admin/login?next=' + encodeURIComponent(location.pathname + location.search)); throw new Error('signed out') }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

const IST = { timeZone: 'Asia/Kolkata' }
export const when = d => new Date(d).toLocaleString('en-IN', { ...IST, day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
export function ago(d) {
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return Math.floor(s / 60) + ' min ago'
  if (s < 86400) return Math.floor(s / 3600) + ' h ago'
  if (s < 7 * 86400) return Math.floor(s / 86400) + ' d ago'
  return new Date(d).toLocaleDateString('en-IN', { ...IST, day: 'numeric', month: 'short' })
}
// Indian numbers without a country code get +91 for WhatsApp
export const waNumber = p => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 ? '91' + d : d }
