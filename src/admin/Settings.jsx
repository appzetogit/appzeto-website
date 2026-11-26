'use client'
import { useEffect, useState } from 'react'
import { api } from './api.js'

export default function Settings() {
  const [d, setD] = useState(null), [err, setErr] = useState(''), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { api('/api/admin/settings').then(setD).catch(e => setErr(e.message)) }, [])
  const save = async e => {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('')
    const f = new FormData(e.target)
    const body = { site: { email: f.get('email'), phones: [f.get('phone1'), f.get('phone2'), f.get('phone3')], whatsapp: f.get('whatsapp'), address: f.get('address') }, ops: { alertEmails: f.get('alertEmails'), autoReply: f.get('autoReply') === 'on', retentionMonths: f.get('retentionMonths') } }
    try { const r = await api('/api/admin/settings', { method: 'PUT', body }); setD({ ...d, site: r.site, ops: r.ops }); setMsg('Saved. The website shows the new details within a minute.') } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  const test = async () => { setErr(''); setMsg(''); try { await api('/api/admin/settings', { method: 'POST' }); setMsg('Test email sent to the alert list.') } catch (x) { setErr(x.message) } }
  if (!d) return err ? <p className="adm-err">{err}</p> : <p className="adm-wait">Loading…</p>
  const { site, ops } = d
  return <form onSubmit={save} className="adm-settings">
    <header className="adm-head"><h1>Settings</h1><button className="adm-btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></header>
    {msg && <p className="adm-ok" role="status">{msg}</p>}{err && <p className="adm-err" role="alert">{err}</p>}
    <section className="adm-card"><h2>Contact details on the website</h2><p className="adm-sub">Shown in the header menu, footer, contact form and WhatsApp button.</p>
      <div className="adm-form">
        <label>Email<input name="email" type="email" defaultValue={site.email} required /></label>
        {[0, 1, 2].map(i => <label key={i}>Phone {i + 1}{i > 0 && <span className="opt"> (optional)</span>}<input name={`phone${i + 1}`} defaultValue={site.phones[i] || ''} placeholder="+91 98765 43210" required={i === 0} /></label>)}
        <label>WhatsApp number<span className="opt"> (country code first, empty hides the button)</span><input name="whatsapp" defaultValue={site.whatsapp} placeholder="917691810506" inputMode="numeric" /></label>
        <label className="adm-wide">Office addresses (one per line)<textarea name="address" rows="3" defaultValue={site.address} /></label>
      </div>
    </section>
    <section className="adm-card"><h2>Lead alerts</h2>
      <p className={`adm-mail ${d.mail ? 'on' : ''}`}>{d.mail ? 'Email sending is set up on the server.' : 'Email sending isn’t set up on the server yet, so alerts and auto-replies are paused. Leads are still saved here.'}</p>
      <div className="adm-form">
        <label className="adm-wide">Send every new lead to<span className="opt"> (emails, separated by commas)</span><input name="alertEmails" defaultValue={ops.alertEmails.join(', ')} placeholder="sales@appzeto.com, you@appzeto.com" /></label>
        <label className="adm-check adm-wide"><input type="checkbox" name="autoReply" defaultChecked={ops.autoReply} />Email visitors a short “we got it” reply when they leave an email address</label>
      </div>
      <p className="adm-sub">Team members with an email also get the leads for their forms, and a 9 am email with their follow-ups.</p>
      <button type="button" className="adm-link" onClick={test} disabled={!d.mail}>Send a test email</button>
    </section>
    <section className="adm-card"><h2>Privacy</h2>
      <div className="adm-form">
        <label>Delete leads automatically after<select name="retentionMonths" defaultValue={String(ops.retentionMonths)}>{[[6, '6 months'], [12, '1 year'], [24, '2 years'], [36, '3 years'], [0, 'Never']].map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
      </div>
      <p className="adm-sub">Checked every hour; CVs go with them. To remove one person on request, open their lead and use “Delete lead”.</p>
    </section>
  </form>
}
