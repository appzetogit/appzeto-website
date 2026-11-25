// A lead's CV, only for a signed-in admin
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { leads } from '../../../../../src/server/db.js'
import { guard, scope } from '../../../../../src/server/auth.js'
import { oid, uploadDir } from '../../../../../src/server/leads.js'

export const dynamic = 'force-dynamic'
export async function GET(req, { params }) {
  const me = await guard(req); if (me instanceof Response) return me
  const _id = oid((await params).id), lead = _id && await (await leads()).findOne({ _id, ...scope(me) }, { projection: { cv: 1 } })
  if (!lead?.cv?.file || !/^[a-f0-9]{32}\.pdf$/.test(lead.cv.file)) return new Response('Not found', { status: 404 })
  try {
    const buf = await readFile(join(uploadDir(), lead.cv.file))
    return new Response(buf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${lead.cv.name.replace(/"/g, '')}"`, 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "sandbox" } })
  } catch { return new Response('File missing', { status: 404 }) }
}
