// Leads inbox: filtered, newest first, 30 per page
import { leads } from '../../../../src/server/db.js'
import { guard, scope } from '../../../../src/server/auth.js'
import { filterFrom } from '../../../../src/server/leads.js'

export const dynamic = 'force-dynamic'
export async function GET(req) {
  const me = await guard(req); if (me instanceof Response) return me
  const sp = req.nextUrl.searchParams, page = Math.max(1, Number(sp.get('page')) || 1), per = 30, q = filterFrom(sp, me)
  const c = await leads()
  const [items, total, products, kinds] = await Promise.all([
    c.find(q, { projection: { fields: 0, history: 0, notes: 0, submissions: 0, 'source.ua': 0 } }).sort({ createdAt: -1 }).skip((page - 1) * per).limit(per).toArray(),
    c.countDocuments(q),
    c.distinct('product', scope(me)),
    c.aggregate([{ $match: scope(me) }, { $group: { _id: '$kind', n: { $sum: 1 }, unseen: { $sum: { $cond: ['$seen', 0, 1] } } } }]).toArray(),
  ])
  return Response.json({ items, total, page, pages: Math.max(1, Math.ceil(total / per)), products: products.filter(Boolean).sort(), kinds: Object.fromEntries(kinds.map(k => [k._id, { n: k.n, unseen: k.unseen }])) })
}
