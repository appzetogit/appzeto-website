import { useEffect, useRef, useState } from 'react'
import Eyes from './Eyes.jsx'
import { useLocation } from 'react-router-dom'
import { Letter, LetterA, PhoneBody, Phone, reduced } from './Brand.jsx'

// Opening: the loader phone lights up, the A drops in, the letters pop out, the page is wiped clear.
export function Opening() {
  const [st, setSt] = useState(() => reduced() ? 'gone' : 'play')
  useEffect(() => {
    if (st === 'gone') return
    const t = setTimeout(() => setSt(st === 'play' ? 'leave' : 'gone'), st === 'play' ? 2000 : 1000)
    const skip = () => setSt(s => s === 'play' ? 'leave' : s)
    addEventListener('keydown', skip); addEventListener('pointerdown', skip); addEventListener('wheel', skip, { passive: true })
    return () => { clearTimeout(t); removeEventListener('keydown', skip); removeEventListener('pointerdown', skip); removeEventListener('wheel', skip) }
  }, [st])
  useEffect(() => { document.documentElement.classList.toggle('opening', st === 'play') }, [st])
  if (st === 'gone') return null
  return <div className={`open ${st}`} aria-hidden="true"><i className="ol l3" /><i className="ol l2" /><div className="ol l1">
    <svg viewBox="36 -20 540 240"><g className="op-phone"><PhoneBody /><g className="op-a"><LetterA /></g></g>
      {['p1', 'p2', 'z', 'e', 't', 'o'].map((k, i) => <g key={k} className="op-l" style={{ animationDelay: `${980 + i * 75}ms` }}><Letter k={k} /></g>)}</svg>
  </div></div>
}

// Between pages: a slanted panel rises, the page swaps underneath, the panel leaves.
export function usePageSwap() {
  const loc = useLocation(), [shown, setShown] = useState(loc), [phase, setPhase] = useState('idle')
  useEffect(() => {
    if (loc === shown) return
    if (loc.pathname === shown.pathname || reduced()) { setShown(loc); setPhase('idle'); return }
    setPhase('cover')
    const t = setTimeout(() => { setShown(loc); setPhase('clear') }, 480)
    return () => clearTimeout(t)
  }, [loc])
  useEffect(() => { if (phase === 'clear') { const t = setTimeout(() => setPhase('idle'), 620); return () => clearTimeout(t) } }, [phase])
  return [shown, phase]
}
export const Curtain = ({ phase }) => <div className={`curtain ${phase}`} aria-hidden="true"><div className="cur-in"><Phone><g className="cur-a"><LetterA /><Eyes r={17} /></g></Phone></div></div>

// Scroll motion. Elements are only hidden once this has run, so nothing depends on it.
const PICK = '.pr-phone,.pr-roles li,.h-xl,.h-l,.big-text,.prod-intro .lead,.band .lead,.band .btn,.roles>div,.taxi-roles>div,.care-list li,.band-grid>.phone,.svc-list li,.svc-phone,.how-list li,.panel,.faq details,.reach li,.device,.role-row,.svc-row,.more-list li,.ticks li,.others a,.sec .form'
export function useReveal(key) {
  useEffect(() => {
    if (reduced() || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(es => es.filter(e => e.isIntersecting).forEach((e, n) => {
      const el = e.target; io.unobserve(el); el.style.animationDelay = `${Math.min(n * 70, 420)}ms`; el.classList.add('in')
      setTimeout(() => { el.classList.remove("rv", "in"); el.style.animationDelay = "" }, 1150)
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    const els = [...document.querySelectorAll(PICK)].filter(el => !el.closest('.top') && el.getBoundingClientRect().top > innerHeight)
    els.forEach(el => { el.classList.add('rv'); io.observe(el) })
    return () => { io.disconnect(); els.forEach(el => el.classList.remove('rv', 'in')) }
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
