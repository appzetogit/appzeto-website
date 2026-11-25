// Shared lead logic: what a lead looks like, filters, CSV.
import { ObjectId } from 'mongodb'
import { join } from 'node:path'

// CVs live outside the public folder and are only served through the admin API
export const uploadDir = () => process.env.UPLOAD_DIR || join(process.cwd(), '.data', 'uploads')

export const KINDS = { idea: 'Idea', career: 'Careers', partner: 'Partner' }
export const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']

const pick = (f, ...keys) => { for (const k of keys) if (f[k]) return f[k]; return '' }
// Pull the common columns out of whatever the form sent; the raw answers stay in `fields`
export function summarise(kind, f) {
  return {
    name: pick(f, 'Your name', 'Contact person'),
    phone: pick(f, 'Phone'),
    email: pick(f, 'Email', 'Company email'),
    company: pick(f, 'Company'),
    product: kind === 'idea' ? pick(f, 'About') : kind === 'career' ? pick(f, 'I’m interested in') : pick(f, 'What you do'),
    message: pick(f, 'Your idea', 'About you', 'Message'),
  }
}

export const oid = id => { try { return new ObjectId(String(id)) } catch { return null } }
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Filters shared by the list and the export: q, kind, status, product, from, to (YYYY-MM-DD)
export function filterFrom(sp) {
  const q = {}
  const kind = sp.get('kind'), status = sp.get('status'), product = sp.get('product'), from = sp.get('from'), to = sp.get('to'), text = sp.get('q')?.trim()
  if (kind && KINDS[kind]) q.kind = kind
  if (status && STATUSES.includes(status)) q.status = status
  if (product) q.product = product
  if (from || to) { q.createdAt = {}; if (from) q.createdAt.$gte = new Date(from + 'T00:00:00+05:30'); if (to) q.createdAt.$lte = new Date(to + 'T23:59:59.999+05:30') }
  if (text) { const r = new RegExp(esc(text.slice(0, 80)), 'i'); q.$or = ['name', 'phone', 'email', 'company', 'message', 'product'].map(k => ({ [k]: r })) }
  return q
}

// CSV safe for Excel: quotes escaped, formulas neutralised
export function toCsv(rows) {
  const cell = v => { let s = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"' }
  return '﻿' + rows.map(r => r.map(cell).join(',')).join('\r\n')
}
