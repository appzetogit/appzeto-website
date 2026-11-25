'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Link, NavLink, Nav, useLocation } from './router.jsx'
import { LogoCompact, Phone, reduced } from './Brand.jsx'
import { Curtain, Opening, Progress, useReveal } from './Motion.jsx'
import Sticky, { WaIcon } from './Sticky.jsx'
import { SiteCtx, useSite, waLinkOf } from './site.jsx'
import { markBooted } from './Later.jsx'
import { products, services } from './data.js'

const nav = [['/products', 'Products'], ['/services', 'Services'], ['/projects', 'Work'], ['/about', 'About'], ['/apply-now', 'Careers']]

function Header() {
  const s = useSite()
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
  const s = useSite(), waLink = waLinkOf(s)
  const social = Object.entries(s.social).filter(([, v]) => v)
  return <footer className="foot"><div className="wrap">
    <div className="ft-top">
      <p className="ft-big">Got an idea at 2 am? Write it down. We’ll read it in the morning.</p>
      <div className="foot-sleep" aria-hidden="true"><Phone off><path d="M66 78q6 6 12 0M98 78q6 6 12 0" fill="none" stroke="#33A77A" strokeWidth="3" strokeLinecap="round" /><path d="M82 94h13" stroke="#33A77A" strokeWidth="3" strokeLinecap="round" /></Phone><span className="zz z1" /><span className="zz z2" /></div>
    </div>
    <ul className="ft-reach">{s.phones.map(p => <li key={p.href}><a href={p.href}><Ico d={CALL} />{p.label}</a></li>)}{waLink && <li className="ft-wa"><a href={waLink} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a></li>}<li className="ft-mail"><a href={`mailto:${s.email}`}><Ico d={MAIL} />{s.email}</a></li></ul>
    <nav className="ft-nav" aria-label="Footer">{footLinks.map(([h, ls]) => <div key={h}><h2>{h}</h2><ul>{ls.map(([to, t]) => <li key={to}><Link to={to}>{t}</Link></li>)}</ul></div>)}
      <div><h2>Visit</h2><address>{s.address}</address>{social.length > 0 && <ul>{social.map(([k, v]) => <li key={k}><a href={v}>{k}</a></li>)}</ul>}</div></nav>
    <div className="ft-legal"><span suppressHydrationWarning>© {new Date().getFullYear()} {s.legalName} (Appzeto)</span><ul><li><Link to="/privacy-policy#privacy">Privacy</Link></li><li><Link to="/privacy-policy#refund">Refunds</Link></li><li><Link to="/privacy-policy#cancellation">Cancellation</Link></li></ul></div>
  </div></footer>
}

// Page titles now live in each route's metadata.
function Scroll({ at }) {
  const { pathname, hash } = at
  useEffect(() => {
    const go = () => { const el = hash && document.getElementById(hash.slice(1)); el ? el.scrollIntoView() : scrollTo(0, 0) }
    const root = document.documentElement; root.style.scrollBehavior = 'auto'; go(); root.style.scrollBehavior = ''
    if (!hash) return
    document.fonts?.ready.then(go)
    // The target may be in a section that mounts a moment later (Later.jsx)
    const more = () => document.getElementById(hash.slice(1)) && go()
    addEventListener('appzeto:more', more); const t = setTimeout(() => removeEventListener('appzeto:more', more), 1500)
    return () => { clearTimeout(t); removeEventListener('appzeto:more', more) }
  }, [pathname, hash])
  return null
}

const split = to => { const u = new URL(to, location.href); return { pathname: u.pathname, hash: u.hash } }

// Between pages: a slanted panel rises, the page swaps underneath, the panel leaves.
// Same timings as before: cover 480ms, swap, clear 620ms.
// `loc` is where we're heading (the header follows it at once); `shown` is the page on screen.
function usePageSwap() {
  const router = useRouter(), real = usePathname()
  const [loc, setLoc] = useState({ pathname: real, hash: '' }), [shown, setShown] = useState(loc), [phase, setPhase] = useState('idle')
  const timer = useRef(0), pending = useRef(null), shownRef = useRef(shown)
  shownRef.current = shown
  useEffect(() => { if (location.hash) { const t = { pathname: real, hash: location.hash }; setLoc(t); setShown(t) } }, [])

  const go = (to, { replace } = {}) => {
    const t = split(to), calm = reduced(), how = replace ? 'replace' : 'push'
    const move = () => { pending.current = { ...t, clear: !calm }; router[how](to, { scroll: false }) }
    clearTimeout(timer.current); setLoc(t)
    if (t.pathname === shownRef.current.pathname) { setPhase('idle'); setShown(t); router[how](to, { scroll: false }); return }
    if (calm) { setPhase('idle'); move(); return }
    setPhase('cover'); timer.current = setTimeout(move, 480)
  }

  // Back and forward: hold Next's own handler until the panel is up, then let it through.
  useEffect(() => {
    const on = e => {
      if (e.az) return
      const t = { pathname: location.pathname, hash: location.hash }
      clearTimeout(timer.current); setLoc(t)
      if (t.pathname === shownRef.current.pathname) { setPhase('idle'); setShown(t); return }
      if (reduced()) { setPhase('idle'); pending.current = { ...t, clear: false }; return }
      e.stopImmediatePropagation()
      const state = e.state
      setPhase('cover')
      timer.current = setTimeout(() => { pending.current = { ...t, clear: true }; const ev = new PopStateEvent('popstate', { state }); ev.az = true; dispatchEvent(ev) }, 480)
    }
    addEventListener('popstate', on); return () => removeEventListener('popstate', on)
  }, [])

  // The new page is in: show it and let the panel go.
  useLayoutEffect(() => {
    if (real === shownRef.current.pathname) return
    const p = pending.current?.pathname === real ? pending.current : null
    pending.current = null
    const t = { pathname: real, hash: p?.hash || '' }
    setShown(t); setLoc(l => l.pathname === real ? l : t)
    if (p?.clear) setPhase('clear')
  }, [real])
  useEffect(() => { if (phase === 'clear') { const t = setTimeout(() => setPhase('idle'), 620); return () => clearTimeout(t) } }, [phase])
  return { loc, shown, phase, go }
}

// /admin has its own layout: no header, footer, curtain or opening there
export default function App({ children, site }) { return usePathname().startsWith('/admin') ? children : <SiteCtx.Provider value={site}><Site>{children}</Site></SiteCtx.Provider> }

// First page and campaign tags of the visit, sent along with any form
function useVisit() {
  useEffect(() => { try { if (!sessionStorage.getItem('az_visit')) { const p = new URLSearchParams(location.search), utm = {}; for (const k of ['source', 'medium', 'campaign', 'term', 'content']) if (p.get('utm_' + k)) utm['utm_' + k] = p.get('utm_' + k); sessionStorage.setItem('az_visit', JSON.stringify({ landing: location.pathname + location.search, ref: document.referrer, ...utm })) } } catch {} }, [])
}

function Site({ children }) {
  useVisit()
  const nav = usePageSwap(), { shown, phase } = nav
  useReveal(shown.pathname)
  useEffect(() => { import('./water.js'); markBooted() }, [])
  return <Nav.Provider value={nav}><Opening /><Curtain phase={phase} /><Scroll at={shown} /><Header /><main id="main" tabIndex="-1">{children}</main><Footer /><Sticky path={shown.pathname} /></Nav.Provider>
}
