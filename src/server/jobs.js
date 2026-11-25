// Background jobs, run inside the server process (started from instrumentation.js):
//  - every hour: delete leads (and CVs) older than the retention period
//  - once a day at 9 am IST: email each team member their due follow-ups
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { leads } from './db.js'
import { users } from './auth.js'
import { getOps, getSettings, saveSettings } from './settings.js'
import { uploadDir } from './leads.js'
import { digest, mailReady } from './mail.js'

export async function purgeOld() {
  const { retentionMonths } = await getOps(), months = Number(retentionMonths)
  if (!(months > 0)) return 0
  const cut = new Date(); cut.setMonth(cut.getMonth() - months)
  const c = await leads(), old = await c.find({ createdAt: { $lt: cut } }, { projection: { cv: 1 } }).toArray()
  for (const l of old) if (l.cv?.file) await unlink(join(uploadDir(), l.cv.file)).catch(() => {})
  if (old.length) await c.deleteMany({ _id: { $in: old.map(l => l._id) } })
  return old.length
}

const istDay = d => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
const istHour = d => Number(d.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }))
export async function sendDigests(now = new Date()) {
  if (!mailReady() || istHour(now) < 9) return
  const today = istDay(now), state = await getSettings('jobs', {})
  if (state.digest === today) return
  await saveSettings('jobs', { ...state, digest: today })
  const end = new Date(today + 'T23:59:59.999+05:30')
  const due = await (await leads()).find({ followUp: { $lte: end }, status: { $nin: ['won', 'lost'] }, assignee: { $nin: [null, ''] } }).toArray()
  const by = Object.groupBy(due, l => l.assignee)
  const team = await (await users()).find({ active: true }).toArray()
  for (const [u, list] of Object.entries(by)) {
    const p = team.find(x => x.username === u)
    if (p?.email) await digest(p.email, p.name || u, list)
  }
}

export function start() {
  if (globalThis.__azJobs) return
  const run = () => Promise.all([purgeOld(), sendDigests()]).catch(e => console.error('[jobs]', e.message))
  globalThis.__azJobs = setInterval(run, 15 * 6e4)
  setTimeout(run, 30e3)
}
