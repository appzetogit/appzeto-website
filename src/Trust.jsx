'use client'
// Trust strip on the home page: four counters that count up and pop confetti when they land,
// and a Google rating card whose stars fill in. Runs once, when the strip comes on screen.
import { useEffect, useRef, useState } from 'react'
import { reduced } from './Brand.jsx'

// Edit the numbers here. [target, suffix, label]
const STATS = [[1000, '+', 'Happy clients'], [50, '+', 'Cities'], [100, 'k+', 'Active users'], [24, '/7', 'Support']]
const RATING = 4.35
const GOOGLE_URL = '' // your Google Business review link; the card becomes a link once this is set

const BITS = 18, COLORS = ['#FAFD0F', '#06A4A5', '#06282A', '#33A77A', '#fff']

function Tile({ to, suf, label, go, delay }) {
  const [n, setN] = useState(to), [pop, setPop] = useState(false)
  useEffect(() => {
    if (!go) return
    if (reduced()) { setN(to); return }
    let raf, t0, timer = setTimeout(() => {
      setN(0)
      const tick = t => {
        t0 ??= t; const k = Math.min(1, (t - t0) / 1400)
        setN(Math.round(to * (1 - (1 - k) ** 3)))
        if (k < 1) raf = requestAnimationFrame(tick); else setPop(true)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [go])
  return <div className={`tr-tile${pop ? ' pop' : ''}`}>
    <dt><span className="tr-num">{n.toLocaleString('en-IN')}</span>{suf}</dt><dd>{label}</dd>
    {pop && <i className="tr-burst" aria-hidden="true">{Array.from({ length: BITS }, (_, i) => {
      const a = (i / BITS) * Math.PI * 2 + .3, d = 70 + (i * 37) % 60
      return <b key={i} style={{ '--dx': `${(Math.cos(a) * d).toFixed(0)}px`, '--dy': `${(Math.sin(a) * d - 30).toFixed(0)}px`, '--r': `${i * 47 % 360}deg`, background: COLORS[i % COLORS.length], borderRadius: i % 3 ? '2px' : '50%' }} />
    })}</i>}
  </div>
}

const G = () => <svg viewBox="0 0 48 48" aria-hidden="true" className="tr-g">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
</svg>

function Rating({ go }) {
  const stars = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, RATING - i)))
  const body = <>
    <div className="tr-g-head"><G /><span>Google</span></div>
    <div className="tr-score">{RATING.toFixed(2)}</div>
    <div className="tr-stars" role="img" aria-label={`Rated ${RATING} out of 5 on Google`}>
      {stars.map((f, i) => <span key={i} className="tr-star" style={{ '--f': `${f * 100}%`, '--d': `${300 + i * 160}ms` }}><svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg></span>)}
    </div>
    <p className="tr-sub">Rated by our clients on Google</p>
  </>
  const cls = `tr-rating${go ? ' go' : ''}`
  return GOOGLE_URL ? <a className={cls} href={GOOGLE_URL} target="_blank" rel="noopener noreferrer">{body}</a> : <div className={cls}>{body}</div>
}

export default function Trust() {
  const ref = useRef(null), [go, setGo] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect() } }, { threshold: .35 })
    io.observe(ref.current); return () => io.disconnect()
  }, [])
  return <section className="trust" ref={ref} aria-label="Appzeto in numbers"><div className="wrap trust-in">
    <dl className="tr-tiles">{STATS.map(([v, s, l], i) => <Tile key={l} to={v} suf={s} label={l} go={go} delay={i * 160} />)}</dl>
    <Rating go={go} />
  </div></section>
}
