// CSV of the leads matching the current filters
import { leads } from '../../../../src/server/db.js'
import { guard } from '../../../../src/server/auth.js'
import { KINDS, filterFrom, toCsv } from '../../../../src/server/leads.js'

export const dynamic = 'force-dynamic'
export async function GET(req) {
  const no = guard(req); if (no) return no
  const list = await (await leads()).find(filterFrom(req.nextUrl.searchParams)).sort({ createdAt: -1 }).limit(20000).toArray()
  const ist = d => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const rows = [['Received (IST)', 'Form', 'Status', 'Name', 'Phone', 'Email', 'Company', 'Interest', 'Message', 'Page', 'Source', 'Campaign', 'Device', 'Notes']]
  for (const l of list) rows.push([ist(l.createdAt), KINDS[l.kind], l.status, l.name, l.phone, l.email, l.company, l.product, l.message, l.source?.page, l.source?.utm?.source || l.source?.referrer, l.source?.utm?.campaign, l.source?.device, (l.notes || []).map(n => n.text).join(' | ')])
  const day = new Date().toISOString().slice(0, 10)
  return new Response(toCsv(rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="appzeto-leads-${day}.csv"` } })
}
