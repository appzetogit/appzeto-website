'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { KIND, STATUS, ago, api, dayLabel } from './api.js'
import { useMe } from './Shell.jsx'

const Bars = ({ list, label = x => x._id, href }) => {
  const max = Math.max(1, ...list.map(x => x.n))
  return list.length ? <ul className="adm-bars">{list.map(x => <li key={String(x._id)}>{href ? <Link href={href(x)}>{label(x)}</Link> : <span>{label(x)}</span>}<i style={{ '--w': x.n / max }} /><b>{x.n}</b></li>)}</ul> : <p className="adm-empty">Nothing yet.</p>
}

export default function Dashboard() {
  const me = useMe(), [s, setS] = useState(null), [recent, setRecent] = useState([]), [err, setErr] = useState('')
  useEffect(() => { Promise.all([api('/api/admin/stats'), api('/api/admin/leads')]).then(([a, b]) => { setS(a); setRecent(b.items.slice(0, 6)) }).catch(e => setErr(e.message)) }, [])
  if (err) return <p className="adm-err">{err}</p>
  if (!s) return <p className="adm-wait">Loading…</p>
  const max = Math.max(1, ...s.days.map(d => d.n)), open = (s.status.new || 0) + (s.status.contacted || 0) + (s.status.qualified || 0)
  return <>
    <header className="adm-head"><h1>Dashboard</h1><Link className="adm-btn" href="/admin/leads?status=new">See new leads</Link></header>
    <div className="adm-kpis">
      <div className="adm-card k-y"><b>{s.unseen}</b><span>Unread</span></div>
      <div className="adm-card"><b>{s.week}</b><span>Last 7 days · {s.total} in all</span></div>
      <Link href="/admin/leads?due=1" className="adm-card k-o"><b>{s.due.length}</b><span>Follow-ups due</span></Link>
      <Link href="/admin/leads?who=none" className="adm-card"><b>{s.unassigned}</b><span>Not assigned</span></Link>
      <div className="adm-card k-g"><b>{s.winRate == null ? '–' : s.winRate + '%'}</b><span>Won of closed</span></div>
    </div>
    {s.due.length > 0 && <section className="adm-card"><h2>Follow up today <small>{me.role === 'owner' ? 'everyone' : 'yours'}</small></h2><ul className="adm-recent">{s.due.map(l => <li key={l._id}><Link href={`/admin/leads/${l._id}`}><i className="adm-dot" /><b>{l.name}</b><span>{l.product || KIND[l.kind]}</span><em className="pill st-new">{dayLabel(l.followUp)}</em><time>{l.phone}</time></Link></li>)}</ul></section>}
    <section className="adm-card">
      <h2>Leads per day <small>last 30 days</small></h2>
      <div className="adm-chart" role="img" aria-label={`Leads per day, highest ${max}`}>{s.days.map(d => <span key={d.day} title={`${d.day}: ${d.n}`} style={{ '--h': d.n / max }}><i /></span>)}</div>
      <div className="adm-chart-x"><span>{s.days[0].day.slice(5)}</span><span>Today</span></div>
    </section>
    <section className="adm-card"><h2>Pipeline <small>{open} open</small></h2>
      <div className="adm-pipe">{Object.keys(STATUS).map(k => <Link key={k} href={`/admin/leads?status=${k}`} className={`st-${k}`}><b>{s.status[k] || 0}</b><span>{STATUS[k]}</span></Link>)}</div>
    </section>
    <div className="adm-two">
      <section className="adm-card"><h2>What people ask about</h2><Bars list={s.byProduct} href={x => `/admin/leads?product=${encodeURIComponent(x._id)}`} /></section>
      <section className="adm-card"><h2>Which form</h2><Bars list={s.byKind} label={x => KIND[x._id] || x._id} href={x => `/admin/leads?kind=${x._id}`} /></section>
      <section className="adm-card"><h2>Pages that bring leads</h2><Bars list={s.byPage} /></section>
      <section className="adm-card"><h2>Device</h2><Bars list={s.byDevice} label={x => x._id === 'phone' ? 'Phone' : 'Desktop'} /></section>
    </div>
    <section className="adm-card"><h2>Latest</h2>
      {recent.length ? <ul className="adm-recent">{recent.map(l => <li key={l._id}><Link href={`/admin/leads/${l._id}`}>{!l.seen && <i className="adm-dot" />}<b>{l.name}</b><span>{l.product || KIND[l.kind]}</span><em className={`pill st-${l.status}`}>{STATUS[l.status]}</em><time>{ago(l.createdAt)}</time></Link></li>)}</ul> : <p className="adm-empty">No leads yet. They’ll appear here as soon as someone sends a form on the website.</p>}
    </section>
  </>
}
