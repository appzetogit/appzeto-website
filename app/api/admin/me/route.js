import { leads } from '../../../../src/server/db.js'
import { guard, readSession } from '../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
// Who is signed in, and how many leads are still unread (for the sidebar badge)
export async function GET(req) {
  const no = guard(req); if (no) return no
  return Response.json({ user: readSession(req).u, unseen: await (await leads()).countDocuments({ seen: false }) })
}
