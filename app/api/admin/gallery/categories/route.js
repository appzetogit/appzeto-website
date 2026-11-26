// Admin API: manage gallery categories
import { guard } from '../../../../../src/server/auth.js'
import { gallery, galleryCategories } from '../../../../../src/server/db.js'
import { toOid, toSlug } from '../../../../../src/server/gallery.js'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const me = await guard(req)
  if (me instanceof Response) return me

  const [cats, photos] = await Promise.all([
    (await galleryCategories()).find({}).sort({ order: 1, name: 1 }).toArray(),
    (await gallery()).find({}, { projection: { categorySlug: 1 } }).toArray(),
  ])

  const counts = {}
  photos.forEach(p => {
    counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1
  })

  const withCounts = cats.map(c => ({
    ...c,
    count: counts[c.slug] || 0,
  }))

  return Response.json({ ok: true, categories: withCounts })
}

export async function POST(req) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me

  const body = await req.json()
  const name = String(body.name || '').trim()
  const description = String(body.description || '').trim()
  const icon = String(body.icon || '📷').trim()

  if (!name) return Response.json({ error: 'Category name is required' }, { status: 400 })
  const slug = toSlug(name)

  const col = await galleryCategories()
  const exists = await col.findOne({ slug })
  if (exists) return Response.json({ error: 'Category already exists' }, { status: 400 })

  const order = (await col.countDocuments()) + 1
  const doc = { name, slug, description, icon, order }
  const res = await col.insertOne(doc)
  return Response.json({ ok: true, category: { ...doc, _id: res.insertedId, count: 0 } })
}

export async function DELETE(req) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const _id = toOid(id)
  if (!_id) return Response.json({ error: 'Invalid ID' }, { status: 400 })

  const col = await galleryCategories()
  await col.deleteOne({ _id })
  return Response.json({ ok: true })
}
