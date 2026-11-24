import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LogoCompact, Phone } from './Brand.jsx'
import { Curtain, Opening, Progress, usePageSwap, useReveal } from './Motion.jsx'
import Sticky, { WaIcon, waLink } from './Sticky.jsx'
import s from './settings.js'
import { products, services, allServices } from './data.js'
import Home from './pages/Home.jsx'
import { Product, Products, Services, Service, Projects, Blogs, About, Contact, Careers, Partners, Legal, NotFound } from './pages/Inner.jsx'

const nav = [['/products', 'Products'], ['/services', 'Services'], ['/projects', 'Work'], ['/about', 'About'], ['/apply-now', 'Careers']]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => {
    document.body.classList.toggle('locked', open)
    const k = e => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k); return () => { removeEventListener('keydown', k); document.body.classList.remove('locked') }
  }, [open])
  return <header className="head"><Progress />
    <a className="skip" href="#main">Skip to content</a>
    <div className="wrap head-in">
      <Link to="/" className="head-logo" aria-label="Appzeto home"><LogoCompact /></Link>
      <nav className="head-nav" aria-label="Main">{nav.map(([to, t]) => to.includes('#') ? <Link key={to} to={to}>{t}</Link> : <NavLink key={to} to={to}>{t}</NavLink>)}</nav>
      <Link to="/contact" className="btn btn-sm">Tell us your idea</Link>
      <button className="burger" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><svg viewBox="0 0 32 32" width="28" aria-hidden="true">{open ? <path d="M8 8l16 16M24 8L8 24" /> : <path d="M12 7l-8 9 8 9M20 7l8 9-8 9" />}</svg></button>
    </div>
    {open && <nav id="menu" className="menu" aria-label="Mobile">
      {nav.map(([to, t]) => <Link key={to} to={to} onClick={() => setOpen(false)}>{t}</Link>)}
      <Link to="/contact" className="btn">Tell us your idea</Link>
      <a className="menu-tel" href={s.phones[0].href}>{s.phones[0].label}</a>
    </nav>}
  </header>
}

const Ico = ({ d }) => <svg viewBox="0 0 24 24" width="22" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
const CALL = 'M6 3h3l2 5-2.500 2a12 12 0 0 0 5.500 5.500l2-2.500 5 2v3a3 3 0 0 1-3 3A16 16 0 0 1 3 6a3 3 0 0 1 3-3z', MAIL = 'M3 6h18v12H3zM3 7l9 7 9-7'
const footLinks = [
  ['Products', [['/products', 'All products'], ...products.map(p => [p.path, p.name])]],
  ['Services', services.map(v => [`/services/${v.slug}`, v.name === 'AI and machine learning' ? 'AI and ML' : v.name])],
  ['Company', [['/', 'Home'], ['/about', 'About'], ['/projects', 'Work'], ['/apply-now', 'Careers'], ['/channel-partners', 'Partner with us'], ['/contact', 'Contact']]],
]
function Footer() {
  const social = Object.entries(s.social).filter(([, v]) => v)
  return <footer className="foot"><div className="wrap">
    <div className="ft-top">
      <p className="ft-big">Got an idea at 2 am? Write it down. We’ll read it in the morning.</p>
      <div className="foot-sleep" aria-hidden="true"><Phone off><path d="M66 78q6 6 12 0M98 78q6 6 12 0" fill="none" stroke="#33A77A" strokeWidth="3" strokeLinecap="round" /><path d="M82 94h13" stroke="#33A77A" strokeWidth="3" strokeLinecap="round" /></Phone><span className="zz z1" /><span className="zz z2" /></div>
    </div>
    <ul className="ft-reach">{s.phones.map(p => <li key={p.href}><a href={p.href}><Ico d={CALL} />{p.label}</a></li>)}{waLink && <li className="ft-wa"><a href={waLink} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a></li>}<li className="ft-mail"><a href={`mailto:${s.email}`}><Ico d={MAIL} />{s.email}</a></li></ul>
    <nav className="ft-nav" aria-label="Footer">{footLinks.map(([h, ls]) => <div key={h}><h2>{h}</h2><ul>{ls.map(([to, t]) => <li key={to}><Link to={to}>{t}</Link></li>)}</ul></div>)}
      <div><h2>Visit</h2><address>{s.address}</address>{social.length > 0 && <ul>{social.map(([k, v]) => <li key={k}><a href={v}>{k}</a></li>)}</ul>}</div></nav>
    <div className="ft-legal"><span>© {new Date().getFullYear()} {s.legalName} (Appzeto)</span><ul><li><Link to="/privacy-policy#privacy">Privacy</Link></li><li><Link to="/privacy-policy#refund">Refunds</Link></li><li><Link to="/privacy-policy#cancellation">Cancellation</Link></li></ul></div>
  </div></footer>
}

const titles = { '/': 'Websites, apps and ready-to-launch platforms', '/products': 'Products', '/services': 'Services', '/projects': 'Work', '/about': 'About', '/contact': 'Contact', '/apply-now': 'Careers', '/channel-partners': 'Partner with us', '/privacy-policy': 'Policies', '/blogs': 'Blog' }
function Scroll({ at }) {
  const { pathname, hash } = at
  useEffect(() => {
    const p = products.find(x => x.path === pathname), v = allServices.find(x => `/services/${x.slug}` === pathname)
    document.title = `Appzeto | ${p?.name || v?.name || titles[pathname] || 'Page not found'}`
    const go = () => { const el = hash && document.getElementById(hash.slice(1)); el ? el.scrollIntoView() : scrollTo(0, 0) }
    const root = document.documentElement; root.style.scrollBehavior = 'auto'; go(); root.style.scrollBehavior = ''
    if (hash) document.fonts?.ready.then(go)
  }, [pathname, hash])
  return null
}

export default function App() {
  const [shown, phase] = usePageSwap()
  useReveal(shown.pathname)
  return <><Opening /><Curtain phase={phase} /><Scroll at={shown} /><Header /><main id="main" tabIndex="-1"><Routes location={shown}>
    <Route path="/" element={<Home />} />
    {products.map(p => <Route key={p.id} path={p.path} element={<Product p={p} />} />)}
    <Route path="/products" element={<Products />} />
    <Route path="/services" element={<Services />} /><Route path="/services/:slug" element={<Service />} />
    <Route path="/projects" element={<Projects />} /><Route path="/blogs" element={<Blogs />} />
    <Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} />
    <Route path="/appzeto-hospital" element={<Navigate to="/products" replace />} /><Route path="/chit-chat" element={<Navigate to="/contact" replace />} /><Route path="/demo" element={<Navigate to="/contact" replace />} /><Route path="/team" element={<Navigate to="/about" replace />} />
    <Route path="/apply-now" element={<Careers />} /><Route path="/channel-partners" element={<Partners />} />
    <Route path="/privacy-policy" element={<Legal />} /><Route path="*" element={<NotFound />} />
  </Routes></main><Footer /><Sticky path={shown.pathname} /></>
}
