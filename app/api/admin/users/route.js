// Team (owner only): list and add people
import { ROLES, guard, hashPassword, users } from '../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
export async function GET(req) {
  const me = await guard(req, { owner: true }); if (me instanceof Response) return me
  const list = await (await users()).find({}, { projection: { hash: 0 } }).sort({ active: -1, name: 1 }).toArray()
  return Response.json({ users: list, roles: ROLES, owner: process.env.ADMIN_USER })
}
export async function POST(req) {
  const me = await guard(req, { write: true, owner: true }); if (me instanceof Response) return me
  let b = {}
  try { b = await req.json() } catch {}
  const username = String(b.username || '').trim().toLowerCase(), name = String(b.name || '').trim().slice(0, 80), email = String(b.email || '').trim().slice(0, 120), role = String(b.role || ''), pw = String(b.password || '')
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return Response.json({ error: 'Username: 3–30 letters, numbers, dots or dashes.' }, { status: 400 })
  if (username === process.env.ADMIN_USER) return Response.json({ error: 'That username is taken.' }, { status: 400 })
  if (!ROLES[role] || role === 'owner') return Response.json({ error: 'Pick Sales or HR.' }, { status: 400 })
  if (pw.length < 10) return Response.json({ error: 'The first password needs at least 10 characters.' }, { status: 400 })
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: 'That email doesn’t look right.' }, { status: 400 })
  const c = await users()
  if (await c.findOne({ username })) return Response.json({ error: 'That username is taken.' }, { status: 400 })
  await c.insertOne({ username, name: name || username, email, role, hash: hashPassword(pw), active: true, createdAt: new Date(), createdBy: me.u })
  return Response.json({ ok: true })
}
