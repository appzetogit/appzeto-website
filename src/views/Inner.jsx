'use client'
import { useRef, useState } from 'react'
import { Link } from '../router.jsx'
import { LetterA, Phone, useLive } from '../Brand.jsx'
import { Mascot } from '../Mascot.jsx'
import { WaIcon, waLink } from '../Sticky.jsx'
import ProductLogo from '../ProductLogo.jsx'
import s from '../settings.js'
import { products, services, moreServices, allServices, steps } from '../data.js'

// UI only: nothing is sent to a server yet. The form says so and offers a real email instead.
function Form({ subject, fields }) {
  const [mail, setMail] = useState(null), done = useRef(null)
  const submit = e => {
    e.preventDefault(); dispatchEvent(new Event('appzeto:cheer'))
    const body = [...new FormData(e.target)].map(([k, v]) => `${k}: ${v}`).join('\n')
    setMail(`mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setTimeout(() => done.current?.focus(), 50)
  }
  return <form className="form" onSubmit={submit}>
    {fields.map(f => <label key={f.n} className={f.t === 'area' || f.wide ? 'wide' : ''}>{f.n}{f.opt && <span className="opt"> (optional)</span>}
      {f.t === 'area' ? <textarea name={f.n} rows="4" required={!f.opt} /> : f.t === 'select' ? <select name={f.n}>{f.o.map(o => <option key={o}>{o}</option>)}</select> : <input name={f.n} type={f.t || 'text'} autoComplete={f.a} required={!f.opt} />}</label>)}
    <div className="wide"><button className="btn">{'Review and send'}</button></div>
    {mail && <div className="wide notice" ref={done} tabIndex="-1" role="status"><p><b>One more step.</b> This form doesn’t send by itself yet, so nothing has gone to us. Open it in your email app and press send.</p><a className="btn btn-y" href={mail}>Open email</a></div>}
  </form>
}
const ideaFields = [{ n: 'Your name', a: 'name' }, { n: 'Phone', t: 'tel', a: 'tel' }, { n: 'Email', t: 'email', a: 'email', opt: true }, { n: 'About', t: 'select', o: ['A new project', ...products.map(p => p.name), 'Support', 'Something else'] }, { n: 'Your idea', t: 'area' }]

export function ContactBlock({ h1 }) {
  const ref = useLive(), H = h1 ? 'h1' : 'h2', ctl = useRef({ mode: null })
  return <section className="contact" id="contact-form" ref={ref}><div className="wrap contact-grid">
    <div className="contact-l"><H className="h-xl">What’s the idea?</H><p className="lead">A sentence is enough to start.</p>
      <ul className="reach">{s.phones.map(p => <li key={p.href}><a href={p.href}>{p.label}</a></li>)}<li><a href={`mailto:${s.email}`}>{s.email}</a></li></ul>{waLink && <a className="btn btn-wa" href={waLink} target="_blank" rel="noopener noreferrer"><WaIcon />Chat on WhatsApp</a>}<address>{s.address}</address></div>
    <div className="device" onFocus={() => { ctl.current.mode = 'type' }} onBlur={() => { ctl.current.mode = null }} onSubmit={() => { ctl.current.mode = null }}><div className="peek"><Mascot ctl={ctl} /></div><div className="device-in"><Form subject="New idea from the website" fields={ideaFields} /></div></div>
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
        <ul className="pr-roles">{p.roles.map(r => <li key={r.who}><b>{r.who}</b>{r.does[0]}</li>)}</ul>
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
export function Projects() {
  return <><Top title="Work" text="Client case studies will appear here once they’re approved to share. Until then, these are the platforms we’ve built ourselves." screen="web-app" tone="top-taxi" />
    <section className="sec"><div className="wrap svc-rows">{products.slice(0, 2).map(v => <Link key={v.id} to={v.path} className="svc-row"><Phone name={v.id} /><div><h2>{v.name}</h2><p>{v.intro}</p></div></Link>)}</div></section><Cta t="Want to be the first case study here?" /></>
}
export function Blogs() { return <Top title="Nothing written yet" text="We’ll publish here when we have something useful to say." screen={1}><div className="row"><Link className="btn" to="/">Back to home</Link></div></Top> }
export function About() {
  return <><Top title="We put ideas on screens" text="Appzeto is a technology company in Indore. We build websites, mobile apps and AI features, and platforms that are ready to launch." screen="A" tone="top-food" />
    <section className="sec"><div className="wrap two"><p className="big-text">Our name starts inside a phone because most of our work ends up there.</p><div className="prose"><p>Businesses come to us with everything from a sentence to a full specification. We work through the same seven steps either way, and stay to look after what we launch.</p><p>We build mostly with React, Next.js, Node.js, MongoDB, Flutter and AWS.</p><p>Appzeto is a brand of {s.legalName}.</p></div></div></section>
    <section className="sec sec-t"><div className="wrap"><h2 className="h-l">The seven steps</h2><ol className="more-list">{steps.map(([t, d]) => <li key={t}><div><b>{t}</b><span>{d}</span></div></li>)}</ol></div></section><Cta t="Come and say hello" /></>
}
export const Contact = () => <ContactBlock h1 />
export function Careers() {
  return <><Top title="Come and build" text="Openings and internships are listed here when we have them." screen={3} tone="top-taxi" />
    <section className="sec" id="positions"><div className="wrap two"><div><h2 className="h-l">Introduce yourself</h2><p className="lead">No openings are listed right now. You can still tell us what you’re good at.</p></div><Form subject="Careers" fields={[{ n: 'Your name', a: 'name' }, { n: 'Email', t: 'email', a: 'email' }, { n: 'I’m interested in', t: 'select', o: ['A job', 'An internship'], wide: true }, { n: 'Link to your work', t: 'url', opt: true, wide: true }, { n: 'About you', t: 'area' }]} /></div></section></>
}
export function Partners() {
  return <><Top title="Bring us a client. Earn with us." text="Agencies, consultants and integrators can offer our platforms and services to their own clients." screen="digital-marketing" tone="top-care" />
    <section className="sec"><div className="wrap two"><div><h2 className="h-l">What partners get</h2><ul className="ticks"><li>Access to our product line-up</li><li>Commission on what you bring</li><li>A partner support contact</li><li>Marketing and sales material</li></ul></div><Form subject="Channel partner" fields={[{ n: 'Company' , a: 'organization' }, { n: 'Contact person', a: 'name' }, { n: 'Company email', t: 'email', a: 'email' }, { n: 'Phone', t: 'tel', a: 'tel' }, { n: 'What you do', t: 'select', wide: true, o: ['Technology consulting', 'Digital agency', 'System integrator', 'Independent vendor'] }, { n: 'Message', t: 'area', opt: true }]} /></div></section></>
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
