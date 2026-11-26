// Admin API: update or delete photo
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { guard } from '../../../../../src/server/auth.js'
import { gallery } from '../../../../../src/server/db.js'
import { toOid, toSlug } from '../../../../../src/server/gallery.js'

export const dynamic = 'force-dynamic'

export async function DELETE(req, { params }) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me

  const { id } = await params
  const _id = toOid(id)
  if (!_id) return Response.json({ error: 'Invalid ID' }, { status: 400 })

  const col = await gallery()
  const doc = await col.findOne({ _id })
  if (!doc) return Response.json({ error: 'Photo not found' }, { status: 404 })

  // If local file, attempt cleanup
  if (doc.imageUrl && doc.imageUrl.startsWith('/uploads/gallery/')) {
    const filename = doc.imageUrl.replace('/uploads/gallery/', '')
    try {
      await unlink(join(process.cwd(), 'public', 'uploads', 'gallery', filename))
    } catch {
      // Ignored if missing
    }
  }

  await col.deleteOne({ _id })
  return Response.json({ ok: true })
}

export async function PUT(req, { params }) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me

  const { id } = await params
  const _id = toOid(id)
  if (!_id) return Response.json({ error: 'Invalid ID' }, { status: 400 })

  const body = await req.json()
  const update = {}
  if (body.title !== undefined) update.title = String(body.title).trim()
  if (body.caption !== undefined) update.caption = String(body.caption).trim()
  if (body.category !== undefined) {
    update.category = String(body.category).trim()
    update.categorySlug = toSlug(update.category)
  }
  if (body.featured !== undefined) update.featured = !!body.featured
  if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0

  const col = await gallery()
  await col.updateOne({ _id }, { $set: update })
  const updated = await col.findOne({ _id })
  return Response.json({ ok: true, photo: updated })
}
