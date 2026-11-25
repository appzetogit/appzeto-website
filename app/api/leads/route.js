// Public: every website form posts here.
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { leads } from '../../../src/server/db.js'
import { KINDS_FOR, ipOf, users } from '../../../src/server/auth.js'
import { KINDS, contactKeys, summarise, uploadDir } from '../../../src/server/leads.js'
import { getOps, getSite } from '../../../src/server/settings.js'
import { autoReply, leadAlert } from '../../../src/server/mail.js'

export const dynamic = 'force-dynamic'
const META = new Set(['kind', 'website', 't', 'page', 'landing', 'ref', 'cv', 'consent', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'])
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
  if (fd.get('consent') !== 'yes') return bad('Please tick the box so we can contact you about this.')

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
  const now = new Date(), keys = contactKeys(s)
  const source = { page: String(fd.get('page') || '').slice(0, 200), landing: String(fd.get('landing') || '').slice(0, 300), referrer: String(fd.get('ref') || '').slice(0, 300), utm, device: /Mobi|Android|iPhone|iPad/i.test(ua) ? 'phone' : 'desktop', ua: ua.slice(0, 300) }
  const c = await leads()

  // Same person, same form again: add it to their existing lead instead of a new row
  const or = [keys.phoneKey && { phoneKey: keys.phoneKey }, keys.emailKey && { emailKey: keys.emailKey }].filter(Boolean)
  const prev = or.length ? await c.findOne({ kind, $or: or }, { sort: { createdAt: -1 } }) : null
  let lead, repeat = false
  if (prev) {
    repeat = true
    await c.updateOne({ _id: prev._id }, { $set: { seen: false, updatedAt: now, fields, ...s, ...(cv ? { cv } : {}) }, $inc: { times: 1 }, $push: { submissions: { at: now, fields: prev.fields, source: prev.source }, history: { at: now, to: prev.status, again: true } } })
    lead = await c.findOne({ _id: prev._id })
  } else {
    lead = { kind, ...s, ...keys, fields, cv, consent: { at: now }, status: 'new', seen: false, times: 1, assignee: null, followUp: null, notes: [], history: [{ at: now, to: 'new' }], source, createdAt: now, updatedAt: now }
    lead._id = (await c.insertOne(lead)).insertedId
  }

  // Emails go out in the background; the visitor isn't kept waiting
  ;(async () => {
    const [ops, site, team] = await Promise.all([getOps(), getSite(), users().then(u => u.find({ active: true, email: { $nin: [null, ''] } }).toArray())])
    const to = new Set([...(ops.alertEmails || []), ...team.filter(p => p.role !== 'owner' && KINDS_FOR[p.role]?.includes(kind) && (!lead.assignee || lead.assignee === p.username)).map(p => p.email)])
    await leadAlert([...to], lead, { repeat })
    if (!repeat && ops.autoReply) await autoReply(lead, site.phones?.[0])
  })().catch(e => console.error('[lead mail]', e.message))

  return Response.json({ ok: true })
}
