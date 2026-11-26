// Admin API: list job openings, add one
import { revalidatePath } from 'next/cache'
import { guard } from '../../../../src/server/auth.js'
import { openings, clean, canEdit } from '../../../../src/server/openings.js'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const me = await guard(req)
  if (me instanceof Response) return me
  if (!canEdit(me)) return Response.json({ error: 'Only the owner and HR can manage openings' }, { status: 403 })
  const list = await (await openings()).find({}).sort({ open: -1, createdAt: -1 }).toArray()
  return Response.json({ ok: true, openings: list })
}

export async function POST(req) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me
  if (!canEdit(me)) return Response.json({ error: 'Only the owner and HR can manage openings' }, { status: 403 })
  const { value, error } = clean(await req.json().catch(() => ({})))
  if (error) return Response.json({ error }, { status: 400 })
  const doc = { ...value, createdAt: new Date(), updatedAt: new Date(), createdBy: me.u }
  const r = await (await openings()).insertOne(doc)
  revalidatePath('/apply-now')
  return Response.json({ ok: true, opening: { ...doc, _id: r.insertedId } })
}
