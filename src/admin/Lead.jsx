'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { KIND, STATUS, api, dateIST, dayIST, dayLabel, waNumber, when } from './api.js'
import { useMe } from './Shell.jsx'

function Event({ x, team }) {
  const who = x.by ? (team.find(t => t.u === x.by)?.name || x.by) : null
  const by = who ? <span className="adm-by"> · {who}</span> : null
  if (x.t === 'note') return <p>{x.text}{by}</p>
  if (x.again) return <p><b>Sent the form again</b></p>
  if ('assign' in x) return <p>{x.assign ? <>Assigned to <b>{x.assign}</b></> : 'Unassigned'}{by}</p>
  if ('follow' in x) return <p>{x.follow ? <>Follow-up set for <b>{dayLabel(x.follow + 'T10:00:00+05:30')}</b></> : 'Follow-up cleared'}{by}</p>
  return <p>{x.from ? <>Status <b>{STATUS[x.from]}</b> → <b>{STATUS[x.to]}</b></> : 'Lead received'}{by}</p>
}

export default function Lead() {
  const { id } = useParams(), router = useRouter(), me = useMe()
  const [l, setL] = useState(null), [err, setErr] = useState(''), [note, setNote] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { api(`/api/admin/leads/${id}`).then(setL).catch(e => setErr(e.message)) }, [id])
  const save = async body => { setBusy(true); setErr(''); try { setL(await api(`/api/admin/leads/${id}`, { method: 'PATCH', body })); if (body.note) setNote('') } catch (e) { setErr(e.message) } setBusy(false) }
  const del = async () => {
    if (!confirm(`Delete ${l.name}'s lead for good? This removes everything they sent${l.cv ? ', including the CV' : ''}, and can't be undone.`)) return
    try { await api(`/api/admin/leads/${id}`, { method: 'DELETE' }); router.replace('/admin/leads') } catch (e) { setErr(e.message) }
  }
  if (err && !l) return <><p className="adm-err">{err}</p><Link href="/admin/leads">Back to leads</Link></>
  if (!l) return <p className="adm-wait">Loading…</p>
  const src = l.source || {}, utm = src.utm || {}, team = me.team
  const events = [...(l.notes || []).map(n => ({ ...n, t: 'note' })), ...(l.history || [])].sort((a, b) => new Date(b.at) - new Date(a.at))
  return <>
    <Link className="adm-back" href="/admin/leads">← All leads</Link>
    <header className="adm-head"><div><h1>{l.name} {l.times > 1 && <span className="pill adm-times">Sent {l.times}×</span>}</h1><p className="adm-sub">{KIND[l.kind]} form · {l.product || 'No interest picked'} · {when(l.createdAt)}</p></div>
      <div className="adm-acts">{l.phone && <><a className="adm-btn" href={`tel:${l.phone.replace(/\s/g, '')}`}>Call</a><a className="adm-btn adm-btn-wa" href={`https://wa.me/${waNumber(l.phone)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></>}{l.email && <a className="adm-btn adm-btn-y" href={`mailto:${l.email}`}>Email</a>}</div></header>
    {err && <p className="adm-err">{err}</p>}
    <section className="adm-card"><h2>Status</h2>
      <div className="adm-steps" role="group" aria-label="Status">{Object.entries(STATUS).map(([k, v]) => <button key={k} className={`st-${k} ${l.status === k ? 'on' : ''}`} aria-pressed={l.status === k} disabled={busy} onClick={() => save({ status: k })}>{v}</button>)}</div>
      <div className="adm-owner">
        <label>Assigned to<select value={l.assignee || ''} disabled={busy} onChange={e => save({ assignee: e.target.value })}><option value="">Nobody yet</option>{me.env && <option value={me.user}>{me.name} (you)</option>}{team.map(t => <option key={t.u} value={t.u}>{t.name}{t.u === me.user ? ' (you)' : ''}</option>)}</select></label>
        <label>Follow up on<input type="date" value={dateIST(l.followUp)} disabled={busy} onChange={e => save({ followUp: e.target.value })} /></label>
        <div className="adm-quick">{[['Tomorrow', 1], ['In 3 days', 3], ['Next week', 7]].map(([t, n]) => <button key={t} className="adm-chip" disabled={busy} onClick={() => save({ followUp: dayIST(n) })}>{t}</button>)}{l.followUp && <button className="adm-link" disabled={busy} onClick={() => save({ followUp: '' })}>Clear</button>}</div>
      </div>
      {l.followUp && <p className={`adm-due ${dateIST(l.followUp) <= dayIST() && !['won', 'lost'].includes(l.status) ? 'late' : ''}`}>Follow-up: {dayLabel(l.followUp)}</p>}
    </section>
    <div className="adm-two">
      <section className="adm-card"><h2>What they sent{l.times > 1 && <small>latest</small>}</h2>
        <dl className="adm-dl">{Object.entries(l.fields || {}).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '–'}</dd></div>)}</dl>
        {l.cv && <a className="adm-btn adm-cv" href={`/api/admin/cv/${l._id}`} target="_blank" rel="noopener">Open CV · {l.cv.name} ({Math.round(l.cv.size / 1024)} KB)</a>}
        {l.submissions?.length > 0 && <details className="adm-earlier"><summary>Earlier messages ({l.submissions.length})</summary>{[...l.submissions].reverse().map((x, i) => <div key={i}><time>{when(x.at)}</time><dl className="adm-dl">{Object.entries(x.fields || {}).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '–'}</dd></div>)}</dl></div>)}</details>}
      </section>
      <section className="adm-card"><h2>Where it came from</h2>
        <dl className="adm-dl">
          <div><dt>Form on page</dt><dd>{src.page || '–'}</dd></div>
          <div><dt>First page visited</dt><dd>{src.landing || '–'}</dd></div>
          <div><dt>Came from</dt><dd>{src.referrer || 'Direct / unknown'}</dd></div>
          {Object.keys(utm).length > 0 && <div><dt>Campaign</dt><dd>{Object.entries(utm).map(([k, v]) => `${k}: ${v}`).join(' · ')}</dd></div>}
          <div><dt>Device</dt><dd>{src.device === 'phone' ? 'Phone' : 'Desktop'}</dd></div>
          <div><dt>Consent to be contacted</dt><dd>{l.consent?.at ? 'Yes, ' + when(l.consent.at) : 'Not recorded (sent before the tick-box)'}</dd></div>
        </dl>
      </section>
    </div>
    <section className="adm-card"><h2>Notes and history</h2>
      <form className="adm-note" onSubmit={e => { e.preventDefault(); if (note.trim()) save({ note }) }}><textarea rows="3" placeholder="Called, asked for a demo next week…" value={note} onChange={e => setNote(e.target.value)} aria-label="New note" /><button className="adm-btn" disabled={busy || !note.trim()}>Add note</button></form>
      <ul className="adm-tl">{events.map((x, i) => <li key={i} className={x.t === 'note' ? 'note' : ''}><time>{when(x.at)}</time><Event x={x} team={[...me.team, { u: me.user, name: me.name }]} /></li>)}</ul>
    </section>
    {me.role === 'owner' && <section className="adm-card adm-danger"><h2>Delete this lead</h2><p>For when someone asks you to remove their details. It deletes everything they sent{l.cv ? ', including the CV,' : ''} for good.</p><button className="adm-btn adm-btn-red" onClick={del}>Delete lead</button></section>}
  </>
}
