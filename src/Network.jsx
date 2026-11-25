'use client'
// Partner network: India in the brand's slipped-outline style, a pin per city, dashed routes
// from the Indore office, and counters. Moves only while on screen (.live); still otherwise.
import { useEffect, useRef, useState } from 'react'
import { Link } from './router.jsx'
import { reduced, useLive } from './Brand.jsx'

// Simplified outline, from longitude/latitude: x = (lon - 68) * 10, y = (37.5 - lat) * 10
const INDIA = 'M65 5L78 9L98 20L113 32L109 49L112 65L123 71L131 75L154 89L165 100L180 101L201 96L202 109L208 104L218 108L240 106L258 99L272 92L286 89L293 93L286 102L274 112L266 123L262 136L253 144L250 155L246 156L243 139L238 133L232 141L235 134L240 126L220 123L218 116L210 114L204 123L208 132L206 141L210 149L210 157L200 159L190 160L188 168L172 179L161 192L143 209L132 216L123 221L121 239L123 254L118 266L113 272L109 283L102 286L95 294L86 286L81 272L75 257L68 246L64 229L56 216L51 199L48 185L49 167L46 162L48 152L41 163L29 167L19 159L10 152L23 146L4 139L8 132L30 131L26 118L21 109L16 104L33 96L42 91L54 76L66 66L66 56L73 52L60 42L58 31L65 22L55 15Z'
const HQ = [78.6, 147.8]
const cities = [
  { n: 'Noida', t: 'Tech city', x: 93.9, y: 89.7, side: 1, dy: -4 },
  { n: 'Indore', t: 'Head office', x: HQ[0], y: HQ[1], side: -1, dy: -2, hq: true },
  { n: 'Mumbai', t: 'Finance core', x: 48.8, y: 184.2, side: -1, dy: 6 },
  { n: 'Pune', t: 'IT zone', x: 58.6, y: 189.8, side: 1, dy: 24 },
  { n: 'Hyderabad', t: 'Cyber park', x: 104.9, y: 201.1, side: 1, dy: -6 },
  { n: 'Bangalore', t: 'Startup valley', x: 95.9, y: 245.3, side: -1, dy: 14 },
]
const VB = { x: -12, y: -12, w: 318, h: 310 }
const pct = (x, y) => ({ left: `${((x - VB.x) / VB.w) * 100}%`, top: `${((y - VB.y) / VB.h) * 100}%` })
const stats = [[50, '+', 'Major cities'], [200, '+', 'Enterprise partners'], [15, 'k+', 'Active users'], [24, '/7', 'Regional support']]

function Count({ to, suf, go }) {
  const [n, setN] = useState(to)
  useEffect(() => {
    if (!go || reduced()) return
    let raf, t0
    const tick = t => { t0 ??= t; const k = Math.min(1, (t - t0) / 1300); setN(Math.round(to * (1 - (1 - k) ** 3))); if (k < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [go])
  return <>{n}{suf}</>
}

export default function Network({ join = true }) {
  const ref = useLive(), seen = useRef(false), [go, setGo] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen.current) { seen.current = true; setGo(true) } }, { threshold: .3 })
    io.observe(ref.current); return () => io.disconnect()
  }, [])
  return <section className="nw" ref={ref}><div className="wrap nw-grid">
    <div className="nw-copy">
      <p className="nw-eyebrow">Across India</p>
      <h2 className="h-xl">Appzeto <span className="nw-out">partners</span></h2>
      <p className="lead">Our partners work from big metros and growing tech hubs, so there’s someone near you wherever you build.</p>
      <dl className="nw-stats">{stats.map(([v, s, l]) => <div key={l}><dt><Count to={v} suf={s} go={go} /></dt><dd>{l}</dd></div>)}</dl>
      {join && <Link className="btn" to="/channel-partners">Join as a partner</Link>}
    </div>
    <div className="nw-map"><div className="nw-stage">
      <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-hidden="true">
        <path d={INDIA} transform="translate(5 5)" fill="#06282A" />
        <path d={INDIA} fill="#06A4A5" stroke="#06282A" strokeWidth="2.400" strokeLinejoin="round" />
        {cities.filter(c => !c.hq).map((c, i) => <path key={c.n} className="nw-route" style={{ animationDelay: `${.5 + i * .25}s` }} pathLength="1" d={`M${HQ[0]} ${HQ[1]}Q${(HQ[0] + c.x) / 2 + 14} ${(HQ[1] + c.y) / 2 - 16} ${c.x} ${c.y}`} fill="none" stroke="#FAFD0F" strokeWidth="2" strokeDasharray=".02 .02" />)}
        {cities.map((c, i) => <g key={c.n}>
          <path className="nw-lead" style={{ animationDelay: `${.35 + i * .25}s` }} d={`M${c.x} ${c.y}L${c.x + c.side * 22} ${c.y + c.dy}`} stroke="#06282A" strokeWidth="1.600" strokeDasharray="2 2.500" />
          <g transform={`translate(${c.x} ${c.y})`}><circle className="nw-ring" style={{ animationDelay: `${i * .3}s` }} r={c.hq ? 9 : 6} fill="none" stroke={c.hq ? '#FAFD0F' : '#06282A'} strokeWidth="2" />
            <g className="nw-pin" style={{ animationDelay: `${.3 + i * .25}s` }}><circle r={c.hq ? 8 : 5.500} fill={c.hq ? '#06282A' : '#FAFD0F'} stroke="#06282A" strokeWidth="2" />{c.hq && <circle r="3.500" fill="#FAFD0F" />}</g></g>
        </g>)}
      </svg>
      {cities.map((c, i) => <span key={c.n} className={`nw-tag ${c.side < 0 ? 'l' : 'r'}${c.hq ? ' hq' : ''}`} style={{ ...pct(c.x + c.side * 22, c.y + c.dy), animationDelay: `${.45 + i * .25}s` }}><b>{c.n}</b> <i>{c.t}</i></span>)}
    </div></div>
  </div></section>
}
