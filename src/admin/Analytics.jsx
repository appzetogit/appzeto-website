'use client'
import { useEffect, useState } from 'react'
import { api } from './api.js'

const fmtTime = s => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
const pct = (a, b) => b ? Math.round(a / b * 100) : 0
function Delta({ now, prev }) {
  if (!prev) return <i className="an-d">new</i>
  const d = Math.round((now - prev) / prev * 100)
  return <i className={`an-d ${d > 0 ? 'up' : d < 0 ? 'down' : ''}`}>{d > 0 ? '▲' : d < 0 ? '▼' : '•'} {Math.abs(d)}% vs before</i>
}
const List = ({ rows, cols, empty = 'Nothing yet.' }) => {
  if (!rows.length) return <p className="adm-empty">{empty}</p>
  const max = Math.max(1, ...rows.map(r => r[cols[0].k]))
  return <table className="an-list"><thead><tr><th>{cols.label}</th>{cols.map(c => <th key={c.k}>{c.t}</th>)}</tr></thead>
    <tbody>{rows.map(r => <tr key={r.name || r.path}><td><span className="an-bar" style={{ '--w': r[cols[0].k] / max }} /><span className="an-name">{r.name || r.path}</span></td>{cols.map(c => <td key={c.k}>{c.f ? c.f(r[c.k]) : r[c.k]}</td>)}</tr>)}</tbody></table>
}

export default function Analytics() {
  const [days, setDays] = useState(30), [d, setD] = useState(null), [err, setErr] = useState('')
  useEffect(() => {
    let stop = false
    const load = () => api('/api/admin/analytics?days=' + days).then(x => { if (!stop) setD(x) }).catch(e => setErr(e.message))
    load(); const t = setInterval(load, 30000)
    return () => { stop = true; clearInterval(t) }
  }, [days])
  if (err && !d) return <p className="adm-err">{err}</p>
  if (!d) return <p className="adm-wait">Loading…</p>
  const max = Math.max(1, ...d.series.map(x => x.views)), f = d.funnel, c = d.clicks
  return <>
    <header className="adm-head"><div><h1>Analytics</h1><p className="adm-sub">Visits to the website. No cookies; a visitor is counted once per day.</p></div>
      <div className="an-range" role="group" aria-label="Period">{[7, 30, 90].map(n => <button key={n} className={days === n ? 'on' : ''} aria-pressed={days === n} onClick={() => { setD(null); setDays(n) }}>{n} days</button>)}</div></header>

    <div className="adm-kpis">
      <div className="adm-card an-live"><b><i className="an-pulse" />{d.live.n}</b><span>On the site now</span><small>{d.live.pages.slice(0, 3).map(p => `${p.path} (${p.n})`).join(' · ') || 'Nobody right now'}</small></div>
      <div className="adm-card k-y"><b>{d.visitors}</b><span>Visitors</span><Delta now={d.visitors} prev={d.prevVisitors} /></div>
      <div className="adm-card"><b>{d.views}</b><span>Page views</span><Delta now={d.views} prev={d.prevViews} /></div>
      <div className="adm-card"><b>{fmtTime(d.avgTime)}</b><span>Average time on a page</span></div>
      <div className="adm-card k-g"><b>{d.leads}</b><span>Leads</span>{d.visitors > 0 && pct(d.leads, d.visitors) <= 100 && <small>{pct(d.leads, d.visitors)}% of visitors</small>}</div>
    </div>

    <section className="adm-card"><h2>Visitors per day <small>last {d.days} days</small></h2>
      <div className="adm-chart an-chart" role="img" aria-label={`Page views per day, highest ${max}`}>{d.series.map(x => <span key={x.day} title={`${x.day}: ${x.visitors} visitors, ${x.views} views`}><i className="v" style={{ '--h': x.views / max }} /><i className="p" style={{ '--h': x.visitors / max }} /></span>)}</div>
      <div className="adm-chart-x"><span>{d.series[0].day.slice(5)}</span><span className="an-key"><i className="p" />Visitors <i className="v" />Page views</span><span>Today</span></div>
    </section>

    <section className="adm-card"><h2>From visit to lead</h2>
      <div className="an-funnel">{[['Visited', f.visitors], ['Started a form', f.started], ['Sent a form', f.sent]].map(([t, n], i) => <div key={t} style={{ '--w': n / Math.max(1, f.visitors) }}><b>{n}</b><span>{t}</span>{i > 0 && <small>{pct(n, i === 1 ? f.visitors : f.started)}% of the step before</small>}</div>)}</div>
    </section>

    <div className="adm-two">
      <section className="adm-card"><h2>Where visitors come from</h2><List rows={d.sources} cols={Object.assign([{ k: 'visitors', t: 'Visitors' }, { k: 'leads', t: 'Leads' }], { label: 'Source' })} /></section>
      <section className="adm-card"><h2>Buttons people press</h2>
        <ul className="an-clicks">{[['cta', 'Tell us your idea / demo'], ['whatsapp', 'WhatsApp'], ['call', 'Call'], ['email', 'Email']].map(([k, t]) => <li key={k} className={`an-c-${k}`}><b>{c[k] || 0}</b><span>{t}</span></li>)}</ul></section>
    </div>

    <section className="adm-card"><h2>Pages</h2><List rows={d.pages} cols={Object.assign([{ k: 'visitors', t: 'Visitors' }, { k: 'views', t: 'Views' }, { k: 'time', t: 'Avg time', f: fmtTime }, { k: 'depth', t: 'Scrolled', f: v => v + '%' }], { label: 'Page' })} /></section>

    <div className="adm-two">
      <section className="adm-card"><h2>Product interest <small>page views and hero taps</small></h2><List rows={d.products} cols={Object.assign([{ k: 'views', t: 'Page views' }, { k: 'taps', t: 'Hero taps' }], { label: 'Product' })} /></section>
      <section className="adm-card"><h2>Devices</h2><List rows={d.devices} cols={Object.assign([{ k: 'n', t: 'Visitors' }], { label: 'Device' })} />
        <h2 className="an-h2">Browsers</h2><List rows={d.browsers} cols={Object.assign([{ k: 'n', t: 'Visitors' }], { label: 'Browser' })} /></section>
    </div>
    <section className="adm-card"><h2>Regions <small>from the visitor’s timezone</small></h2><List rows={d.regions} cols={Object.assign([{ k: 'n', t: 'Visitors' }], { label: 'Region' })} /></section>
  </>
}
