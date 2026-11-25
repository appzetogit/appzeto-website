// Outgoing email. Off until SMTP is set in env:
//   SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER, SMTP_PASS, MAIL_FROM ("Appzeto <hello@appzeto.com>")
// Failures are logged, never thrown: a lead is saved whether or not the email goes out.
import nodemailer from 'nodemailer'
import { KINDS } from './leads.js'

export const mailReady = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM)
let tx
const transport = () => tx ??= nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })

export async function send({ to, subject, text, html, replyTo }) {
  const list = [to].flat().filter(Boolean)
  if (!mailReady() || !list.length) return false
  try { await transport().sendMail({ from: process.env.MAIL_FROM, to: list.join(', '), subject, text, html, replyTo }); return true }
  catch (e) { console.error('[mail]', e.message); return false }
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const site = () => process.env.SITE_URL || 'https://appzeto.buytogetherindia.com'
const wrap = (title, body) => `<div style="font:15px/1.55 Arial,sans-serif;color:#06282A;max-width:560px"><div style="background:#06282A;color:#FAFD0F;padding:14px 18px;border-radius:10px 10px 0 0;font-weight:bold">${esc(title)}</div><div style="border:2px solid #06282A;border-top:0;border-radius:0 0 10px 10px;padding:18px">${body}</div></div>`

// To the team: a new lead (or a repeat from someone already in the inbox)
export function leadAlert(to, lead, { repeat } = {}) {
  const rows = Object.entries(lead.fields || {}).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#2B5254;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')
  const link = `${site()}/admin/leads/${lead._id}`
  const title = `${repeat ? 'Again: ' : 'New lead: '}${lead.name} (${KINDS[lead.kind]}${lead.product ? ', ' + lead.product : ''})`
  return send({ to, subject: title, replyTo: lead.email || undefined,
    text: `${title}\n\n${Object.entries(lead.fields || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nOpen: ${link}`,
    html: wrap(title, `<table>${rows}</table>${lead.cv ? '<p>A CV is attached in the admin.</p>' : ''}<p><a href="${link}" style="background:#06A4A5;color:#06282A;padding:10px 16px;border-radius:8px;font-weight:bold;text-decoration:none">Open in admin</a></p>`) })
}

// To the visitor, if they left an email
export function autoReply(lead, phone) {
  if (!lead.email) return false
  const first = String(lead.name || '').split(' ')[0] || 'there'
  const what = lead.kind === 'career' ? 'your application' : lead.kind === 'partner' ? 'your partner request' : 'your idea'
  const text = `Hi ${first},\n\nThanks for sending ${what} to Appzeto. We've got it, and someone from our team will call or write back within one working day.\n\nIf it's urgent, ${phone ? `call ${phone} or ` : ''}reply to this email.\n\nAppzeto`
  return send({ to: lead.email, subject: `We got ${what}`, text, html: wrap('Appzeto', esc(text).replace(/\n/g, '<br>')) })
}

// To each team member at 9 am: their follow-ups due today or overdue
export function digest(to, name, leads) {
  const list = leads.map(l => `<li><a href="${site()}/admin/leads/${l._id}">${esc(l.name)}</a> · ${esc(l.product || KINDS[l.kind])} · ${esc(l.phone || l.email)}</li>`).join('')
  return send({ to, subject: `${leads.length} follow-up${leads.length > 1 ? 's' : ''} for today`,
    text: `Hi ${name},\n\nFollow-ups due:\n${leads.map(l => `- ${l.name} (${l.phone || l.email}) ${site()}/admin/leads/${l._id}`).join('\n')}`,
    html: wrap('Follow-ups for today', `<p>Hi ${esc(name)}, these are due:</p><ul>${list}</ul>`) })
}
