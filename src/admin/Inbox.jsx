'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { KIND, STATUS, ago, api, when } from './api.js'

const KEYS = ['q', 'kind', 'status', 'product', 'from', 'to']
export default function Inbox() {
  const sp = useSearchParams(), router = useRouter(), path = usePathname()
  const [data, setData] = useState(null), [err, setErr] = useState(''), [q, setQ] = useState(sp.get('q') || '')
  const qs = sp.toString()
  useEffect(() => { setErr(''); api('/api/admin/leads?' + qs).then(setData).catch(e => setErr(e.message)) }, [qs])
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); router.replace(`${path}?${n}`) }
  useEffect(() => { const t = setTimeout(() => { if (q !== (sp.get('q') || '')) set('q', q) }, 350); return () => clearTimeout(t) }, [q])
  const filtered = KEYS.some(k => sp.get(k)), exp = '/api/admin/export?' + new URLSearchParams([...sp].filter(([k]) => KEYS.includes(k)))
  return <>
    <header className="adm-head"><h1>Leads {data && <small>{data.total}</small>}</h1><a className="adm-btn adm-btn-y" href={exp}>Export CSV</a></header>
    <div className="adm-card adm-filters">
      <input type="search" placeholder="Search name, phone, email, message" value={q} onChange={e => setQ(e.target.value)} aria-label="Search leads" />
      <select value={sp.get('kind') || ''} onChange={e => set('kind', e.target.value)} aria-label="Form"><option value="">All forms</option>{Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select value={sp.get('status') || ''} onChange={e => set('status', e.target.value)} aria-label="Status"><option value="">All statuses</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select value={sp.get('product') || ''} onChange={e => set('product', e.target.value)} aria-label="Interest"><option value="">Any interest</option>{data?.products.map(p => <option key={p}>{p}</option>)}</select>
      <label>From<input type="date" value={sp.get('from') || ''} onChange={e => set('from', e.target.value)} /></label>
      <label>To<input type="date" value={sp.get('to') || ''} onChange={e => set('to', e.target.value)} /></label>
      {filtered && <button className="adm-link" onClick={() => { setQ(''); router.replace(path) }}>Clear</button>}
    </div>
    {err && <p className="adm-err">{err}</p>}
    {!data ? <p className="adm-wait">Loading…</p> : !data.items.length ? <p className="adm-card adm-empty">{filtered ? 'No leads match these filters.' : 'No leads yet. They’ll appear here as soon as someone sends a form on the website.'}</p> :
      <div className="adm-card adm-table-wrap"><table className="adm-table">
        <thead><tr><th>Received</th><th>Name</th><th>Contact</th><th>Form</th><th>Interest</th><th>Status</th><th>Page</th></tr></thead>
        <tbody>{data.items.map(l => <tr key={l._id} className={l.seen ? '' : 'unseen'} onClick={() => router.push(`/admin/leads/${l._id}`)}>
          <td title={when(l.createdAt)}>{!l.seen && <i className="adm-dot" />}{ago(l.createdAt)}</td>
          <td><Link href={`/admin/leads/${l._id}`} onClick={e => e.stopPropagation()}><b>{l.name}</b></Link>{l.company && <small>{l.company}</small>}</td>
          <td>{l.phone}{l.email && <small>{l.email}</small>}</td><td>{KIND[l.kind]}</td><td>{l.product}</td>
          <td><em className={`pill st-${l.status}`}>{STATUS[l.status]}</em></td><td><small>{l.source?.page}</small></td></tr>)}</tbody>
      </table></div>}
    {data?.pages > 1 && <nav className="adm-pages">{data.page > 1 && <button className="adm-link" onClick={() => set('page', data.page - 1)}>← Newer</button>}<span>Page {data.page} of {data.pages}</span>{data.page < data.pages && <button className="adm-link" onClick={() => set('page', data.page + 1)}>Older →</button>}</nav>}
  </>
}
