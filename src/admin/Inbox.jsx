'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { KIND, KINDS_PL, STATUS, TypeTag, ago, api, dayLabel, dateIST, dayIST, when } from './api.js'
import { useMe } from './Shell.jsx'

const KEYS = ['q', 'kind', 'status', 'product', 'from', 'to', 'who', 'due']
export default function Inbox() {
  const sp = useSearchParams(), router = useRouter(), path = usePathname(), me = useMe(), name = u => u === me.user ? 'You' : me.team.find(t => t.u === u)?.name || u
  const [data, setData] = useState(null), [err, setErr] = useState(''), [q, setQ] = useState(sp.get('q') || '')
  const qs = sp.toString()
  useEffect(() => { setErr(''); api('/api/admin/leads?' + qs).then(setData).catch(e => setErr(e.message)) }, [qs])
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); router.replace(`${path}?${n}`) }
  useEffect(() => { const t = setTimeout(() => { if (q !== (sp.get('q') || '')) set('q', q) }, 350); return () => clearTimeout(t) }, [q])
  const filtered = KEYS.some(k => sp.get(k)), exp = '/api/admin/export?' + new URLSearchParams([...sp].filter(([k]) => KEYS.includes(k)))
  return <>
    <header className="adm-head"><h1>{KINDS_PL[sp.get('kind')] || 'All leads'} {data && <small>{data.total}</small>}</h1><a className="adm-btn adm-btn-y" href={exp}>Export CSV</a></header>
    {me.kinds.length > 1 && <nav className="adm-tabs" aria-label="Lead type">{[['', 'All leads'], ...me.kinds.map(k => [k, KINDS_PL[k]])].map(([k, t]) => { const c = k ? data?.kinds?.[k] : data && Object.values(data.kinds || {}).reduce((a, x) => ({ n: a.n + x.n, unseen: a.unseen + x.unseen }), { n: 0, unseen: 0 }); return <button key={k || 'all'} className={`adm-tab ${k ? 'ty-' + k : 'ty-all'} ${(sp.get('kind') || '') === k ? 'on' : ''}`} aria-pressed={(sp.get('kind') || '') === k} onClick={() => set('kind', k)}><b>{t}</b>{c && <span>{c.n}{c.unseen > 0 && <i>{c.unseen} new</i>}</span>}</button> })}</nav>}
    <div className="adm-card adm-filters">
      <input type="search" placeholder="Search name, phone, email, message" value={q} onChange={e => setQ(e.target.value)} aria-label="Search leads" />
      <select value={sp.get('who') || ''} onChange={e => set('who', e.target.value)} aria-label="Assigned to"><option value="">Anyone</option><option value="me">Assigned to me</option><option value="none">Not assigned</option>{me.team.filter(t => t.u !== me.user).map(t => <option key={t.u} value={t.u}>{t.name}</option>)}</select>
      <label className="adm-check"><input type="checkbox" checked={!!sp.get('due')} onChange={e => set('due', e.target.checked ? '1' : '')} />Follow-ups due</label>
      <select value={sp.get('status') || ''} onChange={e => set('status', e.target.value)} aria-label="Status"><option value="">All statuses</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select value={sp.get('product') || ''} onChange={e => set('product', e.target.value)} aria-label="Interest"><option value="">Any interest</option>{data?.products.map(p => <option key={p}>{p}</option>)}</select>
      <label>From<input type="date" value={sp.get('from') || ''} onChange={e => set('from', e.target.value)} /></label>
      <label>To<input type="date" value={sp.get('to') || ''} onChange={e => set('to', e.target.value)} /></label>
      {filtered && <button className="adm-link" onClick={() => { setQ(''); router.replace(path) }}>Clear</button>}
    </div>
    {err && <p className="adm-err">{err}</p>}
    {!data ? <p className="adm-wait">Loading…</p> : !data.items.length ? <p className="adm-card adm-empty">{filtered ? 'No leads match these filters.' : 'No leads yet. They’ll appear here as soon as someone sends a form on the website.'}</p> :
      <div className="adm-card adm-table-wrap"><table className="adm-table">
        <thead><tr><th>Received</th><th>Type</th><th>Name</th><th>Contact</th><th>Interest</th><th>Status</th><th>Owner</th><th>Follow up</th></tr></thead>
        <tbody>{data.items.map(l => <tr key={l._id} className={`row-${l.kind} ${l.seen ? '' : 'unseen'}`} onClick={() => router.push(`/admin/leads/${l._id}`)}>
          <td title={when(l.createdAt)}>{!l.seen && <i className="adm-dot" />}{ago(l.createdAt)}</td><td><TypeTag k={l.kind} /></td>
          <td><Link href={`/admin/leads/${l._id}`} onClick={e => e.stopPropagation()}><b>{l.name}</b></Link>{l.times > 1 && <em className="pill adm-times">{l.times}×</em>}{l.company && <small>{l.company}</small>}</td>
          <td>{l.phone}{l.email && <small>{l.email}</small>}</td><td>{l.product || <small>–</small>}</td>
          <td><em className={`pill st-${l.status}`}>{STATUS[l.status]}</em></td><td>{l.assignee ? name(l.assignee) : <small>–</small>}</td><td className={l.followUp && dateIST(l.followUp) <= dayIST() && !['won', 'lost'].includes(l.status) ? 'adm-late' : ''}>{dayLabel(l.followUp) || <small>–</small>}</td></tr>)}</tbody>
      </table></div>}
    {data?.pages > 1 && <nav className="adm-pages">{data.page > 1 && <button className="adm-link" onClick={() => set('page', data.page - 1)}>← Newer</button>}<span>Page {data.page} of {data.pages}</span>{data.page < data.pages && <button className="adm-link" onClick={() => set('page', data.page + 1)}>Older →</button>}</nav>}
  </>
}
