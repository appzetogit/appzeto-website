// One lead: read (marks it seen), change status, add a note
import { leads } from '../../../../../src/server/db.js'
import { guard } from '../../../../../src/server/auth.js'
import { STATUSES, oid } from '../../../../../src/server/leads.js'

export const dynamic = 'force-dynamic'
const notFound = () => Response.json({ error: 'Lead not found' }, { status: 404 })

export async function GET(req, { params }) {
  const no = guard(req); if (no) return no
  const _id = oid((await params).id); if (!_id) return notFound()
  const lead = await (await leads()).findOneAndUpdate({ _id }, { $set: { seen: true } }, { returnDocument: 'after' })
  return lead ? Response.json(lead) : notFound()
}

export async function PATCH(req, { params }) {
  const no = guard(req, { write: true }); if (no) return no
  const _id = oid((await params).id); if (!_id) return notFound()
  let b = {}
  try { b = await req.json() } catch {}
  const c = await leads(), lead = await c.findOne({ _id }, { projection: { status: 1 } })
  if (!lead) return notFound()
  const now = new Date(), set = { updatedAt: now }, push = {}
  if (b.status && STATUSES.includes(b.status) && b.status !== lead.status) { set.status = b.status; push.history = { at: now, from: lead.status, to: b.status } }
  const note = String(b.note || '').trim().slice(0, 2000)
  if (note) push.notes = { at: now, text: note }
  await c.updateOne({ _id }, { $set: set, ...(Object.keys(push).length ? { $push: push } : {}) })
  return Response.json(await c.findOne({ _id }))
}
