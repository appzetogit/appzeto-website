// Admin API: list and add gallery photos
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { guard } from '../../../../src/server/auth.js'
import { gallery, galleryCategories } from '../../../../src/server/db.js'
import { ensureSeed, galleryUploadDir, toSlug } from '../../../../src/server/gallery.js'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const me = await guard(req)
  if (me instanceof Response) return me

  try {
    await ensureSeed()
    const [categories, photos] = await Promise.all([
      (await galleryCategories()).find({}).sort({ order: 1, name: 1 }).toArray(),
      (await gallery()).find({}).sort({ createdAt: -1 }).toArray(),
    ])
    return Response.json({ ok: true, categories, photos })
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const me = await guard(req, { write: true })
  if (me instanceof Response) return me

  const contentType = req.headers.get('content-type') || ''

  try {
    let title = '', caption = '', category = '', imageUrl = '', featured = false

    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData()
      title = String(fd.get('title') || '').trim()
      caption = String(fd.get('caption') || '').trim()
      category = String(fd.get('category') || '').trim()
      featured = fd.get('featured') === 'true' || fd.get('featured') === true

      const file = fd.get('file')
      if (file && typeof file !== 'string' && file.size > 0) {
        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
          return Response.json({ error: 'Image file must be under 10 MB.' }, { status: 400 })
        }
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
        if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
          return Response.json({ error: 'Supported formats: JPG, PNG, WebP, GIF' }, { status: 400 })
        }
        const filename = `${randomBytes(16).toString('hex')}.${ext}`
        const filePath = join(process.cwd(), 'public', 'uploads', 'gallery', filename)
        await mkdir(join(process.cwd(), 'public', 'uploads', 'gallery'), { recursive: true })
        const buf = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buf)
        imageUrl = `/uploads/gallery/${filename}`
      } else {
        imageUrl = String(fd.get('imageUrl') || '').trim()
      }
    } else {
      const body = await req.json()
      title = String(body.title || '').trim()
      caption = String(body.caption || '').trim()
      category = String(body.category || '').trim()
      imageUrl = String(body.imageUrl || '').trim()
      featured = !!body.featured
    }

    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 })
    if (!category) return Response.json({ error: 'Category is required' }, { status: 400 })
    if (!imageUrl) return Response.json({ error: 'An image file or image URL is required' }, { status: 400 })

    const categorySlug = toSlug(category)

    // Ensure category exists in categories collection
    const catCol = await galleryCategories()
    const existingCat = await catCol.findOne({ slug: categorySlug })
    if (!existingCat) {
      await catCol.insertOne({
        name: category,
        slug: categorySlug,
        description: '',
        icon: '📷',
        order: (await catCol.countDocuments()) + 1,
      })
    }

    const doc = {
      title,
      caption,
      category,
      categorySlug,
      imageUrl,
      featured,
      createdAt: new Date(),
      sortOrder: 0,
      createdBy: me.u,
    }

    const res = await (await gallery()).insertOne(doc)
    return Response.json({ ok: true, photo: { ...doc, _id: res.insertedId } })
  } catch (err) {
    console.error('Error uploading photo:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
