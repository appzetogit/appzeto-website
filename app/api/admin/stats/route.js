// Dashboard numbers
import { leads } from '../../../../src/server/db.js'
import { guard, scope } from '../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
const IST = 'Asia/Kolkata'
export async function GET(req) {
  const me = await guard(req); if (me instanceof Response) return me
  const c = await leads(), now = Date.now(), since = new Date(now - 29 * 864e5), mine = scope(me)
  const endToday = new Date(new Date().toLocaleDateString('en-CA', { timeZone: IST }) + 'T23:59:59.999+05:30'), open = { $nin: ['won', 'lost'] }
  const group = (field, match = {}) => c.aggregate([{ $match: { ...mine, ...match } }, { $group: { _id: field, n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray()
  const [due, unassigned, total, unseen, week, byStatus, byKind, byProduct, byPage, byDevice, perDay] = await Promise.all([
    c.find({ ...mine, followUp: { $lte: endToday }, status: open, ...(me.role === 'owner' ? {} : { assignee: me.u }) }, { projection: { name: 1, product: 1, kind: 1, followUp: 1, assignee: 1, phone: 1 } }).sort({ followUp: 1 }).limit(20).toArray(),
    c.countDocuments({ ...mine, assignee: { $in: [null, ''] }, status: open }),
    c.countDocuments(mine), c.countDocuments({ ...mine, seen: false }), c.countDocuments({ ...mine, createdAt: { $gte: new Date(now - 7 * 864e5) } }),
    group('$status'), group('$kind'), group('$product'), group('$source.page'), group('$source.device'),
    group({ $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: IST } }, { createdAt: { $gte: since } }),
  ])
  const st = Object.fromEntries(byStatus.map(s => [s._id, s.n])), closed = (st.won || 0) + (st.lost || 0)
  const days = [...Array(30)].map((_, i) => { const d = new Date(now - (29 - i) * 864e5).toLocaleDateString('en-CA', { timeZone: IST }); return { day: d, n: perDay.find(p => p._id === d)?.n || 0 } })
  return Response.json({ due, unassigned, total, unseen, week, status: st, winRate: closed ? Math.round((st.won || 0) / closed * 100) : null, byKind, byProduct: byProduct.filter(p => p._id).slice(0, 10), byPage: byPage.filter(p => p._id).slice(0, 8), byDevice, days })
}
