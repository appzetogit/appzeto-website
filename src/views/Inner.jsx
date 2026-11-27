'use client'
import { useEffect, useRef, useState } from 'react'
import { Link } from '../router.jsx'
import { LetterA, Phone, useLive } from '../Brand.jsx'
import { Mascot } from '../Mascot.jsx'
import { WaIcon } from '../Sticky.jsx'
import { useSite, waLinkOf } from '../site.jsx'
import { trackEvent } from '../track.js'
import ProductLogo from '../ProductLogo.jsx'
import Network, { Count } from '../Network.jsx'
import Openings from './Openings.jsx'
import { products, clientProjects, services, moreServices, allServices, steps } from '../data.js'

// Sends to /api/leads (the admin inbox). If that fails, the visitor can still send it by email.
function Form({ kind, subject, fields }) {
  const s = useSite()
  const [st, setSt] = useState(null), [msg, setMsg] = useState(''), [mail, setMail] = useState(null), done = useRef(null), t0 = useRef(0)
  useEffect(() => { t0.current = Date.now() }, [])
  const submit = async e => {
    e.preventDefault()
    const form = e.target, fd = new FormData(form)
    const body = [...fd].filter(([k, v]) => typeof v === 'string' && k !== 'website').map(([k, v]) => `${k}: ${v}`).join('\n')
    setMail(`mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    fd.set('kind', kind); fd.set('t', String(t0.current)); fd.set('page', location.pathname)
    try { const v = JSON.parse(sessionStorage.getItem('az_visit') || '{}'); for (const k in v) if (v[k]) fd.set(k, v[k]) } catch {}
    const cv = fd.get('cv'); if (cv && typeof cv !== 'string' && !cv.size) fd.delete('cv')
    setSt('sending')
    try {
      const res = await fetch('/api/leads', { method: 'POST', body: fd }), out = await res.json().catch(() => ({}))
      if (!res.ok || !out.ok) { setMsg(out.error || ''); setSt(res.status === 400 && out.error ? 'invalid' : 'failed') }
      else { setSt('sent'); form.reset(); dispatchEvent(new Event('appzeto:cheer')); trackEvent('lead', kind) }
    } catch { setSt('failed') }
    setTimeout(() => done.current?.focus(), 50)
  }
  return <form className="form" onSubmit={submit}>
    {fields.map(f => <label key={f.n} className={f.t === 'area' || f.wide ? 'wide' : ''}>{f.n}{f.opt && <span className="opt"> (optional)</span>}
      {f.t === 'area' ? <textarea name={f.n} rows="4" required={!f.opt} /> : f.t === 'select' ? <select name={f.n}>{f.o.map(o => <option key={o}>{o}</option>)}</select> : f.t === 'file' ? <input name="cv" type="file" accept="application/pdf,.pdf" /> : <input name={f.n} type={f.t || 'text'} autoComplete={f.a} required={!f.opt} />}</label>)}
    <input className="hp" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
    <label className="wide consent"><input type="checkbox" name="consent" value="yes" required /><span>Appzeto may contact me about this. See the <Link to="/privacy-policy#privacy">privacy policy</Link>.</span></label>
    <div className="wide"><button className="btn" disabled={st === 'sending'}>{st === 'sending' ? 'Sending…' : 'Send'}</button></div>
    {st === 'sent' && <div className="wide notice" ref={done} tabIndex="-1" role="status"><p><b>Got it, thank you.</b> We’ll call or write back within one working day.</p></div>}
    {st === 'invalid' && <div className="wide notice" ref={done} tabIndex="-1" role="alert"><p>{msg}</p></div>}
    {st === 'failed' && <div className="wide notice" ref={done} tabIndex="-1" role="alert"><p><b>That didn’t go through.</b> {msg || 'Please try again, or send the same message by email.'}</p><a className="btn btn-y" href={mail}>Send by email</a></div>}
  </form>
}
const ideaFields = [{ n: 'Your name', a: 'name' }, { n: 'Phone', t: 'tel', a: 'tel' }, { n: 'Email', t: 'email', a: 'email', opt: true }, { n: 'About', t: 'select', o: ['A new project', ...products.map(p => p.name), 'Support', 'Something else'] }, { n: 'Your idea', t: 'area' }]

export function ContactBlock({ h1 }) {
  const s = useSite(), waLink = waLinkOf(s)
  const ref = useLive(), H = h1 ? 'h1' : 'h2', ctl = useRef({ mode: null })
  return <section className="contact" id="contact-form" ref={ref}><div className="wrap contact-grid">
    <div className="contact-l"><H className="h-xl">What’s the idea?</H><p className="lead">A sentence is enough to start.</p>
      <ul className="reach">{s.phones.map(p => <li key={p.href}><a href={p.href}>{p.label}</a></li>)}<li><a href={`mailto:${s.email}`}>{s.email}</a></li></ul>{waLink && <a className="btn btn-wa" href={waLink} target="_blank" rel="noopener noreferrer"><WaIcon />Chat on WhatsApp</a>}<address>{String(s.address || '').split(/\n+/).filter(Boolean).map(a => <span key={a} className="addr-line">{a}</span>)}</address></div>
    <div className="device" onFocus={() => { ctl.current.mode = 'type' }} onBlur={() => { ctl.current.mode = null }} onSubmit={() => { ctl.current.mode = null }}><div className="peek"><Mascot ctl={ctl} /></div><div className="device-in"><Form kind="idea" subject="New idea from the website" fields={ideaFields} /></div></div>
  </div></section>
}

function Top({ title, text, screen, tone = '', letter, children }) {
  const ref = useLive()
  return <section className={`top ${tone}`} ref={ref}><div className="wrap top-grid"><div>{letter && <ProductLogo id={screen} />}<h1 className="h-xxl">{title}</h1>{text && <p className="lead">{text}</p>}{children}</div>{screen !== undefined && (screen === 'A' ? <Phone><g className="logo-a"><LetterA /></g></Phone> : letter ? <div className="duo"><Phone name={screen} /><Mascot letter={letter} crown={screen === 'super'} /></div> : <Phone name={screen} />)}</div></section>
}
const Cta = ({ t = 'Want this with your name on it?' }) => <section className="cta"><div className="wrap cta-in"><h2 className="h-xl">{t}</h2><Link className="btn btn-y" to="/contact">Tell us your idea</Link></div></section>

export function Product({ p }) {
  return <><Top title={p.name} text={p.line} screen={p.id} tone={`top-${p.id}`} letter={p.letter}><div className="row"><Link className="btn btn-y" to="/contact">Ask for a demo</Link></div></Top>
    <section className="sec"><div className="wrap"><p className="big-text">{p.intro}</p>
      <div className="role-rows">{p.roles.map(r => <div key={r.who} className="role-row"><h2>{r.who}</h2><ul>{r.does.map(d => <li key={d}>{d}</li>)}</ul></div>)}</div></div></section>
    <section className="sec sec-t"><div className="wrap others"><h2 className="h-l">Other platforms</h2>{products.filter(o => o !== p).slice(0, 4).map(o => <Link key={o.id} to={o.path}><Phone name={o.id} /><span><b>{o.name}</b>{o.line}</span></Link>)}</div></section>
    <Cta /></>
}
export function Products() {
  return <><Top title="Apps you can launch" text="Take one, take a few, or put them all in one app." screen="super" letter="A">
      <nav className="jump" aria-label="Products">{products.map(p => <Link key={p.id} className="btn" to={p.path}>{p.name}</Link>)}</nav></Top>
    <section className="sec"><div className="wrap prod-rows">{products.map(p => <article key={p.id} className={`prod-row pr-${p.id}`}>
      <Link to={p.path} className="pr-phone" aria-label={`Open ${p.name}`}><Phone name={p.id} /></Link>
      <div><ProductLogo id={p.id} /><h2 className="h-xl">{p.name}</h2><p className="lead">{p.intro}</p>
        <ul className="pr-roles">{p.roles.map(r => <li key={r.who}><b>{r.who}</b><ul className="pr-feats">{r.does.slice(0, 4).map(d => <li key={d}>{d}</li>)}</ul></li>)}</ul>
        <div className="row"><Link className={p.id === 'taxi' ? 'btn btn-y' : 'btn btn-k'} to={p.path}>See {p.name}</Link><Link className="txt" to="/contact">Ask for a demo</Link></div></div>
    </article>)}</div></section>
    <Cta t="Need something we haven’t built yet?" /></>
}
export function Services() {
  const ref = useLive(), more = useLive()
  return <><Top title="What we make" text="Five things we do most, and five that keep them going." screen="mobile-application" tone="top-food">
      <nav className="jump" aria-label="Services">{services.map(v => <Link key={v.slug} className="btn" to={`/services/${v.slug}`}>{v.name}</Link>)}</nav></Top>
    <section className="sec" ref={ref}><div className="wrap svc-cards">{services.map((v, i) => <Link key={v.slug} to={`/services/${v.slug}`} className={`svc-card svc-c${i % 4}`}>
      <span className="svc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <Phone name={v.slug} />
      <div><h2>{v.name}</h2><p>{v.text}</p><ul className="chips">{v.features.map(f => <li key={f}>{f}</li>)}</ul><span className="go">Explore {v.name === 'AI and machine learning' ? 'AI and ML' : v.name.toLowerCase()}</span></div>
    </Link>)}</div></section>
    <section className="sec sec-t" ref={more}><div className="wrap"><h2 className="h-l">And to keep it going</h2><ul className="more-cards">{moreServices.map(v => <li key={v.slug}><Link to={`/services/${v.slug}`}><Phone name={v.slug} /><span><b>{v.name}</b><span>{v.line}</span></span></Link></li>)}</ul></div></section>
    <Cta t="Not sure which one you need?" /></>
}
export function Service({ slug }) {
  const v = allServices.find(x => x.slug === slug)
  if (!v) return <NotFound />
  const i = allServices.indexOf(v), next = allServices[(i + 1) % allServices.length]
  return <><Top title={v.name} text={v.line} screen={v.slug} tone="top-food"><div className="row"><Link className="btn btn-y" to="/contact">Tell us your idea</Link></div></Top>
    <section className="sec"><div className="wrap two"><p className="big-text">{v.text}</p><ul className="ticks">{v.features.map(f => <li key={f}>{f}</li>)}</ul></div></section>
    <section className="sec sec-t"><div className="wrap"><Link className="nextlink" to={`/services/${next.slug}`}><span>Next</span><b>{next.name}</b></Link></div></section></>
}
function ClientPhone({ app }) {
  return (
    <div className="client-phone-wrap" aria-hidden="true">
      <div className="client-phone-body">
        <div className="client-phone-notch" />
        <div className="client-phone-screen">
          <div className="client-screen-header">
            <span className="client-screen-pill">{app.category}</span>
          </div>
          <div className="client-screen-center">
            <div className="client-screen-icon-wrap">
              <img src={app.icon} alt="" className="client-screen-icon" width="70" height="70" />
              {app.downloads === '1.5 Lakh+' && <span className="client-screen-flame">🔥</span>}
            </div>
            <b className="client-screen-name">{app.name}</b>
            <span className="client-screen-dl">{app.downloads}</span>
          </div>
          <div className="client-screen-footer">
            <span className="client-screen-btn">
              <svg viewBox="0 0 512 512" width="12" height="12" aria-hidden="true">
                <path fill="#4285F4" d="M32.5 12.8C24.4 21.4 20 34.3 20 50.4v411.2c0 16.1 4.4 29 12.5 37.6l2.1 1.9L260 275.7v-5.4L34.6 10.9l-2.1 1.9z" />
                <path fill="#FBBC04" d="M340 355.7l-80-80v-5.4l80-80 1.9 1.1 94.6 53.7c27 15.3 27 40.3 0 55.7L341.9 354.6l-1.9 1.1z" />
                <path fill="#EA4335" d="M341.9 354.6L260 272.7 32.5 500.2c8.9 9.5 23.5 10.7 40 1.3l269.4-146.9" />
                <path fill="#34A853" d="M341.9 157.4L72.5 10.5C56 1.1 41.4 2.3 32.5 11.8L260 239.3l81.9-81.9z" />
              </svg>
              <span>Play Store</span>
            </span>
          </div>
        </div>
      </div>
      <div className="client-phone-shadow" />
    </div>
  )
}

const stack = ['React', 'Next.js', 'Node.js', 'MongoDB', 'Flutter', 'React Native', 'AWS']
export function Projects() {
  const clientRef = useLive(), platformRef = useLive(), next = useLive()
  return <>
    {/* Section 1: Client Applications (Top hero removed per user request) */}
    <section className="sec work-hero-sec" ref={clientRef}>
      <div className="wrap">
        <p className="nw-eyebrow">Proven at scale</p>
        <h1 className="h-xl work-h">Our Best Apps, Live on Play Store</h1>
        <p className="lead work-subhead">
          Real production applications engineered and scaled by Appzeto for clients across India, with over 200,000+ total downloads.
        </p>
        <div className="svc-cards">
          {clientProjects.map((p, i) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`svc-card work-card client-work-card svc-c${i % 4}`}
            >
              <span className="svc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <ClientPhone app={p} />
              <div>
                <div className="work-card-head">
                  <span className="work-cat-tag">{p.category}</span>
                  <span className="work-dl-badge">
                    {p.downloads === '1.5 Lakh+' && '🔥 '}
                    {p.downloads} Downloads
                  </span>
                </div>
                <h2>{p.name}</h2>
                <p>{p.intro}</p>
                <ul className="chips">
                  {p.chips.map(c => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <span className="go">View on Google Play &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Tech stack ticker */}
    <div className="ticker work-stack" aria-label={'Built with ' + stack.join(', ')}>
      <div className="tick-run">
        {[0, 1, 2].map(k => (
          <ul key={k} aria-hidden="true">
            {stack.map(t => (
              <li key={t}>{t}<b>/</b></li>
            ))}
          </ul>
        ))}
      </div>
    </div>

    {/* Section 2: Ready-to-launch Platforms */}
    <section className="sec sec-t" ref={platformRef}>
      <div className="wrap">
        <p className="nw-eyebrow">Built by us</p>
        <h2 className="h-xl work-h">{products.length} platforms, live and ready</h2>
        <div className="svc-cards">
          {products.map((p, i) => (
            <Link key={p.id} to={p.path} className={`svc-card work-card svc-c${(i + 2) % 4}`}>
              <span className="svc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <Phone name={p.id} />
              <div>
                <ProductLogo id={p.id} />
                <h2>{p.name}</h2>
                <p>{p.intro}</p>
                <ul className="chips">{p.roles.map(r => <li key={r.who}>{r.who}</li>)}</ul>
                <span className="go">Open {p.name} &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="sec" ref={next}>
      <div className="wrap">
        <Link to="/contact" className="work-next">
          <Phone><g className="logo-a"><LetterA /></g></Phone>
          <div>
            <h2 className="h-xl">Your app could be next</h2>
            <p className="lead">Have an idea for a custom platform, marketplace, or mobile app? Tell us what you want to build and we’ll sketch it, code it and launch it.</p>
            <span className="go">Start a project &rarr;</span>
          </div>
        </Link>
      </div>
    </section>
  </>
}
export function Blogs() { return <Top title="Nothing written yet" text="We’ll publish here when we have something useful to say." screen={1}><div className="row"><Link className="btn" to="/">Back to home</Link></div></Top> }
// The seven steps, each with its own live phone (Home and About)
export function How({ title = 'How an idea gets its screen' }) {
  const ref = useLive()
  return <section className="how" ref={ref}><div className="wrap">
    <h2 className="h-xl">{title}</h2>
    <ol className="how-list">{steps.map(([t, d], i) => <li key={t}><Phone name={i} /><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
  </div></section>
}

const ico = { rd: { fill: 'none', stroke: '#06282A', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } }
const values = [
  ['A sentence is enough', 'Bring a full spec or one line on a napkin. We help shape the rest.', <><path d="M10 34V12a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H18z" {...ico.rd} /><path d="M17 16h14M17 22h9" {...ico.rd} /></>],
  ['Sketch before colour', 'Structure first, then screens, so nobody pays for pixels twice.', <><path d="M12 36l3-10L31 10l7 7-16 16z" {...ico.rd} /><path d="M27 14l7 7" {...ico.rd} /></>],
  ['Break it before you do', 'We test every build on real phones before it goes near the stores.', <><circle cx="21" cy="21" r="11" {...ico.rd} /><path d="M29 29l9 9M16 21l4 4 7-8" {...ico.rd} /></>],
  ['We stay after launch', 'Updates, fixes and new features once your users arrive.', <><path d="M24 40s-14-8-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 11-14 19-14 19z" {...ico.rd} /></>],
]
export function About() {
  const s = useSite(), nums = useLive(), seen = useRef(false), [go, setGo] = useState(false)
  const offices = Math.max(1, String(s.address || '').split(/\n+/).filter(Boolean).length)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen.current) { seen.current = true; setGo(true) } }, { threshold: .4 })
    io.observe(nums.current); return () => io.disconnect()
  }, [])
  const counts = [[products.length, '', 'Platforms ready to launch'], [allServices.length, '', 'Services we offer'], [steps.length, '', 'Steps from idea to launch'], [offices, '', offices === 1 ? 'Office in Indore' : 'Offices in Indore']]
  return <><Top title="We put ideas on screens" text="Appzeto is a technology company in Indore. We build websites, mobile apps and AI features, and platforms that are ready to launch." screen="super" letter="A" tone="top-food">
      <div className="row"><Link className="btn btn-y" to="/projects">See our work</Link><Link className="txt" to="/contact">Tell us your idea</Link></div></Top>
    <section className="sec ab-nums-sec" ref={nums}><div className="wrap"><dl className="nw-stats ab-nums">{counts.map(([v, suf, l]) => <div key={l}><dt><Count to={v} suf={suf} go={go} /></dt><dd>{l}</dd></div>)}</dl></div></section>
    <section className="sec ab-story"><div className="wrap ab-story-in">
      <blockquote className="ab-quote"><p>Our name starts inside a phone because most of our work ends up there.</p></blockquote>
      <div className="prose"><p className="nw-eyebrow">Our story</p><p>Businesses come to us with everything from a sentence to a full specification. We work through the same seven steps either way, and stay to look after what we launch.</p><p>We build mostly with React, Next.js, Node.js, MongoDB, Flutter and AWS.</p><p>Appzeto is a brand of {s.legalName}.</p></div>
    </div></section>
    <section className="sec sec-t"><div className="wrap"><p className="nw-eyebrow">How we work</p><h2 className="h-xl ab-vals-h">Four promises</h2>
      <ul className="ab-vals">{values.map(([t, d, icon], i) => <li key={t} className={`ab-v${i}`}><svg viewBox="0 0 48 48" aria-hidden="true">{icon}</svg><h3>{t}</h3><p>{d}</p></li>)}</ul>
    </div></section>
    <How title="The seven steps" />
    <div className="ticker work-stack" aria-label={'Built with ' + stack.join(', ')}><div className="tick-run">{[0, 1, 2].map(k => <ul key={k} aria-hidden="true">{stack.map(t => <li key={t}>{t}<b>/</b></li>)}</ul>)}</div></div>
    <Network />
    <Cta t="Come and say hello" /></>
}
export const Contact = () => <ContactBlock h1 />
export function Careers({ openings = [] }) {
  const has = openings.length > 0
  return <><Top title="Come and build" text={has ? 'Join the team building apps for businesses across India, from our offices in Indore.' : 'Openings and internships are listed here when we have them.'} screen={3} tone="top-taxi" />
    {has && <Openings list={openings} />}
    <section className="sec" id={has ? 'apply-form' : 'positions'}><div className="wrap two"><div><h2 className="h-l">{has ? 'Apply' : 'Introduce yourself'}</h2><p className="lead">{has ? 'Pick the role, tell us about yourself and attach your CV. We reply to every application.' : 'No openings are listed right now. You can still tell us what you’re good at.'}</p></div><Form kind="career" subject="Careers" fields={[...(has ? [{ n: 'Position', t: 'select', o: [...openings.map(o => o.title), 'General application'], wide: true }] : []), { n: 'Your name', a: 'name' }, { n: 'Email', t: 'email', a: 'email' }, { n: 'I’m interested in', t: 'select', o: ['A job', 'An internship'], wide: true }, { n: 'Link to your work', t: 'url', opt: true, wide: true }, { n: 'CV (PDF, up to 5 MB)', t: 'file', opt: true, wide: true }, { n: 'About you', t: 'area' }]} /></div></section></>
}
export function Partners() {
  return <><Top title="Bring us a client. Earn with us." text="Agencies, consultants and integrators can offer our platforms and services to their own clients." screen="digital-marketing" tone="top-care" />
    <Network join={false} />
    <section className="sec"><div className="wrap two"><div><h2 className="h-l">What partners get</h2><ul className="ticks"><li>Access to our product line-up</li><li>Commission on what you bring</li><li>A partner support contact</li><li>Marketing and sales material</li></ul></div><Form kind="partner" subject="Channel partner" fields={[{ n: 'Company' , a: 'organization' }, { n: 'Contact person', a: 'name' }, { n: 'Company email', t: 'email', a: 'email' }, { n: 'Phone', t: 'tel', a: 'tel' }, { n: 'What you do', t: 'select', wide: true, o: ['Technology consulting', 'Digital agency', 'System integrator', 'Independent vendor'] }, { n: 'Message', t: 'area', opt: true }]} /></div></section></>
}
const legal = [
  ['privacy', 'Privacy Policy', 'At Appzeto, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website, services, or digital products.', [
    ['Information We Collect', 'We may collect the following information:', ['Name, email address, phone number', 'Business or company details', 'Payment and billing information', 'Project or service requirements', 'Usage data such as pages visited and interactions']],
    ['How We Use Your Information', 'Your information is used to:', ['Provide IT services and digital products', 'Process payments and EMI transactions', 'Communicate about projects, updates, and support', 'Improve our services and website experience', 'Meet legal and compliance requirements']],
    ['Payment & EMI Information', '', ['All online payments are processed through secure payment gateways', 'EMI options are available for selected digital products', 'Appzeto does not store sensitive payment details like card numbers', 'EMI terms depend on the selected plan and payment conditions']],
    ['Data Security', 'We take reasonable technical and organizational measures to protect your data from unauthorized access, misuse, or loss.', []],
    ['User Responsibility', 'Users are responsible for:', ['Providing accurate information', 'Keeping login credentials confidential', 'Using services lawfully and fairly']],
    ['Sharing of Information', 'We do not sell or rent personal data. Information is shared only when required for:', ['Payment processing', 'Legal compliance', 'Service delivery']],
    ['Updates to Privacy Policy', 'Appzeto may update this policy from time to time. Continued use of our services means you accept the updated policy.', []]]],
  ['refund', 'Refund & Return Policy', 'At Appzeto, we focus on transparency and fairness for all IT services and digital products.', [
    ['IT Services (Projects & Custom Work)', '', ['Refunds are not guaranteed once project work has started', 'Refund eligibility depends on: Project stage, Work delivered, and Resources allocated', 'Any approved refund will be calculated after deducting completed work costs']],
    ['Digital Products', '', ['Digital products are delivered electronically', 'Once access is provided, returns are not applicable', 'Refunds are considered only if: The product is not delivered, or there is a proven technical issue that cannot be resolved']],
    ['EMI Payments', '', ['EMI payments are non-refundable once processed', 'Refunds, if approved, will follow EMI provider rules', 'Any cancellation does not cancel EMI obligations automatically']],
    ['Refund Processing', '', ['Approved refunds are processed to the original payment method', 'Processing time may vary based on payment mode']],
    ['Fair Usage', 'Refund requests made with false claims or misuse may be rejected.', []]]],
  ['cancellation', 'Cancellation Policy', 'This policy explains how cancellations work for services and digital products at Appzeto.', [
    ['Service Cancellation', '', ['Clients may request cancellation before project execution begins', 'Once development has started, cancellation may incur partial charges and not qualify for a refund', 'Charges depend on work completed and resources used']],
    ['Project-Based Cancellation', '', ['Milestone-based projects follow milestone payment terms', 'Cancellation after milestone approval will not refund completed milestones', 'Custom software work is non-transferable']],
    ['Digital Product Cancellation', '', ['Digital products cannot be canceled after access is granted', 'Subscription-based products may be canceled for future billing cycles', 'Past usage fees are non-refundable']],
    ['EMI Cancellation Terms', '', ['EMI plans cannot be canceled once activated', 'Cancellation of a product does not cancel EMI payments', 'EMI terms remain binding as per selected payment agreement']],
    ['Appzeto’s Right to Cancel', 'Appzeto reserves the right to cancel services if:', ['There is misuse of services', 'Payment obligations are not met', 'False or misleading information is provided']]]],
]
export function Legal() {
  return <div className="wrap legal"><h1 className="h-xxl">Policies</h1><p>Last updated: January 2026</p>
    <nav aria-label="Policies">{legal.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}</nav>
    {legal.map(([id, t, intro, parts]) => <section key={id} id={id}><h2 className="h-l">{t}</h2><p>{intro}</p>{parts.map(([h, p, li], i) => <div key={h}><h3>{i + 1}. {h}</h3>{p && <p>{p}</p>}{li.length > 0 && <ul>{li.map(x => <li key={x}>{x}</li>)}</ul>}</div>)}</section>)}
    <section><h2 className="h-l">Final notes</h2><ul><li>All services and products are delivered digitally</li><li>No physical items are shipped</li><li>Policies apply to all users unless stated otherwise</li></ul><p>Questions? <Link to="/contact">Contact support</Link>.</p></section></div>
}
export function NotFound() {
  return <section className="top nf"><div className="wrap top-grid"><div><h1 className="h-xxl">The A wandered off</h1><p className="lead">This page doesn’t exist, or it has moved.</p><div className="row"><Link className="btn" to="/">Back to home</Link></div></div><div className="nf-art" aria-hidden="true"><Phone /><Mascot /></div></div></section>
}
