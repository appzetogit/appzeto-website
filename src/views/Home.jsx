'use client'
import { useState } from 'react'
import { Link } from '../router.jsx'
import { Phone, useLive } from '../Brand.jsx'
import { products, services, moreServices, steps, faqs } from '../data.js'
import { Boarding } from '../Ride.jsx'
import ProductLogo from '../ProductLogo.jsx'
import Hero from '../Hero.jsx'
import { ContactBlock } from './Inner.jsx'

export function FoodBand() {
  const p = products[0], ref = useLive()
  return <section className="band band-food" ref={ref}><div className="wrap band-grid">
    <div><ProductLogo id="food" /><h3 className="h-xl">{p.name}</h3><p className="lead">{p.line}</p>
      <dl className="roles">{p.roles.map(r => <div key={r.who}><dt>{r.who}</dt><dd>{r.does[0]}</dd></div>)}</dl>
      <Link className="btn btn-y" to={p.path}>Open Appzeto Food</Link></div>
    <Phone name="food" className="tilt" />
  </div></section>
}
export function TaxiBand() {
  const p = products[1], ref = useLive()
  return <section className="band band-taxi" ref={ref}><div className="wrap">
    <div className="taxi-head"><div><ProductLogo id="taxi" /><h3 className="h-xl">{p.name}</h3></div><div><p className="lead">{p.line}</p><Link className="btn btn-y" to={p.path}>Open Appzeto Taxi</Link></div></div>
  </div>
    <div className="road" aria-hidden="true"><Boarding /></div>
    <div className="wrap taxi-roles">{p.roles.map(r => <div key={r.who}><h4>{r.who}</h4><ul>{r.does.slice(0, 3).map(d => <li key={d}>{d}</li>)}</ul></div>)}</div>
  </section>
}
function MoreBands() {
  const ref = useLive(), rest = products.slice(2, 5), sup = products[5], ai = products[6]
  return <div ref={ref}>
    <section className="trio"><div className="wrap trio-in">{rest.map(p => <Link key={p.id} to={p.path} className={`trio-i tr-${p.id}`}><Phone name={p.id} /><h3>{p.name}</h3><p>{p.line}</p><span className="go">Open</span></Link>)}</div></section>
    <section className="band band-super"><div className="wrap band-grid"><div><h3 className="h-xl">{sup.name}</h3><p className="lead">{sup.line}</p><ul className="care-list">{sup.roles.map(r => <li key={r.who}><b>{r.who}</b> {r.does[0].toLowerCase()}</li>)}</ul><Link className="btn btn-k" to={sup.path}>Open All-in-One</Link></div><Phone name="super" className="tilt" /></div></section>
    <section className="band band-ai"><div className="wrap band-grid flip"><Phone name="ai" /><div><h3 className="h-xl">{ai.name}</h3><p className="lead">{ai.intro}</p><ul className="ai-list">{ai.roles[0].does.map(x => <li key={x}>{x}</li>)}</ul><Link className="btn btn-y" to={ai.path}>See AI projects</Link></div></div></section>
  </div>
}

function ServiceList() {
  const [on, setOn] = useState('mobile-application'), ref = useLive()
  return <section className="svc" ref={ref}><div className="wrap">
    <h2 className="h-xl">Or start from a blank screen</h2>
    <div className="svc-grid">
      <ul className="svc-list">{services.map(v => <li key={v.slug} className={on === v.slug ? 'on' : ''}>
        <Link to={`/services/${v.slug}`} onMouseEnter={() => setOn(v.slug)} onFocus={() => setOn(v.slug)}><span className="svc-mini"><Phone name={v.slug} /></span><span className="svc-txt"><b>{v.name}</b><span>{v.line}</span></span></Link></li>)}</ul>
      <div className="svc-phone"><Phone name={on} /></div>
    </div>
    <p className="svc-more">We also do {moreServices.map((m, i) => <span key={m.slug}>{i ? (i === moreServices.length - 1 ? ' and ' : ', ') : ''}<Link to={`/services/${m.slug}`}>{m.name === 'SEO' ? 'SEO' : m.name.toLowerCase()}</Link></span>)}.</p>
  </div></section>
}

function How() {
  const ref = useLive()
  return <section className="how" ref={ref}><div className="wrap">
    <h2 className="h-xl">How an idea gets its screen</h2>
    <ol className="how-list">{steps.map(([t, d], i) => <li key={t}><Phone name={i} /><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
  </div></section>
}

export default function Home() {
  return <><Hero />
    <div id="products"><div className="wrap prod-intro"><h2 className="h-xl">Pick an app. Or take them all.</h2><p className="lead">Each one has its own page. All-in-One puts them behind a single login.</p></div>
      <FoodBand /><TaxiBand /><MoreBands /></div>
    <ServiceList /><How />
    <section className="join"><div className="wrap join-grid">
      <Link to="/channel-partners" className="panel panel-y"><h2>Bring us a client. Earn with us.</h2><p>Channel partners get commission, a support contact and sales material.</p><span className="go">Partner with us</span></Link>
      <Link to="/apply-now" className="panel panel-i"><h2>Come and build</h2><p>See whether we’re hiring.</p><span className="go">Careers</span></Link>
    </div></section>
    <section className="faq"><div className="wrap faq-grid"><h2 className="h-xl">Asked often</h2><div>{faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
    <ContactBlock />
  </>
}
