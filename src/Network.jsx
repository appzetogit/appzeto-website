'use client'
// Partner network: India in the brand's slipped-outline style, a pin per city, dashed routes
// from the Indore office, and counters. Moves only while on screen (.live); still otherwise.
import { useEffect, useRef, useState } from 'react'
import { Link } from './router.jsx'
import { reduced, useLive } from './Brand.jsx'

// Simplified outline, from longitude/latitude: x = (lon - 68) * 10, y = (37.5 - lat) * 10
const INDIA = 'M66 4C70.1 4.5 75 6.8 79 9C83 11.2 84.6 14.2 88 16C91.4 17.8 94.8 19 98 19C101.2 19 102.8 16.2 106 16C109.2 15.8 112.9 17.1 116 18C119.1 18.9 121.9 19 123 21C124.1 23 123.3 26.5 122 29C120.7 31.5 117.4 32.3 116 35C114.6 37.7 115.3 41.5 114 44C112.7 46.5 109.4 45.6 109 49C108.6 52.4 109.5 59 112 63C114.5 67 119.6 68.8 123 71C126.4 73.2 126.9 73 131 75C135.1 77 141 79.1 146 82C151 84.9 154.3 87.9 159 91C163.7 94.1 167.5 97 172 99C176.5 101 178.8 102.5 184 102C189.2 101.5 197.8 95.1 201 96C204.2 96.9 200.6 105.7 202 107C203.4 108.3 205.9 103 209 103C212.1 103 213.8 106.5 219 107C224.2 107.5 230.8 107.6 238 106C245.2 104.4 252.7 100.7 259 98C265.3 95.3 268 92.6 273 91C278 89.4 283.4 88.5 287 89C290.6 89.5 293.5 91.3 293 94C292.5 96.7 287.6 100.9 284 104C280.4 107.1 276.2 107.8 273 111C269.8 114.2 268 117.5 266 122C264 126.5 264.2 132.2 262 136C259.8 139.8 256 139.9 254 143C252 146.1 252.4 150.7 251 153C249.6 155.3 247.4 158.2 246 156C244.6 153.8 244.4 143 243 141C241.6 139 239.8 145.5 238 145C236.2 144.5 232.8 140.3 233 138C233.2 135.7 237.6 134.2 239 132C240.4 129.8 242.3 127.6 241 126C239.7 124.4 235.8 123.5 232 123C228.2 122.5 222.5 124.3 220 123C217.5 121.7 219.8 117.6 218 116C216.2 114.4 212.5 113.1 210 114C207.5 114.9 204.5 117.9 204 121C203.5 124.1 206.6 127.6 207 131C207.4 134.4 205.5 136.9 206 140C206.5 143.1 209.5 144.8 210 148C210.5 151.2 211 156 209 158C207 160 202.4 158.6 199 159C195.6 159.4 192 158.4 190 160C188 161.6 191.1 164.8 188 168C184.9 171.2 177.9 173.9 173 178C168.1 182.1 166.2 185.6 161 191C155.8 196.4 149 203.5 144 208C139 212.5 136.8 213.5 133 216C129.2 218.5 125.2 217.9 123 222C120.8 226.1 121 233.4 121 239C121 244.6 123.5 248.1 123 253C122.5 257.9 119.8 262.6 118 266C116.2 269.4 114.6 268.9 113 272C111.4 275.1 111 280.5 109 283C107 285.5 104.5 284 102 286C99.5 288 97.9 294 95 294C92.1 294 88.5 290 86 286C83.5 282 83 277.2 81 272C79 266.8 77.3 261.7 75 257C72.7 252.3 70 251 68 246C66 241 66.2 234.4 64 229C61.8 223.6 58.3 221.4 56 216C53.7 210.6 52.4 204.6 51 199C49.6 193.4 48.4 190.8 48 185C47.6 179.2 49.4 171.3 49 167C48.6 162.7 46.4 163.7 46 161C45.6 158.3 47.7 151.8 47 152C46.3 152.2 44.7 159.3 42 162C39.3 164.7 36 167.2 32 167C28 166.8 24 163.7 20 161C16 158.3 9.6 154.7 10 152C10.4 149.3 22.7 148 22 146C21.3 144 9.2 142.4 6 141C2.8 139.6 2.9 139.6 4 138C5.1 136.4 7.3 133.4 12 132C16.7 130.6 27.5 132.5 30 130C32.5 127.5 27.6 121.8 26 118C24.4 114.2 22.8 111.7 21 109C19.2 106.3 13.8 105.3 16 103C18.2 100.7 28.3 98.3 33 96C37.7 93.7 38.2 93.6 42 90C45.8 86.4 49.7 80.3 54 76C58.3 71.7 63.8 69.6 66 66C68.2 62.4 64.7 58.5 66 56C67.3 53.5 73 53.6 73 52C73 50.4 68.9 49 66 47C63.1 45 59 43.7 57 41C55 38.3 55.2 35.1 55 32C54.8 28.9 57.6 26.3 56 24C54.4 21.7 48 21.5 46 19C44 16.5 43.2 12.3 45 10C46.8 7.7 52.2 7.1 56 6C59.8 4.9 61.9 3.5 66 4Z'
const HQ = [78.6, 147.8]
const cities = [
  { n: 'Noida', t: 'Tech city', x: 93.9, y: 89.7, side: 1, dy: -4 },
  { n: 'Indore', t: 'Head office', x: HQ[0], y: HQ[1], side: -1, dy: -2, hq: true },
  { n: 'Mumbai', t: 'Finance core', x: 48.8, y: 184.2, side: -1, dy: 6 },
  { n: 'Pune', t: 'IT zone', x: 58.6, y: 189.8, side: 1, dy: 24 },
  { n: 'Hyderabad', t: 'Cyber park', x: 104.9, y: 201.1, side: 1, dy: -6 },
  { n: 'Bangalore', t: 'Startup valley', x: 95.9, y: 245.3, side: -1, dy: 14 },
]
const VB = { x: -78, y: -12, w: 388, h: 318 }
const pct = (x, y) => ({ left: `${((x - VB.x) / VB.w) * 100}%`, top: `${((y - VB.y) / VB.h) * 100}%` })
const route = c => `M${HQ[0]} ${HQ[1]}Q${(HQ[0] + c.x) / 2 + 14} ${(HQ[1] + c.y) / 2 - 16} ${c.x} ${c.y}`
// Rockets: one launch per city, back to back, each a fast hop along its route
const HOP = 1.1, FLY = .75, legs = cities.filter(c => !c.hq), LOOP = legs.length * HOP
const Rocket = () => <g><path className="nw-flame" d="M-8-3L-17 0-8 3Z" fill="#F39A2B" stroke="#06282A" strokeWidth="1.200" strokeLinejoin="round" /><path d="M-6-5L-10-8V-3ZM-6 5L-10 8V3Z" fill="#D9482B" stroke="#06282A" strokeWidth="1.200" strokeLinejoin="round" /><path d="M-9-4H3Q10-4 13 0Q10 4 3 4H-9Z" fill="#fff" stroke="#06282A" strokeWidth="1.600" strokeLinejoin="round" /><path d="M7-2.800Q10.500-2 13 0Q10.500 2 7 2.800Z" fill="#D9482B" /><circle cx="1" r="2.200" fill="#06A4A5" stroke="#06282A" strokeWidth="1.200" /></g>
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
  const ref = useLive(), svg = useRef(null), seen = useRef(false), [go, setGo] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen.current) { seen.current = true; setGo(true) } }, { threshold: .3 })
    io.observe(ref.current); return () => io.disconnect()
  }, [])
  // The rockets (SVG animation) only fly while the map is on screen, and never with reduced motion
  useEffect(() => {
    const s = svg.current; if (reduced()) { s.pauseAnimations(); return }
    const io = new IntersectionObserver(([e]) => e.isIntersecting ? s.unpauseAnimations() : s.pauseAnimations())
    io.observe(s); return () => io.disconnect()
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
      <svg ref={svg} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-hidden="true">
        <path d={INDIA} transform="translate(5 5)" fill="#06282A" />
        <path d={INDIA} fill="#06A4A5" stroke="#06282A" strokeWidth="2.400" strokeLinejoin="round" />
        {cities.filter(c => !c.hq).map((c, i) => <path key={c.n} className="nw-route" style={{ animationDelay: `${.5 + i * .25}s` }} pathLength="1" d={route(c)} fill="none" stroke="#FAFD0F" strokeWidth="2" strokeDasharray=".02 .02" />)}
        {cities.map((c, i) => <g key={c.n}>
          <path className="nw-lead" style={{ animationDelay: `${.35 + i * .25}s` }} d={`M${c.x} ${c.y}L${c.x + c.side * 22} ${c.y + c.dy}`} stroke="#06282A" strokeWidth="1.600" strokeDasharray="2 2.500" />
          <g transform={`translate(${c.x} ${c.y})`}><circle className="nw-ring" style={{ animationDelay: `${i * .3}s` }} r={c.hq ? 9 : 6} fill="none" stroke={c.hq ? '#FAFD0F' : '#06282A'} strokeWidth="2" />
            <g className="nw-pin" style={{ animationDelay: `${.3 + i * .25}s` }}><circle r={c.hq ? 8 : 5.500} fill={c.hq ? '#06282A' : '#FAFD0F'} stroke="#06282A" strokeWidth="2" />{c.hq && <circle r="3.500" fill="#FAFD0F" />}</g></g>
        </g>)}
        {legs.map((c, i) => { const a = (i * HOP / LOOP).toFixed(4), b = ((i * HOP + FLY) / LOOP).toFixed(4), e = (Math.min(1, (i * HOP + FLY + .08) / LOOP)).toFixed(4)
          return <g key={c.n} className="nw-rocket" opacity="0">
            <animate attributeName="opacity" dur={LOOP + 's'} repeatCount="indefinite" calcMode="discrete" keyTimes={`0;${a};${e}`} values="0;1;0" />
            <animateMotion dur={LOOP + 's'} repeatCount="indefinite" rotate="auto" calcMode="spline" keyTimes={`0;${a};${b};1`} keyPoints="0;0;1;1" keySplines="0 0 1 1;.5 0 .3 1;0 0 1 1" path={route(c)} />
            <g transform="scale(1.25)"><Rocket /></g></g> })}
      </svg>
      {cities.map((c, i) => <span key={c.n} className={`nw-tag ${c.side < 0 ? 'l' : 'r'}${c.hq ? ' hq' : ''}`} style={{ ...pct(c.x + c.side * 22, c.y + c.dy), animationDelay: `${.45 + i * .25}s` }}><b>{c.n}</b> <i>{c.t}</i></span>)}
    </div></div>
  </div></section>
}
