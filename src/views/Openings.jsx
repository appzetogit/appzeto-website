'use client'
// Open roles on the Careers page. Each card opens to show the full job; "Apply" picks the role in the form below.
import { useState } from 'react'
import './careers.css'

const Ico = {
  exp: <path d="M4 8h16v11H4zM9 8V5h6v3" />,
  pin: <><path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>,
  pay: <><path d="M7 5h10M7 9h10M9 5c4 0 5 4 0 4l6 10" /></>,
  ppl: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5M18 14c2 .6 3 2.6 3 6" /></>,
}
const Meta = ({ i, children }) => <li><svg viewBox="0 0 24 24" aria-hidden="true">{Ico[i]}</svg>{children}</li>

export const apply = title => {
  const form = document.getElementById('apply-form'), sel = form?.querySelector('select[name="Position"]')
  if (sel) sel.value = title
  if (!form) return
  const top = () => form.getBoundingClientRect().top + scrollY - 90, y0 = scrollY
  scrollTo({ top: top(), behavior: 'smooth' })
  // Where smooth scrolling is off or stalls, jump instead of leaving the visitor where they were
  setTimeout(() => { if (Math.abs(scrollY - y0) < 4) scrollTo({ top: top(), behavior: 'instant' }) }, 450)
  setTimeout(() => form.querySelector('input:not([type=hidden])')?.focus({ preventScroll: true }), 700)
}

export default function Openings({ list }) {
  const [open, setOpen] = useState(list.length === 1 ? list[0].id : null)
  return <section className="sec jobs-sec" id="positions"><div className="wrap">
    <div className="jobs-head"><div><p className="nw-eyebrow">Open roles</p><h2 className="h-l">We’re hiring</h2></div>
      <p className="lead">{list.length} {list.length === 1 ? 'role' : 'roles'} open at our Indore offices. Don’t see yours? Introduce yourself in the form below.</p></div>
    <ul className="jobs">{list.map(j => {
      const on = open === j.id
      return <li key={j.id} className={`job${on ? ' on' : ''}`}>
        <button type="button" className="job-top" aria-expanded={on} onClick={() => setOpen(on ? null : j.id)}>
          <span className="job-main">
            <span className="job-tags"><em className={`job-type t-${j.type.toLowerCase().replace(/\W+/g, '')}`}>{j.type}</em>{j.department && <em className="job-dept">{j.department}</em>}</span>
            <b className="job-title">{j.title}</b>
            <ul className="job-meta">
              {j.experience && <Meta i="exp">{j.experience}</Meta>}
              <Meta i="pin">{j.location}</Meta>
              {j.salary && <Meta i="pay">{j.salary}</Meta>}
              {j.openings > 1 && <Meta i="ppl">{j.openings} positions</Meta>}
            </ul>
          </span>
          <span className="job-chev" aria-hidden="true" />
        </button>
        {j.skills.length > 0 && <p className="job-skills">{j.skills.map(s => <span key={s}>{s}</span>)}</p>}
        <div className="job-more" hidden={!on}>
          {j.summary && <p className="job-sum">{j.summary}</p>}
          <div className="job-cols">
            {j.responsibilities.length > 0 && <div><h3>What you’ll do</h3><ul className="ticks">{j.responsibilities.map(x => <li key={x}>{x}</li>)}</ul></div>}
            {j.requirements.length > 0 && <div><h3>What we’re looking for</h3><ul className="ticks">{j.requirements.map(x => <li key={x}>{x}</li>)}</ul></div>}
          </div>
        </div>
        <div className="job-foot"><button type="button" className="btn btn-y job-apply" onClick={() => apply(j.title)}>Apply now</button>
          <button type="button" className="job-toggle" onClick={() => setOpen(on ? null : j.id)}>{on ? 'Hide details' : 'View details'}</button></div>
      </li>
    })}</ul>
  </div></section>
}
