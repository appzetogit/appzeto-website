'use client'
// Job openings for the Careers page: add, edit, close/reopen, delete. Owner and HR only.
import { useEffect, useState } from 'react'
import { api, ago } from './api.js'

const TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']
const EMPTY = { title: '', department: '', type: 'Full-time', experience: '', location: 'Indore', salary: '', openings: 1, skills: '', summary: '', responsibilities: '', requirements: '', open: true }
const toForm = o => ({ ...EMPTY, ...o, skills: (o.skills || []).join(', '), responsibilities: (o.responsibilities || []).join('\n'), requirements: (o.requirements || []).join('\n') })

export default function Openings() {
  const [list, setList] = useState(null), [err, setErr] = useState(''), [msg, setMsg] = useState('')
  const [edit, setEdit] = useState(null), [busy, setBusy] = useState(false)
  const load = () => api('/api/admin/openings').then(d => setList(d.openings)).catch(e => setErr(e.message))
  useEffect(() => { load() }, [])

  const set = k => e => setEdit(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const save = async e => {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('')
    try {
      const id = edit._id
      await api(id ? `/api/admin/openings/${id}` : '/api/admin/openings', { method: id ? 'PUT' : 'POST', body: edit })
      setMsg(id ? 'Opening updated. The Careers page shows it right away.' : 'Opening added to the Careers page.')
      setEdit(null); await load()
    } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  const toggle = async o => {
    setErr(''); setMsg('')
    try { await api(`/api/admin/openings/${o._id}`, { method: 'PUT', body: { ...toForm(o), open: !o.open } }); setMsg(o.open ? `“${o.title}” is closed and hidden from the Careers page.` : `“${o.title}” is open again.`); load() } catch (x) { setErr(x.message) }
  }
  const remove = async o => {
    if (!confirm(`Delete “${o.title}”? This can’t be undone. Closing it keeps it here for later.`)) return
    try { await api(`/api/admin/openings/${o._id}`, { method: 'DELETE' }); setMsg('Opening deleted.'); load() } catch (x) { setErr(x.message) }
  }

  if (!list) return err ? <p className="adm-err">{err}</p> : <p className="adm-wait">Loading…</p>
  const open = list.filter(o => o.open).length
  return <div className="adm-settings">
    <header className="adm-head"><div><h1>Job openings</h1><p className="adm-sub">{open} open on the Careers page{list.length > open ? `, ${list.length - open} closed` : ''}. Applications arrive under Leads → Job applicants.</p></div>
      {!edit && <button type="button" className="adm-btn" onClick={() => { setEdit({ ...EMPTY }); setMsg('') }}>+ Add opening</button>}</header>
    {msg && <p className="adm-ok" role="status">{msg}</p>}{err && <p className="adm-err" role="alert">{err}</p>}

    {edit && <form className="adm-card" onSubmit={save}>
      <h2>{edit._id ? 'Edit opening' : 'New opening'}</h2>
      <div className="adm-form">
        <label className="adm-wide">Job title<input value={edit.title} onChange={set('title')} placeholder="MERN Stack Developer" required autoFocus /></label>
        <label>Department<span className="opt"> (optional)</span><input value={edit.department} onChange={set('department')} placeholder="Engineering" /></label>
        <label>Type<select value={edit.type} onChange={set('type')}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Experience<input value={edit.experience} onChange={set('experience')} placeholder="2–4 years" /></label>
        <label>Location<input value={edit.location} onChange={set('location')} placeholder="Indore (on-site)" /></label>
        <label>Salary<span className="opt"> (optional, shown publicly)</span><input value={edit.salary} onChange={set('salary')} placeholder="₹4–7 LPA" /></label>
        <label>Number of positions<input type="number" min="1" max="99" value={edit.openings} onChange={set('openings')} /></label>
        <label className="adm-wide">Skills<span className="opt"> (separated by commas)</span><input value={edit.skills} onChange={set('skills')} placeholder="React, Node.js, Express, MongoDB, REST APIs" /></label>
        <label className="adm-wide">Short summary<textarea rows="2" value={edit.summary} onChange={set('summary')} placeholder="Build and ship features across our ready-to-launch platforms." /></label>
        <label className="adm-wide">What you’ll do<span className="opt"> (one per line)</span><textarea rows="4" value={edit.responsibilities} onChange={set('responsibilities')} placeholder={'Build APIs in Node.js and Express\nCreate React screens from Figma designs'} /></label>
        <label className="adm-wide">What we’re looking for<span className="opt"> (one per line)</span><textarea rows="4" value={edit.requirements} onChange={set('requirements')} placeholder={'2+ years with the MERN stack\nComfortable with Git and code reviews'} /></label>
        <label className="adm-check adm-wide"><input type="checkbox" checked={edit.open} onChange={set('open')} />Show on the Careers page</label>
      </div>
      <div className="adm-acts"><button className="adm-btn" disabled={busy}>{busy ? 'Saving…' : edit._id ? 'Save changes' : 'Add opening'}</button><button type="button" className="adm-link" onClick={() => setEdit(null)}>Cancel</button></div>
    </form>}

    {list.length === 0 && !edit && <section className="adm-card"><h2>No openings yet</h2><p className="adm-sub">Add one and it appears on the Careers page with an Apply button. Until then the page asks people to introduce themselves.</p></section>}
    <div className="adm-jobs">{list.map(o => <article key={o._id} className={`adm-card adm-job${o.open ? '' : ' is-closed'}`}>
      <div className="adm-job-top"><h2>{o.title}</h2><span className={`adm-job-st${o.open ? ' on' : ''}`}>{o.open ? 'Open' : 'Closed'}</span></div>
      <p className="adm-job-meta">{[o.department, o.type, o.experience, o.location, o.salary, o.openings > 1 ? `${o.openings} positions` : ''].filter(Boolean).join(' · ')}</p>
      {o.skills?.length > 0 && <p className="adm-job-skills">{o.skills.map(s => <span key={s}>{s}</span>)}</p>}
      <p className="adm-sub">Added {ago(o.createdAt)}</p>
      <div className="adm-acts"><button type="button" className="adm-btn adm-btn-y" onClick={() => { setEdit(toForm(o)); setMsg(''); scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button><button type="button" className="adm-btn" onClick={() => toggle(o)}>{o.open ? 'Close' : 'Reopen'}</button><button type="button" className="adm-link adm-del" onClick={() => remove(o)}>Delete</button></div>
    </article>)}</div>
  </div>
}
