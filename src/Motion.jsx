'use client'
import { useEffect, useRef, useState } from 'react'
import Eyes from './Eyes.jsx'
import { Letter, LetterA, PhoneBody, Phone, reduced } from './Brand.jsx'

// Opening: the loader phone lights up, the A drops in, the letters pop out, the page is wiped clear.
// It's in the server HTML, so its CSS starts at first paint; the 2s is counted from then too.
// No JS or reduced motion: CSS keeps it hidden (motion.css), and it's dropped here.
const sincePaint = () => { const p = performance.getEntriesByName('first-contentful-paint')[0] || performance.getEntriesByName('first-paint')[0]; return p ? performance.now() - p.startTime : 0 }
export function Opening() {
  const [st, setSt] = useState('play')
  useEffect(() => { if (reduced()) setSt('gone') }, [])
  useEffect(() => {
    if (st === 'gone' || (st === 'play' && reduced())) return
    const t = setTimeout(() => setSt(st === 'play' ? 'leave' : 'gone'), st === 'play' ? Math.max(0, 2000 - sincePaint()) : 1000)
    const skip = () => setSt(s => s === 'play' ? 'leave' : s)
    addEventListener('keydown', skip); addEventListener('pointerdown', skip); addEventListener('wheel', skip, { passive: true })
    return () => { clearTimeout(t); removeEventListener('keydown', skip); removeEventListener('pointerdown', skip); removeEventListener('wheel', skip) }
  }, [st])
  useEffect(() => { document.documentElement.classList.toggle('opening', st === 'play') }, [st])
  if (st === 'gone') return null
  return <div className={`open ${st}`} aria-hidden="true"><i className="ol l3" /><i className="ol l2" /><div className="ol l1">
    <svg viewBox="36 -20 540 240"><g className="op-phone"><PhoneBody /><g className="op-a"><LetterA /></g></g>
      {['p1', 'p2', 'z', 'e', 't', 'o'].map((k, i) => <g key={k} className="op-l" style={{ animationDelay: `${980 + i * 75}ms` }}><Letter k={k} /></g>)}
      <g className="op-tag"><path d="M281 166L255 180L281 195M496 166L523 180L496 195" fill="none" stroke="#06282A" strokeWidth="2.200" /><g fontFamily="Noto Serif,Georgia,serif" fontWeight="700" fontStyle="italic" fontSize="16.500" fill="#06282A"><text x="280" y="187" textLength="77" lengthAdjust="spacingAndGlyphs">REFLECT</text><text x="374" y="187" textLength="122" lengthAdjust="spacingAndGlyphs">TECHNOLOGY</text></g><path d="M357 193h8l9-24h-8z" fill="#06282A" /></g></svg>
  </div></div>
}

export const Curtain = ({ phase }) => <div className={`curtain ${phase}`} aria-hidden="true"><div className="cur-in"><Phone><g className="cur-a"><LetterA /><Eyes r={17} /></g></Phone></div></div>

// Scroll motion. Elements are only hidden once this has run, so nothing depends on it.
const PICK = '.svc-card,.more-cards li,.pr-phone,.pr-roles li,.h-xl,.h-l,.big-text,.prod-intro .lead,.band .lead,.band .btn,.roles>div,.taxi-roles>div,.care-list li,.band-grid>.phone,.svc-list li,.svc-phone,.how-list li,.panel,.faq details,.reach li,.device,.role-row,.svc-row,.more-list li,.ticks li,.others a,.sec .form'
export function useReveal(key) {
  useEffect(() => {
    if (reduced() || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(es => es.filter(e => e.isIntersecting).forEach((e, n) => {
      const el = e.target; io.unobserve(el); el.style.animationDelay = `${Math.min(n * 70, 420)}ms`; el.classList.add('in')
      setTimeout(() => { el.classList.remove("rv", "in"); el.style.animationDelay = "" }, 1150)
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    // Sections that mount later (Later.jsx) announce themselves with appzeto:more
    const els = new Set()
    const scan = () => [...document.querySelectorAll(PICK)].filter(el => !els.has(el) && !el.closest('.top') && el.getBoundingClientRect().top > innerHeight).forEach(el => { els.add(el); el.classList.add('rv'); io.observe(el) })
    scan(); addEventListener('appzeto:more', scan)
    return () => { removeEventListener('appzeto:more', scan); io.disconnect(); els.forEach(el => el.classList.remove('rv', 'in')) }
  }, [key])
}
export function Progress() {
  const ref = useRef(null)
  useEffect(() => {
    let raf
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const d = document.documentElement; if (ref.current) ref.current.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, d.scrollHeight - innerHeight))})` }) }
    addEventListener('scroll', on, { passive: true }); on()
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', on) }
  }, [])
  return <i className="progress" ref={ref} aria-hidden="true" />
}
