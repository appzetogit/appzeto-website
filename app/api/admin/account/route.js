// A team member changes their own password (the owner's lives in the server settings file)
import { checkPassword, guard, hashPassword, users } from '../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
export async function PATCH(req) {
  const me = await guard(req, { write: true }); if (me instanceof Response) return me
  if (me.env) return Response.json({ error: 'The owner password is changed on the server.' }, { status: 400 })
  let b = {}
  try { b = await req.json() } catch {}
  const c = await users(), u = await c.findOne({ username: me.u })
  if (!u || !checkPassword(String(b.current || ''), u.hash)) return Response.json({ error: 'Your current password is wrong.' }, { status: 400 })
  if (String(b.next || '').length < 10) return Response.json({ error: 'Use at least 10 characters.' }, { status: 400 })
  await c.updateOne({ username: me.u }, { $set: { hash: hashPassword(String(b.next)), updatedAt: new Date() } })
  return Response.json({ ok: true })
}
