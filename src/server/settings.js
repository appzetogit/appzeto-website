// Settings stored in MongoDB (`settings` collection, one doc per key), falling back to
// the defaults in src/settings.js. Used by the site (contact details) and the admin (alerts, privacy).
import defaults from '../settings.js'
import { db } from './db.js'

export const SITE_DEFAULTS = { email: defaults.email, phones: defaults.phones.map(p => p.label), whatsapp: defaults.whatsapp || '', address: defaults.address }
export const OPS_DEFAULTS = { alertEmails: [], autoReply: true, retentionMonths: 24 }

const col = async () => (await db()).collection('settings')
export async function getSettings(key, base) {
  try { const d = await (await col()).findOne({ _id: key }); return { ...base, ...(d?.value || {}) } } catch { return { ...base } }
}
export async function saveSettings(key, value) {
  await (await col()).updateOne({ _id: key }, { $set: { value, updatedAt: new Date() } }, { upsert: true })
}
export const getSite = () => getSettings('site', SITE_DEFAULTS)
export const getOps = () => getSettings('ops', OPS_DEFAULTS)

// Contact details in the shape the site components use
export function siteForPages(x) {
  const tel = l => 'tel:+' + String(l).replace(/\D/g, '').replace(/^(?=\d{10}$)/, '91')
  return { ...defaults, email: x.email, phones: x.phones.filter(Boolean).map(label => ({ label, href: tel(label) })), whatsapp: String(x.whatsapp || '').replace(/\D/g, '') || null, address: x.address }
}
