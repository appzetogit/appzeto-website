// Change a team member (owner only): name, email, role, active, new password
import { ROLES, guard, hashPassword, users } from '../../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
export async function PATCH(req, { params }) {
  const me = await guard(req, { write: true, owner: true }); if (me instanceof Response) return me
  const username = decodeURIComponent((await params).username)
  let b = {}
  try { b = await req.json() } catch {}
  const set = {}
  if ('name' in b) set.name = String(b.name).trim().slice(0, 80)
  if ('email' in b) { const e = String(b.email).trim(); if (e && !/^\S+@\S+\.\S+$/.test(e)) return Response.json({ error: 'That email doesn’t look right.' }, { status: 400 }); set.email = e }
  if ('role' in b) { if (!ROLES[b.role] || b.role === 'owner') return Response.json({ error: 'Pick Sales or HR.' }, { status: 400 }); set.role = b.role }
  if ('active' in b) set.active = !!b.active
  if (b.password) { if (String(b.password).length < 10) return Response.json({ error: 'Use at least 10 characters.' }, { status: 400 }); set.hash = hashPassword(String(b.password)) }
  const r = await (await users()).updateOne({ username }, { $set: { ...set, updatedAt: new Date() } })
  return r.matchedCount ? Response.json({ ok: true }) : Response.json({ error: 'Not found' }, { status: 404 })
}
