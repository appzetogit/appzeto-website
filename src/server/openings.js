// Job openings shown on the Careers page, managed from the admin (owner and HR).
import { ObjectId } from 'mongodb'
import { db } from './db.js'

export const openings = async () => (await db()).collection('openings')
export const TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']
export const canEdit = me => me.role === 'owner' || me.role === 'hr'
export const toId = id => { try { return new ObjectId(String(id)) } catch { return null } }

const text = (v, n = 200) => String(v ?? '').trim().slice(0, n)
const lines = (v, n = 20) => (Array.isArray(v) ? v : String(v ?? '').split('\n')).map(x => text(x, 300).replace(/^[-•*]\s*/, '')).filter(Boolean).slice(0, n)
const list = v => (Array.isArray(v) ? v : String(v ?? '').split(',')).map(x => text(x, 40)).filter(Boolean).slice(0, 15)

// Whatever the admin sends, in the shape we store. Returns { error } when something required is missing.
export function clean(b) {
  const o = {
    title: text(b.title, 90), department: text(b.department, 60), type: TYPES.includes(b.type) ? b.type : 'Full-time',
    experience: text(b.experience, 40), location: text(b.location, 60), salary: text(b.salary, 60), openings: Math.max(1, Math.min(99, Number(b.openings) || 1)),
    skills: list(b.skills), summary: text(b.summary, 600), responsibilities: lines(b.responsibilities), requirements: lines(b.requirements),
    open: b.open !== false,
  }
  if (!o.title) return { error: 'Add a job title' }
  if (!o.location) o.location = 'Indore'
  return { value: o }
}

// What the public page needs, oldest-first within newest-first ordering kept by createdAt
export const forPage = o => ({ id: String(o._id), title: o.title, department: o.department, type: o.type, experience: o.experience, location: o.location, salary: o.salary, openings: o.openings, skills: o.skills || [], summary: o.summary, responsibilities: o.responsibilities || [], requirements: o.requirements || [], posted: o.createdAt })
export async function openList() {
  try { return (await (await openings()).find({ open: true }).sort({ createdAt: -1 }).toArray()).map(forPage) } catch { return [] }
}
