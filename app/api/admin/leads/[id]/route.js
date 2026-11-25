// One lead: read (marks it seen), update (status, note, assignee, follow-up), delete (owner)
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { leads } from '../../../../../src/server/db.js'
import { guard, scope, whoIs } from '../../../../../src/server/auth.js'
import { STATUSES, oid, uploadDir } from '../../../../../src/server/leads.js'

export const dynamic = 'force-dynamic'
const notFound = () => Response.json({ error: 'Lead not found' }, { status: 404 })

export async function GET(req, { params }) {
  const me = await guard(req); if (me instanceof Response) return me
  const _id = oid((await params).id); if (!_id) return notFound()
  const lead = await (await leads()).findOneAndUpdate({ _id, ...scope(me) }, { $set: { seen: true } }, { returnDocument: 'after' })
  return lead ? Response.json(lead) : notFound()
}

export async function PATCH(req, { params }) {
  const me = await guard(req, { write: true }); if (me instanceof Response) return me
  const _id = oid((await params).id); if (!_id) return notFound()
  let b = {}
  try { b = await req.json() } catch {}
  const c = await leads(), lead = await c.findOne({ _id, ...scope(me) }, { projection: { status: 1, assignee: 1, followUp: 1 } })
  if (!lead) return notFound()
  const now = new Date(), set = { updatedAt: now }, history = []
  if (b.status && STATUSES.includes(b.status) && b.status !== lead.status) { set.status = b.status; history.push({ at: now, by: me.u, from: lead.status, to: b.status }) }
  if ('assignee' in b && (b.assignee || null) !== (lead.assignee || null)) {
    const to = b.assignee ? await whoIs(String(b.assignee)) : null
    if (b.assignee && !to) return Response.json({ error: 'That person isn’t on the team' }, { status: 400 })
    set.assignee = to ? to.u : null; history.push({ at: now, by: me.u, assign: to ? to.name : null })
  }
  if ('followUp' in b) {
    const d = b.followUp ? new Date(b.followUp + 'T10:00:00+05:30') : null
    if (b.followUp && isNaN(d)) return Response.json({ error: 'Pick a valid date' }, { status: 400 })
    set.followUp = d; history.push({ at: now, by: me.u, follow: b.followUp || null })
  }
  const note = String(b.note || '').trim().slice(0, 2000)
  const push = {}
  if (history.length) push.history = { $each: history }
  if (note) push.notes = { at: now, by: me.u, text: note }
  await c.updateOne({ _id }, { $set: set, ...(Object.keys(push).length ? { $push: push } : {}) })
  return Response.json(await c.findOne({ _id }))
}

// Delete on request (privacy): removes the lead and its CV for good. Owner only.
export async function DELETE(req, { params }) {
  const me = await guard(req, { write: true, owner: true }); if (me instanceof Response) return me
  const _id = oid((await params).id); if (!_id) return notFound()
  const c = await leads(), lead = await c.findOne({ _id }, { projection: { cv: 1 } })
  if (!lead) return notFound()
  if (lead.cv?.file) await unlink(join(uploadDir(), lead.cv.file)).catch(() => {})
  await c.deleteOne({ _id })
  return Response.json({ ok: true })
}
