import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PhoneBody, reduced, useLive } from './Brand.jsx'
import Crew, { SPEED } from './Crew.jsx'
import { RideMap } from './Ride.jsx'
import { Quick, Service, Hotel, Super, Ai } from './Scenes.jsx'
import { PanScene } from './Pizza.jsx'
import { products, allServices } from './data.js'

const I = '#06282A', T = '#06A4A5', Y = '#FAFD0F', G = '#33A77A', W = '#fff', M = '#DDF3EC'
const Tx = ({ x, y, s = 11, f = I, children, a }) => <text x={x} y={y} fontSize={s} fill={f} textAnchor={a} className="scr-t">{children}</text>
const Step = ({ y, n, t }) => <g><circle cx="26" cy={y} r="9" fill={M} /><g className={`st st${n}`}><circle cx="26" cy={y} r="9" fill={G} /><path d={`M21.500 ${y}l3.500 4 6-8`} fill="none" stroke={W} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></g><Tx x="44" y={y + 4}>{t}</Tx></g>
// The little apps that actually run. 158 x 244.
const apps = {
  food: <><path d="M0 0h158v244H0z" fill={W} /><path d="M0 0h158v132l-158 14z" fill={T} /><PanScene />
    <path d="M26 164v58" stroke={M} strokeWidth="4" /><Step y={164} n="1" t="Accepted" /><Step y={193} n="2" t="Cooking" /><Step y={222} n="3" t="On the way" /></>,
  taxi: <RideMap />,
  quick: <Quick />, service: <Service />, hotel: <Hotel />, super: <Super />, ai: <Ai />,
}
// Seconds each app stays on stage
const HOLD = { food: 6.5, taxi: 6.2, quick: 6.2, service: 6, hotel: 5.8, super: 5.6, ai: 5.6 }
const CLOCK = { food: '.pz-ride', taxi: '.cab' }
const chips = { food: ['Pizza’s on', 'Rider picked up'], taxi: ['Driver found', 'Pickup set'], quick: ['Milk added', 'Cart packed'], service: ['Expert found', 'Visit booked'], hotel: ['Rooms free', 'Room booked'], super: ['All in one', 'One login'], ai: ['Idea received', 'App ready'] }

const lines = [['Ideas in', 'Next-gen apps out'], ['Tomorrow’s tech', 'on today’s screen'], ['Think it', 'We’ll build what’s next'], ['Small idea', 'Next-generation app']]
function Tagline() {
  const [n, setN] = useState(0)
  useEffect(() => { if (reduced()) return; const t = setInterval(() => document.hidden || setN(x => (x + 1) % lines.length), 3600); return () => clearInterval(t) }, [])
  return <p className="tagl"><span className="sr">{lines.map(l => l.join(', ')).join('. ')}.</span><span aria-hidden="true"><b className="br">&lt;</b><span key={n} className="tg"><i>{lines[n][0]}</i><b className="sl">/</b><i>{lines[n][1]}</i></span><b className="br">&gt;</b></span></p>
}

