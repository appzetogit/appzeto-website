'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogoCompact } from '../Brand.jsx'
import { api } from './api.js'

const nav = [['/admin', 'Dashboard'], ['/admin/leads', 'Leads']]
export default function Shell({ children }) {
  const path = usePathname(), router = useRouter(), [me, setMe] = useState(null), [open, setOpen] = useState(false)
  const login = path === '/admin/login'
  useEffect(() => { if (!login) api('/api/admin/me').then(setMe).catch(() => {}) }, [path, login])
  useEffect(() => setOpen(false), [path])
  if (login) return <div className="adm adm-login-wrap">{children}</div>
  const out = async () => { await api('/api/admin/login', { method: 'DELETE' }); router.replace('/admin/login') }
  return <div className="adm">
    <aside className={`adm-side ${open ? 'open' : ''}`}>
      <Link href="/admin" className="adm-logo" aria-label="Appzeto admin"><LogoCompact /><span>Admin</span></Link>
      <nav>{nav.map(([h, t]) => { const on = h === '/admin' ? path === h : path.startsWith(h); return <Link key={h} href={h} className={on ? 'on' : ''}>{t}{t === 'Leads' && me?.unseen > 0 && <b className="adm-badge">{me.unseen}</b>}</Link> })}</nav>
      <div className="adm-side-foot"><a href="/" target="_blank" rel="noopener">View website</a>{me && <button onClick={out}>Sign out {me.user}</button>}</div>
    </aside>
    <button className="adm-burger" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>☰</button>
    <main className="adm-main">{me ? children : <p className="adm-wait">Loading…</p>}</main>
  </div>
}
