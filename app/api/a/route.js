// Public: the website's tiny tracker posts page views and a few clicks here (see src/track.js).
// Never stores the address or the full browser string; drops bots and admin pages.
import { ipOf } from '../../../src/server/auth.js'
import { BOT, readUA, regionOf, sourceOf, visitorId, visits } from '../../../src/server/analytics.js'

export const dynamic = 'force-dynamic'
const TYPES = new Set(['view', 'leave', 'event'])
const EVENTS = new Set(['cta', 'call', 'whatsapp', 'email', 'form_start', 'lead', 'product_tab', 'outbound'])
const str = (v, n) => typeof v === 'string' ? v.slice(0, n) : undefined
const hits = new Map()

export async function POST(req) {
  const ok = () => new Response(null, { status: 204 })
  const ua = req.headers.get('user-agent') || ''
  if (!ua || BOT.test(ua)) return ok()
  let b
  try { b = JSON.parse(await req.text()) } catch { return ok() }
  const type = b?.t, path = str(b?.p, 200)
  if (!TYPES.has(type) || !path?.startsWith('/') || path.startsWith('/admin')) return ok()
  if (type === 'event' && !EVENTS.has(b.n)) return ok()
  const ip = ipOf(req), now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 6e4)
  list.push(now); hits.set(ip, list); if (hits.size > 10000) hits.clear()
  if (list.length > 120) return ok() // more than 2 a second for a minute: not a person

  const utm = {}
  for (const k of ['source', 'medium', 'campaign']) { const v = str(b.u?.[k], 80); if (v) utm[k] = v }
  const host = (req.headers.get('host') || '').replace(/^www\./, '')
  const doc = { at: new Date(), type, path, sid: visitorId(ip, ua), ...readUA(ua) }
  if (type === 'view') Object.assign(doc, { src: sourceOf(str(b.r, 300), utm, host), utm, region: regionOf(str(b.tz, 60)), lang: str(b.lg, 12), first: !!b.f })
  if (type === 'leave') Object.assign(doc, { dur: Math.max(0, Math.min(Number(b.d) || 0, 30 * 6e4)), depth: Math.max(0, Math.min(Number(b.s) || 0, 100)) })
  if (type === 'event') Object.assign(doc, { name: b.n, label: str(b.l, 80) })
  try { await (await visits()).insertOne(doc) } catch {}
  return ok()
}
