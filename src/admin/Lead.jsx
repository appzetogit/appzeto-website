'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { KIND, STATUS, api, waNumber, when } from './api.js'

export default function Lead() {
  const { id } = useParams(), [l, setL] = useState(null), [err, setErr] = useState(''), [note, setNote] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { api(`/api/admin/leads/${id}`).then(setL).catch(e => setErr(e.message)) }, [id])
  const save = async body => { setBusy(true); setErr(''); try { setL(await api(`/api/admin/leads/${id}`, { method: 'PATCH', body })); if (body.note) setNote('') } catch (e) { setErr(e.message) } setBusy(false) }
  if (err && !l) return <><p className="adm-err">{err}</p><Link href="/admin/leads">Back to leads</Link></>
  if (!l) return <p className="adm-wait">Loading…</p>
  const src = l.source || {}, utm = src.utm || {}
  return <>
    <Link className="adm-back" href="/admin/leads">← All leads</Link>
    <header className="adm-head"><div><h1>{l.name}</h1><p className="adm-sub">{KIND[l.kind]} form · {l.product || 'No interest picked'} · {when(l.createdAt)}</p></div>
      <div className="adm-acts">{l.phone && <><a className="adm-btn" href={`tel:${l.phone.replace(/\s/g, '')}`}>Call</a><a className="adm-btn adm-btn-wa" href={`https://wa.me/${waNumber(l.phone)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></>}{l.email && <a className="adm-btn adm-btn-y" href={`mailto:${l.email}`}>Email</a>}</div></header>
    {err && <p className="adm-err">{err}</p>}
    <section className="adm-card"><h2>Status</h2>
      <div className="adm-steps" role="group" aria-label="Status">{Object.entries(STATUS).map(([k, v]) => <button key={k} className={`st-${k} ${l.status === k ? 'on' : ''}`} aria-pressed={l.status === k} disabled={busy} onClick={() => save({ status: k })}>{v}</button>)}</div>
    </section>
    <div className="adm-two">
      <section className="adm-card"><h2>What they sent</h2>
        <dl className="adm-dl">{Object.entries(l.fields || {}).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '–'}</dd></div>)}</dl>
        {l.cv && <a className="adm-btn adm-cv" href={`/api/admin/cv/${l._id}`} target="_blank" rel="noopener">Open CV · {l.cv.name} ({Math.round(l.cv.size / 1024)} KB)</a>}
      </section>
      <section className="adm-card"><h2>Where it came from</h2>
        <dl className="adm-dl">
          <div><dt>Form on page</dt><dd>{src.page || '–'}</dd></div>
          <div><dt>First page visited</dt><dd>{src.landing || '–'}</dd></div>
          <div><dt>Came from</dt><dd>{src.referrer || 'Direct / unknown'}</dd></div>
          {Object.keys(utm).length > 0 && <div><dt>Campaign</dt><dd>{Object.entries(utm).map(([k, v]) => `${k}: ${v}`).join(' · ')}</dd></div>}
          <div><dt>Device</dt><dd>{src.device === 'phone' ? 'Phone' : 'Desktop'}</dd></div>
        </dl>
      </section>
    </div>
    <section className="adm-card"><h2>Notes</h2>
      <form className="adm-note" onSubmit={e => { e.preventDefault(); if (note.trim()) save({ note }) }}><textarea rows="3" placeholder="Called, asked for a demo next week…" value={note} onChange={e => setNote(e.target.value)} aria-label="New note" /><button className="adm-btn" disabled={busy || !note.trim()}>Add note</button></form>
      <ul className="adm-tl">{[...(l.notes || []).map(n => ({ ...n, t: 'note' })), ...(l.history || []).map(h => ({ ...h, t: 'status' }))].sort((a, b) => new Date(b.at) - new Date(a.at)).map((x, i) => <li key={i} className={x.t}><time>{when(x.at)}</time>{x.t === 'note' ? <p>{x.text}</p> : <p>{x.from ? <>Status <b>{STATUS[x.from]}</b> → <b>{STATUS[x.to]}</b></> : 'Lead received'}</p>}</li>)}</ul>
    </section>
  </>
}
