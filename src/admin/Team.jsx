'use client'
import { useEffect, useState } from 'react'
import { ROLE, ROLE_SEES, api } from './api.js'

export default function Team() {
  const [d, setD] = useState(null), [err, setErr] = useState(''), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  const load = () => api('/api/admin/users').then(setD).catch(e => setErr(e.message))
  useEffect(() => { load() }, [])
  const run = async (fn, ok) => { setBusy(true); setErr(''); setMsg(''); try { await fn(); setMsg(ok); await load() } catch (e) { setErr(e.message) } setBusy(false) }
  const add = e => { e.preventDefault(); const f = new FormData(e.target), body = Object.fromEntries(f); run(async () => { await api('/api/admin/users', { method: 'POST', body }); e.target.reset() }, `Added ${body.name || body.username}. Give them their username and first password; they can change it under My account.`) }
  const patch = (u, body, ok) => run(() => api(`/api/admin/users/${encodeURIComponent(u)}`, { method: 'PATCH', body }), ok)
  const reset = u => { const pw = prompt(`New password for ${u.name} (at least 10 characters):`); if (pw) patch(u.username, { password: pw }, `Password changed for ${u.name}.`) }
  if (!d) return err ? <p className="adm-err">{err}</p> : <p className="adm-wait">Loading…</p>
  return <>
    <header className="adm-head"><div><h1>Team</h1><p className="adm-sub">Everyone who can sign in. Sales see clients and partners; HR sees job applicants.</p></div></header>
    {msg && <p className="adm-ok" role="status">{msg}</p>}{err && <p className="adm-err" role="alert">{err}</p>}
    <section className="adm-card adm-table-wrap"><table className="adm-table adm-team">
      <thead><tr><th>Name</th><th>Username</th><th>Email (for alerts)</th><th>Role</th><th></th></tr></thead>
      <tbody>
        <tr className="adm-fixed"><td data-l="Name"><b>Owner</b><small>from the server settings</small></td><td data-l="Username">{d.owner}</td><td data-l="Email"><small>uses the alert list in Settings</small></td><td data-l="Role">{ROLE.owner}</td><td></td></tr>
        {d.users.map(u => <tr key={u.username} className={u.active ? '' : 'adm-off'}>
          <td data-l="Name"><b>{u.name}</b>{!u.active && <small>Switched off</small>}</td><td data-l="Username">{u.username}</td>
          <td data-l="Email"><input defaultValue={u.email} placeholder="name@company.com" aria-label={`Email for ${u.name}`} onBlur={e => e.target.value !== (u.email || '') && patch(u.username, { email: e.target.value }, 'Email saved.')} /></td>
          <td data-l="Role"><select value={u.role} disabled={busy} onChange={e => patch(u.username, { role: e.target.value }, 'Role changed.')} aria-label={`Role for ${u.name}`}><option value="sales">{ROLE.sales}</option><option value="hr">{ROLE.hr}</option></select></td>
          <td className="adm-row-acts"><button className="adm-link" disabled={busy} onClick={() => reset(u)}>New password</button><button className="adm-link" disabled={busy} onClick={() => patch(u.username, { active: !u.active }, u.active ? `${u.name} can no longer sign in.` : `${u.name} can sign in again.`)}>{u.active ? 'Switch off' : 'Switch on'}</button></td>
        </tr>)}
      </tbody></table></section>
    <section className="adm-card"><h2>Add someone</h2>
      <form className="adm-form" onSubmit={add}>
        <label>Name<input name="name" required /></label>
        <label>Username<input name="username" required pattern="[a-zA-Z0-9._\-]{3,30}" title="3–30 letters, numbers, dots or dashes" autoCapitalize="none" /></label>
        <label>Email<input name="email" type="email" placeholder="For lead alerts and reminders" /></label>
        <label>Role<select name="role" defaultValue="sales">{['sales', 'hr'].map(r => <option key={r} value={r}>{ROLE[r]} · {ROLE_SEES[r]}</option>)}</select></label>
        <label>First password<input name="password" type="text" minLength={10} required autoComplete="off" /></label>
        <div><button className="adm-btn" disabled={busy}>Add to team</button></div>
      </form>
    </section>
  </>
}
