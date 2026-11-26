// Admin auth. The owner account comes from env (ADMIN_USER + ADMIN_PASSWORD_HASH);
// team members live in the `users` collection with a role. Sessions are HMAC-signed cookies,
// checked against the database on every request so a disabled user is out at once.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { db } from './db.js'

export const COOKIE = 'az_admin'
const DAY = 864e5, LIFE = 7 * DAY
// What each role may see. Owners also manage the team and settings.
export const ROLES = { owner: 'Owner', sales: 'Sales', hr: 'HR' }
export const KINDS_FOR = { owner: ['idea', 'partner', 'career'], sales: ['idea', 'partner'], hr: ['career'] }

export function hashPassword(pw, salt = randomBytes(16).toString('hex')) {
  return `scrypt:${salt}:${scryptSync(pw, salt, 64).toString('hex')}`
}
export function checkPassword(pw, stored) {
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
function readSession(req) {
  const raw = req.cookies.get(COOKIE)?.value
  if (!raw) return null
  const [body, mac] = raw.split('.')
  if (!body || !mac) return null
  const want = Buffer.from(sign(body)), got = Buffer.from(mac)
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null
  try { const s = JSON.parse(Buffer.from(body, 'base64url').toString()); return s.exp > Date.now() ? s : null } catch { return null }
}
export const cookieOpts = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: LIFE / 1000 })
export const users = async () => (await db()).collection('users')
const isOwnerEnv = u => !!process.env.ADMIN_USER && u === process.env.ADMIN_USER

// Who a username is right now: { u, role, name, email } or null
export async function whoIs(u) {
  if (isOwnerEnv(u)) return { u, role: 'owner', name: 'Owner', email: '', env: true }
  const x = await (await users()).findOne({ username: u, active: true })
  return x ? { u, role: x.role, name: x.name || u, email: x.email || '' } : null
}

// Lockout: 5 wrong tries from one address locks it for 15 minutes
const tries = new Map()
export function locked(ip) { const t = tries.get(ip); return !!t && t.until > Date.now() }
export async function tryLogin(ip, user, pw) {
  let ok = false
  if (isOwnerEnv(user)) ok = checkPassword(pw, process.env.ADMIN_PASSWORD_HASH)
  else if (user) { const x = await (await users()).findOne({ username: user, active: true }); ok = !!x && checkPassword(pw, x.hash) }
  if (ok) { tries.delete(ip); return true }
  const t = tries.get(ip) || { n: 0, until: 0 }
  t.n++; if (t.n >= 5) { t.until = Date.now() + 15 * 6e4; t.n = 0 }
  tries.set(ip, t)
  return false
}

export const ipOf = req => (req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'local').trim()
export const sameOrigin = req => { const o = req.headers.get('origin'); return !o || new URL(o).host === req.headers.get('host') }
// Top of every admin API route: returns the signed-in person, or a Response to send back.
//   const me = await guard(req); if (me instanceof Response) return me
export async function guard(req, { write, owner } = {}) {
  const s = readSession(req), me = s && await whoIs(s.u)
  if (!me) return Response.json({ error: 'Not signed in' }, { status: 401 })
  if (write && !sameOrigin(req)) return Response.json({ error: 'Bad origin' }, { status: 403 })
  if (owner && me.role !== 'owner') return Response.json({ error: 'Only the owner can do this' }, { status: 403 })
  return me
}
// Leads a person may see
export const scope = me => ({ kind: { $in: KINDS_FOR[me.role] || [] } })
