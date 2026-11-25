'use client'
import { useState } from 'react'
import { ROLE, ROLE_SEES, api } from './api.js'
import { useMe } from './Shell.jsx'

export default function Account() {
  const me = useMe(), [err, setErr] = useState(''), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  const save = async e => {
    e.preventDefault(); setErr(''); setMsg('')
    const f = new FormData(e.target)
    if (f.get('next') !== f.get('again')) return setErr('The new passwords don’t match.')
    setBusy(true)
    try { await api('/api/admin/account', { method: 'PATCH', body: { current: f.get('current'), next: f.get('next') } }); e.target.reset(); setMsg('Password changed.') } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  return <>
    <header className="adm-head"><div><h1>My account</h1><p className="adm-sub">{me.name} · {ROLE[me.role]} · sees {ROLE_SEES[me.role].toLowerCase()}</p></div></header>
    {msg && <p className="adm-ok" role="status">{msg}</p>}{err && <p className="adm-err" role="alert">{err}</p>}
    <form className="adm-card adm-form" onSubmit={save}><h2 className="adm-wide">Change password</h2>
      <label>Current password<input name="current" type="password" autoComplete="current-password" required /></label>
      <label>New password<input name="next" type="password" autoComplete="new-password" minLength={10} required /></label>
      <label>New password again<input name="again" type="password" autoComplete="new-password" minLength={10} required /></label>
      <div><button className="adm-btn" disabled={busy}>Change password</button></div>
    </form>
  </>
}
