// Public: every website form posts here.
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { leads } from '../../../src/server/db.js'
import { ipOf } from '../../../src/server/auth.js'
import { KINDS, summarise, uploadDir } from '../../../src/server/leads.js'

export const dynamic = 'force-dynamic'
const META = new Set(['kind', 'website', 't', 'page', 'landing', 'ref', 'cv', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'])
const MAX_CV = 5 * 1024 * 1024

// 6 submissions per 10 minutes from one address
const hits = new Map()
function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 6e5)
  list.push(now); hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length > 6
}
const bad = (msg, status = 400) => Response.json({ ok: false, error: msg }, { status })

export async function POST(req) {
  let fd
  try { fd = await req.formData() } catch { return bad('Could not read the form') }
  const kind = String(fd.get('kind') || '')
  if (!KINDS[kind]) return bad('Unknown form')
  // Bots: the hidden field must stay empty, and nobody fills a form in under 2 seconds
  const age = Date.now() - Number(fd.get('t'))
  if (fd.get('website') || !(age > 2000 && age < 864e5)) return Response.json({ ok: true })
  if (limited(ipOf(req))) return bad('Too many messages. Please try again in a few minutes.', 429)

  const fields = {}
  for (const [k, v] of fd.entries()) if (!META.has(k) && typeof v === 'string' && Object.keys(fields).length < 20) fields[String(k).slice(0, 60)] = v.trim().slice(0, 3000)
  const s = summarise(kind, fields)
  if (!s.name || !(s.phone || s.email)) return bad('Please add your name and a phone number or email.')

  let cv = null, f = fd.get('cv')
  if (kind === 'career' && f && typeof f !== 'string' && f.size > 0) {
    if (f.size > MAX_CV) return bad('The CV must be a PDF under 5 MB.')
    const buf = Buffer.from(await f.arrayBuffer())
    if (buf.subarray(0, 5).toString() !== '%PDF-') return bad('The CV must be a PDF under 5 MB.')
    const file = randomBytes(16).toString('hex') + '.pdf'
    await mkdir(uploadDir(), { recursive: true })
    await writeFile(join(uploadDir(), file), buf)
    cv = { file, name: String(f.name || 'cv.pdf').replace(/[^\w .()-]/g, '_').slice(0, 120), size: f.size }
  }

  const ua = req.headers.get('user-agent') || '', utm = {}
  for (const k of ['source', 'medium', 'campaign', 'term', 'content']) { const v = fd.get('utm_' + k); if (v) utm[k] = String(v).slice(0, 120) }
  const now = new Date()
  await (await leads()).insertOne({
    kind, ...s, fields, cv, status: 'new', seen: false, notes: [], history: [{ at: now, to: 'new' }],
    source: { page: String(fd.get('page') || '').slice(0, 200), landing: String(fd.get('landing') || '').slice(0, 300), referrer: String(fd.get('ref') || '').slice(0, 300), utm, device: /Mobi|Android|iPhone|iPad/i.test(ua) ? 'phone' : 'desktop', ua: ua.slice(0, 300) },
    createdAt: now, updatedAt: now,
  })
  return Response.json({ ok: true })
}