export default function Hero() {
  const [i, setI] = useState(0), [run, setRun] = useState(0), [out, setOut] = useState(false), [auto, setAuto] = useState(true)
  const ref = useLive(), tilt = useRef(null), p = products[i]
  useEffect(() => { if (reduced()) { setOut(true); return } const t = setTimeout(() => setOut(true), 2300); return () => clearTimeout(t) }, [])
  useEffect(() => { if (reduced()) setAuto(false) }, [])
  const ctl = useRef({ mode: null }), anim = useRef({})
  ctl.current.paused = !auto
  // The phone's own animation is the clock, so the crew and the screen stay in step
  const clock = () => {
    const a = anim.current
    if (a.id !== p.id + run || !a.el?.isConnected) { a.id = p.id + run; a.el = ref.current?.querySelector('.app-in ' + (CLOCK[p.id] || '.clk')); a.an = a.el?.getAnimations()[0] }
    return a.an ? a.an.currentTime ?? 0 : 0
  }
  // Lets the crew restart the phone's scene at the right beat
  const seek = ms => { const el = ref.current?.querySelector('.app-in'); el?.getAnimations({ subtree: true }).forEach(a => { if (a.effect.target !== el) { a.playbackRate = SPEED; a.currentTime = ms } }) }
  useEffect(() => { if (out) { const t = setTimeout(() => ref.current?.querySelector('.app-in')?.getAnimations({ subtree: true }).forEach(a => { a.playbackRate = SPEED }), 60); return () => clearTimeout(t) } }, [p.id, run, out])
  const point = { onPointerEnter: () => { ctl.current.mode = 'point' }, onPointerLeave: () => { ctl.current.mode = null }, onFocus: () => { ctl.current.mode = 'point' }, onBlur: () => { ctl.current.mode = null } }
  const next = () => { setI(x => (x + 1) % products.length); setRun(r => r + 1) }
  const move = e => {
    if (reduced() || e.pointerType !== 'mouse') return
    const b = ref.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5
    tilt.current.style.setProperty('--mx', x.toFixed(3)); tilt.current.style.setProperty('--my', y.toFixed(3))
  }
  return <><section className="sh" ref={ref} onPointerMove={move}>
    <i className="sh-panel" aria-hidden="true" />
    <div className="wrap sh-grid">
      <div className="sh-copy">
        <h1>{['Next-gen tech,', 'built around', 'your idea.'].map((l, n) => <span className="ln" key={l}><span style={{ '--n': n }}>{l} </span></span>)}</h1>
        <Tagline />
        <p className="sh-sub">Food, taxi, quick commerce, services and hotels, separately or all in one app. Plus AI-driven custom projects.</p>
        <div className="row"><Link className="btn btn-k" to="/contact" {...point}>Tell us your idea</Link><Link className="txt" to="/services">See services</Link></div>
      </div>
      <div className="sh-stage" ref={tilt}>
        <svg viewBox="-60 -4 292 252" aria-hidden="true" className="sh-svg">
          <ellipse cx="86" cy="190" rx="66" ry="6" fill={I} opacity=".14" />
          <g className="sh-phone"><PhoneBody>{out && <g key={p.id} className="app-in"><g transform="translate(45 30.4) scale(.507)">{apps[p.id]}</g></g>}</PhoneBody></g>
          {out && <Crew id={p.id} clock={clock} ctl={ctl} seek={seek} />}
        </svg>
        {out && chips[p.id].map((c, n) => <span key={p.id + n} className={`chip chip${n}`} aria-hidden="true"><svg viewBox="0 0 20 20" width="18"><circle cx="10" cy="10" r="10" fill={G} /><path d="M5.500 10.500l3 3 6-7" fill="none" stroke={W} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" /></svg>{c}</span>)}
      </div>
      <div className="tabs"><div className="tabset" role="group" aria-label="Choose a platform to preview">{products.map((x, n) => <button key={x.id} aria-pressed={n === i} onClick={() => { setAuto(false); setOut(true); if (n !== i) { setI(n); setRun(r => r + 1) } }}><span>{x.short}</span>{n === i && auto && out && <i key={run} className="bar" style={{ animationDuration: `${HOLD[x.id] || 4.9}s` }} onAnimationEnd={next} />}</button>)}</div>
        <div className="tabs-more"><Link className="txt" to={p.path}>Open {p.name}</Link>{out && <button className="txt pause" onClick={() => setAuto(!auto)} aria-label={auto ? "Pause preview" : "Play preview"}><svg viewBox="0 0 20 20" width="22" aria-hidden="true"><path d={auto ? "M5 3h4v14H5zM11 3h4v14h-4z" : "M5 3l12 7-12 7z"} fill="currentColor" /></svg></button>}</div></div>
    </div>
  </section>
  <div className="ticker"><div className="tick-run">{[0, 1].map(k => <ul key={k} aria-hidden={k === 1}>{allServices.map(v => <li key={v.slug}>{v.name}<b aria-hidden="true">/</b></li>)}</ul>)}</div></div></>
}
