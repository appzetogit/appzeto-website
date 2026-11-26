// Public API: fetch active gallery categories and photos
import { gallery, galleryCategories } from '../../../src/server/db.js'
import { ensureSeed } from '../../../src/server/gallery.js'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    await ensureSeed()
    const [categories, photos] = await Promise.all([
      (await galleryCategories()).find({}).sort({ order: 1, name: 1 }).toArray(),
      (await gallery()).find({}).sort({ sortOrder: 1, createdAt: -1 }).toArray(),
    ])
    return Response.json({ ok: true, categories, photos })
  } catch (err) {
    console.error('Gallery API error:', err)
    return Response.json({ ok: false, error: 'Could not load gallery' }, { status: 500 })
  }
}
