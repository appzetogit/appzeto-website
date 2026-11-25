import { leads } from '../../../../src/server/db.js'
import { guard, scope, users } from '../../../../src/server/auth.js'
import { mailReady } from '../../../../src/server/mail.js'

export const dynamic = 'force-dynamic'
// Who is signed in, their unread count, and the team (for "assign to")
export async function GET(req) {
  const me = await guard(req); if (me instanceof Response) return me
  const [unseen, team] = await Promise.all([
    (await leads()).countDocuments({ ...scope(me), seen: false }),
    (await users()).find({ active: true }, { projection: { username: 1, name: 1, role: 1 } }).sort({ name: 1 }).toArray(),
  ])
  return Response.json({ user: me.u, name: me.name, role: me.role, env: !!me.env, unseen, team: team.map(t => ({ u: t.username, name: t.name, role: t.role })), mail: mailReady() })
}
