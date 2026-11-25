'use client'
import { useEffect, useState } from 'react'
import { Link } from './router.jsx'
import { LetterA, reduced } from './Brand.jsx'
import Eyes from './Eyes.jsx'
import s from './settings.js'

export const waLink = s.whatsapp && `https://wa.me/${s.whatsapp}?text=${encodeURIComponent('Hi Appzeto, I have an idea.')}`
export const WaIcon = () => <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4a12 12 0 0 0-10.300 18.100L4 28l6.100-1.600A12 12 0 1 0 16 4z" fill="#fff" stroke="#06282A" strokeWidth="2" strokeLinejoin="round" /><path d="M12 9.500c-.6 0-2.200 1-2.200 3.200 0 4.600 5 9.600 9.600 9.600 2.200 0 3.200-1.600 3.200-2.300l-.2-.9-3.100-1.600-1.600 1.700c-2-.7-4-2.700-4.700-4.700l1.700-1.600-1.500-3.200z" fill="#06282A" /></svg>
const lines = ['Inquire now', 'Let’s build?', 'Got an idea?', 'Ask for a demo']
// Phones only (CSS). Steps aside while the contact form is on screen or someone is typing.
export default function Sticky({ path }) {
  const [n, setN] = useState(0), [away, setAway] = useState(true)
  useEffect(() => {
    if (reduced()) return
    const t = setInterval(() => document.hidden || setN(x => (x + 1) % lines.length), 2600)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    setAway(true)
    let typing = false, seen = false, top = path === '/' && scrollY < 260
    const set = () => setAway(typing || seen || (top && innerWidth <= 640))
    const fi = e => { typing = e.target.matches('input,textarea,select'); set() }, fo = () => { typing = false; set() }
    const sc = () => { const t = path === '/' && scrollY < 260; if (t !== top) { top = t; set() } }
    addEventListener('scroll', sc, { passive: true }); document.addEventListener('focusin', fi); document.addEventListener('focusout', fo)
    const io = new IntersectionObserver(es => { es.forEach(e => e.target.dataset.on = e.isIntersecting ? 1 : ''); seen = [...document.querySelectorAll('.form')].some(f => f.dataset.on); set() })
    const t = setTimeout(() => { document.querySelectorAll('.form').forEach(f => io.observe(f)); set() }, 900)
    return () => { clearTimeout(t); io.disconnect(); removeEventListener('scroll', sc); document.removeEventListener('focusin', fi); document.removeEventListener('focusout', fo) }
  }, [path])
  return <div className={`stk ${away ? 'away' : ''}`} inert={away}>
    <Link className="stk-in" to="/contact" aria-label="Inquire now"><svg className="stk-a" viewBox="40 30 92 124" aria-hidden="true"><g className="stk-hop"><LetterA /><Eyes r={17} /></g></svg><span className="stk-w" aria-hidden="true"><b key={n}>{lines[n]}</b></span><svg className="stk-go" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 3l7 7-7 7" /></svg></Link>
    {waLink && <a className="stk-wa" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><WaIcon /></a>}
  </div>
}
