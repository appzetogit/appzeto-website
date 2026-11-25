// Admin login: one account from env, scrypt-hashed password, HMAC-signed session cookie,
// lockout after repeated failures. No database needed for auth.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export const COOKIE = 'az_admin'
const DAY = 864e5, LIFE = 7 * DAY

export function hashPassword(pw, salt = randomBytes(16).toString('hex')) {
  return `scrypt:${salt}:${scryptSync(pw, salt, 64).toString("hex")}`
}
function checkPassword(pw, stored) {
  const [k, salt, hex] = String(stored || '').split(':')
  if (k !== 'scrypt' || !salt || !hex) return false
  const a = Buffer.from(hex, 'hex'), b = scryptSync(pw, salt, a.length)
  return a.length === b.length && timingSafeEqual(a, b)
}
const secret = () => {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ characters)')
  return s
}
const sign = v => createHmac('sha256', secret()).update(v).digest('base64url')

export function makeSession(user) {
  const body = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + LIFE })).toString('base64url')
  return `${body}.${sign(body)}`
}
export function readSession(req) {
  const raw = req.cookies.get(COOKIE)?.value
  if (!raw) return null
  const [body, mac] = raw.split('.')
  if (!body || !mac) return null
  const want = Buffer.from(sign(body)), got = Buffer.from(mac)
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null
  try { const s = JSON.parse(Buffer.from(body, 'base64url').toString()); return s.exp > Date.now() && s.u === process.env.ADMIN_USER ? s : null } catch { return null }
}
export const cookieOpts = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: LIFE / 1000 })

// Lockout: 5 wrong tries from one address locks it for 15 minutes
const tries = new Map()
export function locked(ip) { const t = tries.get(ip); return !!t && t.until > Date.now() }
export function tryLogin(ip, user, pw) {
  const ok = !!process.env.ADMIN_USER && user === process.env.ADMIN_USER && checkPassword(pw, process.env.ADMIN_PASSWORD_HASH)
  if (ok) { tries.delete(ip); return true }
  const t = tries.get(ip) || { n: 0, until: 0 }
  t.n++; if (t.n >= 5) { t.until = Date.now() + 15 * 6e4; t.n = 0 }
  tries.set(ip, t)
  return false
}

export const ipOf = req => (req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'local').trim()
// Mutating admin calls must come from this site (cookie is SameSite=Strict too)
export const sameOrigin = req => { const o = req.headers.get('origin'); return !o || new URL(o).host === req.headers.get('host') }
// Use at the top of every admin API route
export function guard(req, { write } = {}) {
  if (!readSession(req)) return Response.json({ error: 'Not signed in' }, { status: 401 })
  if (write && !sameOrigin(req)) return Response.json({ error: 'Bad origin' }, { status: 403 })
  return null
}
