// Dashboard numbers
import { leads } from '../../../../src/server/db.js'
import { guard } from '../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
const IST = 'Asia/Kolkata'
export async function GET(req) {
  const no = guard(req); if (no) return no
  const c = await leads(), now = Date.now(), since = new Date(now - 29 * 864e5)
  const group = (field, match = {}) => c.aggregate([{ $match: match }, { $group: { _id: field, n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray()
  const [total, unseen, week, byStatus, byKind, byProduct, byPage, byDevice, perDay] = await Promise.all([
    c.countDocuments(), c.countDocuments({ seen: false }), c.countDocuments({ createdAt: { $gte: new Date(now - 7 * 864e5) } }),
    group('$status'), group('$kind'), group('$product'), group('$source.page'), group('$source.device'),
    group({ $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: IST } }, { createdAt: { $gte: since } }),
  ])
  const st = Object.fromEntries(byStatus.map(s => [s._id, s.n])), closed = (st.won || 0) + (st.lost || 0)
  const days = [...Array(30)].map((_, i) => { const d = new Date(now - (29 - i) * 864e5).toLocaleDateString('en-CA', { timeZone: IST }); return { day: d, n: perDay.find(p => p._id === d)?.n || 0 } })
  return Response.json({ total, unseen, week, status: st, winRate: closed ? Math.round((st.won || 0) / closed * 100) : null, byKind, byProduct: byProduct.filter(p => p._id).slice(0, 10), byPage: byPage.filter(p => p._id).slice(0, 8), byDevice, days })
}
