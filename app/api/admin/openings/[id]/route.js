// Admin API: edit, open/close or delete one job opening
import { revalidatePath } from 'next/cache'
import { guard } from '../../../../../src/server/auth.js'
import { openings, clean, canEdit, toId } from '../../../../../src/server/openings.js'

export const dynamic = 'force-dynamic'

async function allowed(req) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me
  if (!canEdit(me)) return Response.json({ error: 'Only the owner and HR can manage openings' }, { status: 403 })
  return me
}

export async function PUT(req, { params }) {
  const me = await allowed(req)
  if (me instanceof Response) return me
  const _id = toId((await params).id)
  if (!_id) return Response.json({ error: 'Invalid ID' }, { status: 400 })
  const { value, error } = clean(await req.json().catch(() => ({})))
  if (error) return Response.json({ error }, { status: 400 })
  const r = await (await openings()).findOneAndUpdate({ _id }, { $set: { ...value, updatedAt: new Date() } }, { returnDocument: 'after' })
  if (!r) return Response.json({ error: 'Opening not found' }, { status: 404 })
  revalidatePath('/apply-now')
  return Response.json({ ok: true, opening: r })
}

export async function DELETE(req, { params }) {
  const me = await allowed(req)
  if (me instanceof Response) return me
  const _id = toId((await params).id)
  if (!_id) return Response.json({ error: 'Invalid ID' }, { status: 400 })
  await (await openings()).deleteOne({ _id })
  revalidatePath('/apply-now')
  return Response.json({ ok: true })
}
