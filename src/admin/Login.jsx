'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogoCompact } from '../Brand.jsx'
import { api } from './api.js'

export default function Login() {
  const router = useRouter(), next = useSearchParams().get('next'), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    const f = new FormData(e.target)
    try { await api('/api/admin/login', { method: 'POST', body: { user: f.get('user'), password: f.get('password') } }); router.replace(next?.startsWith('/admin') ? next : '/admin') }
    catch (x) { setErr(x.message); setBusy(false) }
  }
  return <form className="adm-card adm-login" onSubmit={submit}>
    <LogoCompact /><h1>Admin</h1><p>Sign in to see the website’s leads.</p>
    <label>Username<input name="user" autoComplete="username" required autoFocus /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
    {err && <p className="adm-err" role="alert">{err}</p>}
    <button className="adm-btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
  </form>
}
