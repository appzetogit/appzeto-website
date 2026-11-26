import { leads } from '../../../../src/server/db.js'
import { KINDS_FOR, guard, scope, users } from '../../../../src/server/auth.js'
import { mailReady } from '../../../../src/server/mail.js'

export const dynamic = 'force-dynamic'
// Who is signed in, their unread count, and the team (for "assign to")
export async function GET(req) {
  const me = await guard(req); if (me instanceof Response) return me
  const [unread, team] = await Promise.all([
    (await leads()).aggregate([{ $match: { ...scope(me), seen: false } }, { $group: { _id: '$kind', n: { $sum: 1 } } }]).toArray(),
    (await users()).find({ active: true }, { projection: { username: 1, name: 1, role: 1 } }).sort({ name: 1 }).toArray(),
  ])
  const unseenBy = Object.fromEntries(unread.map(k => [k._id, k.n]))
  return Response.json({ user: me.u, name: me.name, role: me.role, env: !!me.env, kinds: KINDS_FOR[me.role], unseen: unread.reduce((a, k) => a + k.n, 0), unseenBy, team: team.map(t => ({ u: t.username, name: t.name, role: t.role })), mail: mailReady() })
}
