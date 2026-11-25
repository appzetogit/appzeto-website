// Owner settings: the website's contact details, alert emails, auto-reply, how long leads are kept
import { revalidatePath } from 'next/cache'
import { guard } from '../../../../src/server/auth.js'
import { getOps, getSite, saveSettings } from '../../../../src/server/settings.js'
import { mailReady, send } from '../../../../src/server/mail.js'

export const dynamic = 'force-dynamic'
const isEmail = e => /^\S+@\S+\.\S+$/.test(e)

export async function GET(req) {
  const me = await guard(req, { owner: true }); if (me instanceof Response) return me
  const [site, ops] = await Promise.all([getSite(), getOps()])
  return Response.json({ site, ops, mail: mailReady() })
}

export async function PUT(req) {
  const me = await guard(req, { write: true, owner: true }); if (me instanceof Response) return me
  let b = {}
  try { b = await req.json() } catch {}
  const s = b.site || {}, o = b.ops || {}
  const site = { email: String(s.email || '').trim(), phones: [s.phones].flat().map(p => String(p || '').trim()).filter(Boolean).slice(0, 3), whatsapp: String(s.whatsapp || '').replace(/\D/g, ''), address: String(s.address || '').trim().slice(0, 300) }
  if (!isEmail(site.email)) return Response.json({ error: 'The website email doesn’t look right.' }, { status: 400 })
  if (!site.phones.length) return Response.json({ error: 'Add at least one phone number.' }, { status: 400 })
  const alertEmails = [o.alertEmails].flat().join(',').split(/[,\s]+/).map(e => e.trim()).filter(Boolean)
  if (alertEmails.some(e => !isEmail(e))) return Response.json({ error: 'One of the alert emails doesn’t look right.' }, { status: 400 })
  const ops = { alertEmails: alertEmails.slice(0, 10), autoReply: !!o.autoReply, retentionMonths: Math.max(0, Math.min(120, Number(o.retentionMonths) || 0)) }
  await Promise.all([saveSettings('site', site), saveSettings('ops', ops)])
  revalidatePath('/', 'layout') // pages pick up the new contact details
  return Response.json({ ok: true, site, ops })
}

// Send a test email to the alert list
export async function POST(req) {
  const me = await guard(req, { write: true, owner: true }); if (me instanceof Response) return me
  if (!mailReady()) return Response.json({ error: 'Email isn’t set up on the server yet.' }, { status: 400 })
  const { alertEmails } = await getOps()
  if (!alertEmails.length) return Response.json({ error: 'Add an alert email first, then save.' }, { status: 400 })
  const ok = await send({ to: alertEmails, subject: 'Appzeto admin: test email', text: 'Lead alerts from the website will arrive like this.' })
  return ok ? Response.json({ ok: true }) : Response.json({ error: 'The mail server refused it. Check the SMTP settings.' }, { status: 502 })
}
