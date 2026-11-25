'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogoCompact } from '../Brand.jsx'
import { ROLE, api } from './api.js'

// The signed-in person: { user, name, role, env, unseen, team, mail }
const Me = createContext(null)
export const useMe = () => useContext(Me)

export default function Shell({ children }) {
  const path = usePathname(), router = useRouter(), [me, setMe] = useState(null), [open, setOpen] = useState(false)
  const login = path === '/admin/login'
  useEffect(() => { if (!login) api('/api/admin/me').then(setMe).catch(() => {}) }, [path, login])
  useEffect(() => setOpen(false), [path])
  if (login) return <div className="adm adm-login-wrap">{children}</div>
  const out = async () => { await api('/api/admin/login', { method: 'DELETE' }); router.replace('/admin/login') }
  const nav = [['/admin', 'Dashboard'], ['/admin/leads', 'Leads'], ...(me?.role === 'owner' ? [['/admin/team', 'Team'], ['/admin/settings', 'Settings']] : []), ...(me && !me.env ? [['/admin/account', 'My account']] : [])]
  return <div className="adm">
    <aside className={`adm-side ${open ? 'open' : ''}`}>
      <Link href="/admin" className="adm-logo" aria-label="Appzeto admin"><LogoCompact /><span>Admin</span></Link>
      <nav>{nav.map(([h, t]) => { const on = h === '/admin' ? path === h : path.startsWith(h); return <Link key={h} href={h} className={on ? 'on' : ''}>{t}{t === 'Leads' && me?.unseen > 0 && <b className="adm-badge">{me.unseen}</b>}</Link> })}</nav>
      <div className="adm-side-foot">{me && <p className="adm-who"><b>{me.name}</b><span>{ROLE[me.role]}</span></p>}<a href="/" target="_blank" rel="noopener">View website</a>{me && <button onClick={out}>Sign out</button>}</div>
    </aside>
    <button className="adm-burger" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>☰</button>
    <main className="adm-main">{me ? <Me.Provider value={me}>{children}</Me.Provider> : <p className="adm-wait">Loading…</p>}</main>
  </div>
}
