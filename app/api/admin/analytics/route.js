// Analytics for the admin: ?days=7|30|90 (compared with the period before)
import { leads } from '../../../../src/server/db.js'
import { guard, scope } from '../../../../src/server/auth.js'
import { sourceOf, visits } from '../../../../src/server/analytics.js'
import { products } from '../../../../src/data.js'

export const dynamic = 'force-dynamic'
const IST = 'Asia/Kolkata'
const day = { $dateToString: { format: '%Y-%m-%d', date: '$at', timezone: IST } }

export async function GET(req) {
  const me = await guard(req); if (me instanceof Response) return me
  const days = [7, 30, 90].includes(Number(req.nextUrl.searchParams.get('days'))) ? Number(req.nextUrl.searchParams.get('days')) : 30
  const now = Date.now(), from = new Date(now - days * 864e5), prevFrom = new Date(now - 2 * days * 864e5)
  const v = await visits(), inRange = { at: { $gte: from } }
  const agg = p => v.aggregate(p).toArray()
  const uniq = (match) => agg([{ $match: match }, { $group: { _id: { s: '$sid', d: day } } }, { $count: 'n' }]).then(r => r[0]?.n || 0)
  const top = (field, match, n = 10) => agg([{ $match: { ...inRange, ...match } }, { $group: { _id: field, views: { $sum: 1 }, people: { $addToSet: { s: '$sid', d: day } } } }, { $project: { views: 1, visitors: { $size: '$people' } } }, { $sort: { visitors: -1, views: -1 } }, { $limit: n }])

  const [views, prevViews, visitors, prevVisitors, live, perDay, pages, times, sources, devices, browsers, regions, events, tabs, funnel, leadList] = await Promise.all([
    v.countDocuments({ type: 'view', ...inRange }), v.countDocuments({ type: 'view', at: { $gte: prevFrom, $lt: from } }),
    uniq({ type: 'view', ...inRange }), uniq({ type: 'view', at: { $gte: prevFrom, $lt: from } }),
    agg([{ $match: { at: { $gte: new Date(now - 5 * 6e4) } } }, { $sort: { at: -1 } }, { $group: { _id: '$sid', path: { $first: '$path' } } }, { $group: { _id: '$path', n: { $sum: 1 } } }, { $sort: { n: -1 } }]),
    agg([{ $match: { type: 'view', ...inRange } }, { $group: { _id: day, views: { $sum: 1 }, people: { $addToSet: '$sid' } } }, { $project: { views: 1, visitors: { $size: '$people' } } }]),
    top('$path', { type: 'view' }, 12),
    agg([{ $match: { type: 'leave', ...inRange } }, { $group: { _id: '$path', dur: { $avg: '$dur' }, depth: { $avg: '$depth' } } }]),
    top('$src', { type: 'view', first: true }),
    top('$device', { type: 'view' }), top('$browser', { type: 'view' }, 6), top('$region', { type: 'view', first: true }, 8),
    agg([{ $match: { type: 'event', ...inRange } }, { $group: { _id: '$name', n: { $sum: 1 } } }]),
    agg([{ $match: { type: 'event', name: 'product_tab', ...inRange } }, { $group: { _id: '$label', n: { $sum: 1 } } }, { $sort: { n: -1 } }]),
    Promise.all([uniq({ type: 'view', ...inRange }), uniq({ type: 'event', name: 'form_start', ...inRange }), uniq({ type: 'event', name: 'lead', ...inRange })]),
    (await leads()).find({ ...scope(me), createdAt: { $gte: from } }, { projection: { source: 1, kind: 1 } }).toArray(),
  ])

  const host = (req.headers.get('host') || '').replace(/^www\./, '')
  const leadsBySource = {}
  for (const l of leadList) { const s = sourceOf(l.source?.referrer, l.source?.utm, host); leadsBySource[s] = (leadsBySource[s] || 0) + 1 }
  const t = Object.fromEntries(times.map(x => [x._id, x]))
  const series = [...Array(days)].map((_, i) => { const d = new Date(now - (days - 1 - i) * 864e5).toLocaleDateString('en-CA', { timeZone: IST }), r = perDay.find(p => p._id === d); return { day: d, views: r?.views || 0, visitors: r?.visitors || 0 } })
  const prod = products.map(p => ({ name: p.short, views: pages.find(x => x._id === p.path)?.views || 0, taps: tabs.find(x => x._id === p.short)?.n || 0 })).filter(p => p.views || p.taps).sort((a, b) => b.views + b.taps - a.views - a.taps)
  const allT = times.reduce((a, x) => a + (x.dur || 0), 0) / (times.length || 1)

  return Response.json({
    days, views, prevViews, visitors, prevVisitors, leads: leadList.length,
    avgTime: Math.round(allT / 1000), live: { n: live.reduce((a, x) => a + x.n, 0), pages: live.map(x => ({ path: x._id, n: x.n })) },
    series,
    pages: pages.map(p => ({ path: p._id, views: p.views, visitors: p.visitors, time: Math.round((t[p._id]?.dur || 0) / 1000), depth: Math.round(t[p._id]?.depth || 0) })),
    sources: sources.map(s => ({ name: s._id, visitors: s.visitors, leads: leadsBySource[s._id] || 0 })),
    devices: devices.map(d => ({ name: d._id, n: d.visitors })), browsers: browsers.map(d => ({ name: d._id, n: d.visitors })), regions: regions.map(d => ({ name: d._id, n: d.visitors })),
    clicks: Object.fromEntries(events.map(e => [e._id, e.n])),
    funnel: { visitors: funnel[0], started: funnel[1], sent: funnel[2] },
    products: prod,
  })
}
