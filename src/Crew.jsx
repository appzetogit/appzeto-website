import { useEffect, useRef } from 'react'
import { LETTERS, Glove, letterPath } from './Mascot.jsx'
import { Burger, CabBack, CabFront, FOOD, TAXI, food, hideShows, taxi } from './Shows.jsx'
import { AI, HOTEL, QUICK, SERVICE, SUPER, SetBacks, SetFronts, ai, hotel, quick, service, superShow } from './Shows2.jsx'

// Everything on stage, and the phone's own scenes, run at this speed
export const SPEED = 1.7
const SHOW = { taxi: [taxi, TAXI], food: [food, FOOD], quick: [quick, QUICK], service: [service, SERVICE], hotel: [hotel, HOTEL], super: [superShow, SUPER], ai: [ai, AI] }

const I = '#06282A', T = '#06A4A5', D = '#0D5353', W = '#fff', Y = '#FAFD0F', G = '#33A77A', R = '#D9482B', C = '#FFD84A'
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const rd = { strokeLinecap: 'round', strokeLinejoin: 'round' }

// Who plays in each app: [letter, hat]
export const WORDS = {
  food: [['F', 'chef'], ['O', 'paper'], ['O', 'bandana'], ['D', 'helmet']],
  taxi: [['T', 'cab'], ['A', 'sun'], ['Xx', 'police'], ['I', 'cap']],
  quick: [['Q', 'helmet'], ['U', 'paper'], ['I', 'cap'], ['C', 'bandana'], ['K', 'helmet']],
  service: [['F', 'hard'], ['I', 'cap'], ['Xx', 'bandana'], ['I', 'hard'], ['T', 'hard']],
  hotel: [['H', 'bell'], ['O', 'sun'], ['T', 'chef'], ['E', 'bell'], ['L', 'paper']],
  super: [['A', 'crown'], ['L', 'crown'], ['L', 'crown']],
  ai: [['A', 'robot'], ['I', 'robot']],
}
const HAT_AT = { F: [56, 7], T: [50, 8], Q: [50, 12], H: [22, 6], A: [50, 6], O: [50, 10], D: [42, 8], I: [50, 8], U: [20, 8], C: [52, 10], K: [26, 8], E: [52, 7], L: [32, 8], Xx: [24, 8] }
const WIDE = { I: 70, L: 96, F: 98, E: 98, O: 110, Q: 110, D: 106, A: 106, K: 106, H: 108, U: 108, C: 104, T: 106, Xx: 104 }
const SIZE = { 2: .76, 3: .72, 4: .6, 5: .51 }
const FLOOR = 236, PHONE = [86, 92], MAX = 5

const Hats = {
  chef: <><path d="M-20 0C-36-8-30-27-15-24C-11-36 11-36 15-24C30-27 36-8 20 0Z" fill={W} stroke={I} strokeWidth="2.600" /><path d="M-20-2Q0 3 20-2V9Q0 13-20 9Z" fill={W} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /></>,
  cab: <><path d="M-25 2C-30-14-18-20 0-20S30-14 25 2Z" fill={Y} stroke={I} strokeWidth="2.600" /><path d="M-27 0Q0 7 27 0L34 7Q0 17-34 7Z" fill={I} /><rect x="-9" y="-14" width="18" height="9" rx="3" fill={G} stroke={I} strokeWidth="2" /></>,
  helmet: <><path d="M-29 6C-31-26 31-26 29 6Q0-2-29 6Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M-6-17Q0-19 6-17L7 1H-7z" fill={W} stroke={I} strokeWidth="2" /></>,
  hard: <><path d="M-27 2C-27-27 27-27 27 2Z" fill={Y} stroke={I} strokeWidth="2.600" /><path d="M-33 1H35Q37 8 30 8H-28Q-35 8-33 1Z" fill={Y} stroke={I} strokeWidth="2.600" /><path d="M-5-20h10V1H-5z" fill="#E4D70A" stroke={I} strokeWidth="2" /></>,
  bell: <><path d="M-19 4V-12Q0-18 19-12V4Q0 8-19 4Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M-19-2Q0 3 19-2V4Q0 8-19 4Z" fill={C} stroke={I} strokeWidth="2" /></>,
  crown: <><path d="M-19 4L-22-18L-9-7L0-24L9-7L22-18L19 4Q0 9-19 4Z" fill={C} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><circle cy="-3" r="3.500" fill={R} /></>,
  robot: <><path d="M0 2V-14" stroke={I} strokeWidth="4" /><circle cy="-19" r="7" fill={Y} stroke={I} strokeWidth="2.600" className="bulb" /><path d="M-18 4Q0-6 18 4" fill="none" stroke={I} strokeWidth="5" {...rd} /></>,
  paper: <><path d="M-24 4L-17-15H17L24 4Q0 10-24 4Z" fill={W} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-22-1Q0 5 22-1" fill="none" stroke={T} strokeWidth="4" /></>,
  bandana: <><path d="M-26 5C-24-20 24-20 26 5Q0-2-26 5Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M24 2L38-4 36 8Z" fill={R} stroke={I} strokeWidth="2.200" strokeLinejoin="round" />{[-12, 0, 12].map(x => <circle key={x} cx={x} cy={-5 - (x ? 0 : 3)} r="2.200" fill={W} />)}</>,
  police: <><path d="M-30-8Q-28-24 0-24T30-8L22 2H-22Z" fill="#23407A" stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-24 1Q0 8 24 1L28 8Q0 16-28 8Z" fill={I} /><path d="M0-19l3 6 6 .5-5 4 2 6-6-3.500-6 3.500 2-6-5-4 6-.5z" fill={C} /></>,
  sun: <><path d="M-18 1C-18-22 18-22 18 1Z" fill="#F0CE8B" stroke={I} strokeWidth="2.600" /><path d="M-18-3Q0 2 18-3V2Q0 7-18 2Z" fill={R} /><ellipse cy="3" rx="37" ry="7" fill="#F0CE8B" stroke={I} strokeWidth="2.600" /></>,
  cap: <><path d="M-22 3C-22-22 22-22 22 3Z" fill={G} stroke={I} strokeWidth="2.600" /><path d="M16 1Q36-2 42 6Q28 9 14 5Z" fill={I} /></>,
}
const Props = {
  tray: <><path d="M-26 4H26Q22 11 0 11T-26 4Z" fill="#C9D3D8" stroke={I} strokeWidth="2.400" /><ellipse cy="2" rx="20" ry="6" fill={C} stroke="#E39A3B" strokeWidth="3" /><circle cx="-7" cy="1" r="2.500" fill={R} /><circle cx="6" cy="2.500" r="2.500" fill={R} /></>,
  bag: <><path d="M-17-30H17L20 4H-20Z" fill={R} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-8-30q0-9 8-9t8 9" fill="none" stroke={I} strokeWidth="3" /><circle cy="-13" r="8" fill={C} stroke={I} strokeWidth="2" /></>,
  slice: <><path d="M-14-8h28L0-38z" fill={C} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-16-8h32" stroke="#E39A3B" strokeWidth="7" strokeLinecap="round" /><circle cx="-2" cy="-18" r="4" fill={R} /></>,
  wrench: <path d="M-3-6V-34Q-14-38-11-50L-4-44H4L11-50Q14-38 3-34V-6Z" fill="#C9D3D8" stroke={I} strokeWidth="2.600" strokeLinejoin="round" />,
  brush: <><path d="M-2.500 0h5V-30h-5z" fill="#E39A3B" stroke={I} strokeWidth="2" /><path d="M-13-32H13L10-50H-10Z" fill={T} stroke={I} strokeWidth="2.400" strokeLinejoin="round" /></>,
  hammer: <><path d="M-2.500 0h5V-36h-5z" fill="#E39A3B" stroke={I} strokeWidth="2" /><path d="M-15-50H13V-36H-15Z" fill="#8FA0A8" stroke={I} strokeWidth="2.400" strokeLinejoin="round" /></>,
  stop: <><path d="M-2 0h4V-26h-4z" fill="#8FA0A8" stroke={I} strokeWidth="1.800" /><path d="M-9-56H9L20-46V-34L9-24H-9L-20-34V-46Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M-11-40H11" stroke={W} strokeWidth="6" strokeLinecap="round" /></>,
  case: <><rect x="-21" y="2" width="42" height="30" rx="6" fill="#8A5A3B" stroke={I} strokeWidth="2.600" /><path d="M-8 2V-5H8V2M-10 2V32M10 2V32" fill="none" stroke={I} strokeWidth="2.600" /></>,
  wheel: <><circle cy="-4" r="20" fill="none" stroke="#14181B" strokeWidth="6" /><path d="M-18-4H18M0-4V14" stroke="#14181B" strokeWidth="5" /></>,
}
const Items = {
  apple: <><path d="M0-7C-6-13-15-8-14 2C-13 11-6 18 0 14C6 18 13 11 14 2C15-8 6-13 0-7Z" fill={R} stroke={I} strokeWidth="2" /><path d="M0-7q0-6 4-9" fill="none" stroke={I} strokeWidth="2" /><path d="M3-11q7-5 10 0q-6 4-10 0z" fill={G} /></>,
  case2: <g transform="translate(0 -16)">{Props.case}</g>,
  ...Object.fromEntries([R, C, G, W].map((c, i) => ['tile' + i, <rect key={i} x="-12" y="-12" width="24" height="24" rx="7" fill={c} stroke={I} strokeWidth="2.600" />])),
  ...Object.fromEntries([0, 1, 2].map(i => ['spark' + i, <path key={i} d="M0-11L3-3 11 0 3 3 0 11-3 3-11 0-3-3Z" fill={i % 2 ? W : C} stroke={I} strokeWidth="2" strokeLinejoin="round" />])),
}

const ease = t => t < .5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2, lerp = (a, b, t) => a + (b - a) * t, cl = (n, a, b) => Math.max(a, Math.min(b, n))
const bump = (u, a, b) => u > a && u < b ? Math.sin((u - a) / (b - a) * Math.PI) : 0
const ramp = (u, a, b) => cl((u - a) / (b - a), 0, 1)

function slots(word) {
  const n = word.length, s = SIZE[n], w = word.map(([l]) => (WIDE[l] || 104) * s), tot = w.reduce((a, b) => a + b, 0)
  let x = 86 - tot / 2
  return w.map(q => { const c = x + q / 2; x += q; return { x: c, s } })
}

// One letter's pose at this moment. ms: phone clock. Hands are in the letter's own 100 x 130 space.
function pose(id, i, n, l, ms, t) {
  const [lx, ly, rx, ry] = LETTERS[l].a, sec = t / 1000
  const p = { hl: [lx - 17, ly + 22, -150], hr: [rx + 17, ry + 22, 150], m: [9, 8, 0], look: null, lid: 1, dx: 0, dy: 0, rot: 0, into: 0, pl: null, pr: null }
  const up = (k = 0) => { p.hl = [lx - 22, ly - 50 + Math.sin(sec * 15 + i) * 7, -15]; p.hr = [rx + 22, ry - 50 - Math.sin(sec * 15 + i) * 7, 15]; p.m = [11, 13, 9]; p.dy = -Math.abs(Math.sin(sec * 7 + i * .7 + k)) * 16 }
  const wave = () => { const o = Math.sin(sec * 11 + i) * 7; p.hr = [rx + 21 + o, ry - 46, 10 + o * 3]; p.m = [10, 11, 7] }
  const thumb = () => { p.hr = [rx + 22, ry - 18 + Math.sin(sec * 5 + i) * 2, 90]; p.m = [11, 12, 4] }
  if (ms == null) { wave(); return p }
  const u = (ms % 5200) / 5200
  if (id === 'food') {
    const fly = Math.max(bump(u, .17, .33), bump(u, .43, .59)), jerk = Math.max(bump(u, .14, .22), bump(u, .4, .48))
    p.look = [i < 2 ? .5 : -.4, -.75 - fly * .25]
    if (u < .62) {
      if (i === 0) { p.hr = [rx + 18, ry - 6 - jerk * 40, 50]; p.hl = [lx - 14, ly - 4 - fly * 30, -110]; p.rot = jerk * -7; p.m = fly > .2 ? [8, 8, 9] : [9, 9, 2] }
      else { p.dy = -fly * 9; p.m = fly > .25 ? [6, 6, 9] : [8, 8, 1]; p.hl = [lx - 14, ly + 10 - fly * 34, -140 + fly * 110]; p.hr = [rx + 14, ry + 10 - fly * 34, 140 - fly * 110] }
    } else if (u < .76) {
      const at = u < .67 ? 1 : 2
      if (i === 3) { p.hl = [lx - 24, ly - 20, -60]; p.look = [-1, 0]; p.m = [10, 11, 7]; p.dy = -Math.abs(Math.sin(sec * 9)) * 6 }
      else if (i === at) { p.pr = 'tray'; p.hr = [rx + 6, ry - 92, 0]; p.dx = bump(u, .62, .76) * 8; p.look = [1, -.2]; p.m = [10, 11, 5] }
      else if (i === 0) up(); else { p.look = [i < at ? 1 : -1, -.1]; p.hl = [lx - 20, ly - 6, -70] }
    } else if (i === 3) { p.into = u < .95 ? ease(ramp(u, .76, .82)) : 1 - ease(ramp(u, .95, 1)); p.pr = u < .9 ? 'bag' : null; p.hr = [rx + 12, ry + 4, 40]; p.m = [10, 12, 5]; p.look = [0, -1] }
    else { wave(); p.look = [.3, -.8]; if (i === 0 && u > .84) { p.pl = 'slice'; p.hl = [lx + 2, ly - 18 + Math.sin(sec * 13), -25]; p.m = [8, 5, 4 + Math.sin(sec * 13) * 4] } }
  } else if (id === 'taxi') {
    p.look = [0, -.6]
    if (i === 0) { p.pr = 'wheel'; const s = Math.sin(sec * 3.2); p.hr = [rx + 10, ry - 8, s * 26]; p.hl = [lx + 12, ly - 8 + s * 6, -40]; p.rot = s * 5; p.dy = -Math.abs(Math.sin(sec * 9)) * 3; p.look = [.8, -.3] }
    if (i === 1) { if (ms < 2400) { wave(); p.dy = -Math.abs(Math.sin(sec * 6)) * 12; p.look = [-1, -.2] } else { p.dx = -10 * ease(ramp(ms, 2400, 3000)); p.dy = -bump(ms, 2400, 3000) * 40; p.m = [11, 13, 7]; p.rot = Math.sin(sec * 3.2) * 5 } }
    if (i === 2) { if (ms > 900 && ms < 3200) { p.pr = 'stop'; p.hr = [rx + 18, ry - 38, 6 + Math.sin(sec * 5) * 6]; p.hl = [lx + 12, ly - 30, 20]; p.m = [4, 4, 8]; p.look = [-.8, 0] } else { p.hl = [lx - 24 + Math.sin(sec * 9) * 8, ly - 26, -60]; p.m = [10, 11, 4] } }
    if (i === 3) { p.pl = 'case'; p.hl = [lx - 14, ly + 18, 0]; if (ms < 3600) wave(); else thumb(); p.look = [-.8, -.4] }
    if (ms > 4400 && i) thumb()
  } else if (id === 'quick' || id === 'hotel') {
    // something travels from hand to hand along the line
    const pos = ramp(u, .08, .6) * n - .5, near = cl(1 - Math.abs(pos - i) * 1.25, 0, 1), done = u > .62
    p.look = [cl((pos - i) * .9, -1, 1), -.45]
    if (!done) { p.hl = [lx - 12, ly + 12 - near * 46, -140 + near * 120]; p.hr = [rx + 12, ry + 12 - near * 46, 140 - near * 120]; p.rot = cl((pos - i) * 8, -9, 9) * near; p.dy = -near * 8; p.m = [8 + near * 2, 8, near * 8] }
    else if (id === 'quick') { if (i === n - 1) { p.pr = 'bag'; p.hr = [rx + 12, ry + 6, 0]; p.dy = -Math.abs(Math.sin(sec * 8)) * 12; p.m = [11, 13, 8] } else thumb() }
    else { const b = bump(u, .64, .84); p.rot = b * 17 * (i < n / 2 ? 1 : -1); p.dy = b * 3; p.hr = [lerp(rx + 17, 52, b), lerp(ry + 22, ly, b), 100]; p.lid = 1 - b * .75; p.m = [10, 12, 2]; if (u > .84) wave() }
    if (id === 'hotel' && i === 3 && u < .5) { p.hl = [lx - 24, ly - 42 + Math.sin(sec * 5) * 4, -40] }
  } else if (id === 'service') {
    if (u < .58) {
      const k = Math.sin(sec * (7 + i) + i * 2); p.pr = ['wrench', 'hammer', 'brush', 'wrench', 'hammer'][i]
      p.hr = [rx + 19, ry - 18 - (i % 2 ? Math.abs(k) * 16 : 0), 20 + k * (i === 2 ? 60 : 38)]; p.hl = [lx - 10, ly - 2, -90]; p.look = [.8, i % 2 ? -.2 : -.6]; p.m = [7, 4, i === 2 ? 5 : 0]; p.dy = i % 2 ? -Math.abs(k) * 4 : 0
    } else up()
  } else if (id === 'super') {
    const s = Math.sin(sec * 7 + i * 2.1); p.hl = [lx - 22, ly - 22 + s * 18, -60]; p.hr = [rx + 22, ry - 22 - s * 18, 60]; p.look = [Math.sin(sec * 2.2 + i) * .8, -1]; p.m = [10, 12, 6]; p.dy = -Math.abs(Math.sin(sec * 3.5 + i)) * 7
  } else if (id === 'ai') {
    if (u < .74) { if (i === 0) { p.hl = [lx + 8, ly + 12 + Math.sin(sec * 13) * 4, -190]; p.hr = [rx + 16, ry - 4 + Math.cos(sec * 13) * 4, 90]; p.look = [1, -.4]; p.m = [7, 5, 1] } else { p.hl = [lx - 24, ly - 22, -60]; p.hr = [rx + 22, ry - 30 + Math.sin(sec * 4) * 8, 30]; p.look = [-1, -.2]; p.m = [8, 9, 5]; p.dy = -6 - Math.sin(sec * 3) * 5 } } else up()
  }
  return p
}

export default function Crew({ id, clock, ctl, seek }) {
  const root = useRef(null), S = useRef({}).current
  if (S.id !== id) { S.prev = S.id; S.id = id; S.changed = true }
  S.clock = clock; S.ctl = ctl; S.seek = seek
  useEffect(() => {
    const host = root.current, still = calm(), all = (el, c) => [...el.querySelectorAll('.' + c)]
    const els = all(host, 'cw').map(el => ({ el, sh: host.querySelector(`.cw-sh[data-i="${el.dataset.i}"]`), st: all(el, 'cw-s'), ey: all(el, 'cw-e'), pu: all(el, 'cw-p'), ar: all(el, 'cw-a'), ha: all(el, 'cw-h'), mo: all(el, 'cw-m')[0], ht: all(el, 'cw-hat')[0], hk: all(el, 'cw-hk'), pr: all(el, 'cw-pr') }))
    const items = Object.fromEntries(all(host, 'cw-it').map(e => [e.dataset.k, e])), shown = {}
    const now0 = performance.now()
    const A = els.map((e, i) => ({ ...e, i, v: {}, l: 'O', hat: null, on: false, blink: now0 + 900 + i * 700, spin: 0, shock: 0, q: 1, qu: 0, move: null, x: -120, y: FLOOR, s: .5, rot: 0, hover: false, box: null, hurt: 0 }))
    let cur = null, raf = 0, last = now0, live = false, mouse = null, mAt = -1e9, lastIn = now0, wordAt = now0, slow = 16, tick = 0, bye = false, boxAt = 0
    const go = (a, k, to, dt, K, d) => { const o = a.v[k] || (a.v[k] = { x: to, u: 0 }); if (still) { o.x = to; return to } for (let j = 0; j < 2; j++) { o.u += ((to - o.x) * K - o.u * d) * dt / 2; o.x += o.u * dt / 2 } return o.x }

    const E = { cab: all(host, 'cw-cab'), wheels: all(host, 'cw-wh'), burger: all(host, 'cw-bg')[0], layers: all(host, 'cw-ly'), crumbs: all(host, 'cw-cr'), sets: Object.fromEntries(all(host, 'cw-set').map(g => [g.dataset.k, g])), gr: all(host, 'cw-gr'), cf: all(host, 'cw-cf'), swh: all(host, 'st-wh'), dl: all(host, 'st-dl')[0], dr: all(host, 'st-dr')[0], beam: all(host, 'st-beam')[0] }
    const mark = host.querySelector('.cw-mark')
    let showT = null, synced = -1, perf = null
    // In front of the cab and burger, or behind them
    const front = (a, yes) => { if (a.fr === yes) return; a.fr = yes; yes ? mark.after(a.el) : E.cab[0].after(a.el) }
    function change(now) {
      const next = WORDS[S.id], to = slots(next), from = cur ? WORDS[cur] : [], first = !cur, show = !still && SHOW[S.id], some = A.some(a => a.on)
      hideShows(E); showT = null; perf = null
      A.forEach(a => { a.ride = a.air = false; a.fade = 1; front(a, true) })
      if (show) {
        A.forEach(a => {
          if (a.on) a.move = { kind: 'dive', t0: now + 30 + a.i * 45, d: 380, x: a.x, y: a.y, s: a.s, done: false }
          if (a.i < next.length) { a.home = to[a.i]; a.cast = next[a.i] }
        })
        showT = now + (some ? 600 : 100); synced = -1; cur = S.id; S.changed = false; lastIn = now; wordAt = now
        return
      }
      for (const a of A) {
        const was = a.on, will = a.i < next.length
        if (will) {
          a.home = to[a.i]
          const kind = still ? 'set' : first ? 'run' : was ? 'flip' : 'born'
          a.move = { kind, t0: now + (first ? a.i * 190 : kind === 'born' ? (some ? 360 : 80) + Math.max(0, some ? a.i - from.length : a.i) * 95 : 90 + a.i * 55), d: first ? 1050 : 560, x: was ? a.x : kind === 'run' ? -150 : PHONE[0], y: was ? a.y : kind === 'run' ? FLOOR : PHONE[1] + 60, s: was ? a.s : kind === 'run' ? to[a.i].s : .06, l: next[a.i][0], hat: next[a.i][1], done: false, dir: a.i % 2 ? -1 : 1 }
          a.on = true
        } else if (was) a.move = { kind: still ? 'gone' : 'dive', t0: now + 90 + (a.i - next.length) * 80, d: 430, x: a.x, y: a.y, s: a.s, done: false }
        if (still || first) { a.l = will ? next[a.i][0] : a.l; a.hat = will ? next[a.i][1] : null }
      }
      cur = S.id; S.changed = false; lastIn = now; wordAt = now + (first ? 2000 : 1150)
    }
    function runShow(now) {
      if (A.some(a => a.move) || now < showT) { perf = null; return }
      const [fn, o] = SHOW[cur], at = (now - showT) * SPEED, run = Math.floor(at / o.len), c = at % o.len
      for (const a of A) { if (a.i < WORDS[cur].length) { a.l = a.cast[0]; a.hat = a.cast[1] } else a.on = false }
      if (c >= o.sync - 60 && synced !== run) { synced = run; S.seek?.(0) }
      perf = fn(c, A, E, front, now)
    }
    function land(a, now, hard) {
      a.qu -= hard
      const near = A[a.i - 1], far = A[a.i + 1]
      for (const b of [near, far]) if (b?.on && !b.move) { b.hurt = (b.i < a.i ? -1 : 1) * 7; b.qu -= 2.5 }
    }
    function place(a, now, dt) {
      const m = a.move
      if (m && now >= m.t0) {
        const t = cl((now - m.t0) / m.d, 0, 1)
        if (m.kind === 'set' || m.kind === 'gone') { a.on = m.kind === 'set'; if (a.on) { a.x = a.home.x; a.y = FLOOR; a.s = a.home.s; a.l = m.l; a.hat = m.hat } a.move = null; return }
        if (m.kind === 'run') {
          a.x = lerp(m.x, a.home.x, 1 - (1 - t) ** 2.4); a.s = a.home.s; a.y = FLOOR - Math.abs(Math.sin(t * 13)) * 15 * (1 - t); a.rot = Math.sin(t * 13) * 9 * (1 - t) - bump(t, .55, 1) * 13
          if (t >= 1) { a.move = null; a.rot = 0; land(a, now, 5) }
        } else if (m.kind === 'dive') {
          const e = ease(t); a.x = lerp(m.x, PHONE[0], e); a.y = lerp(m.y, PHONE[1] + 60, e) - Math.sin(t * Math.PI) * 70; a.s = lerp(m.s, .05, e * e); a.rot = e * 300
          if (t >= 1) { a.on = false; a.move = null; a.rot = 0 }
        } else {
          const e = ease(t), high = m.kind === 'born' ? 62 : 74 + (a.i % 2) * 14
          a.x = lerp(m.x, a.home.x, e); a.y = lerp(m.y, FLOOR, m.kind === 'born' ? e * e : e) - Math.sin(t * Math.PI) * high; a.s = lerp(m.s, a.home.s, m.kind === 'born' ? Math.sqrt(t) : e); a.rot = e * 360 * m.dir
          if (t > .34 && !m.done) { m.done = true; a.l = m.l; a.hat = m.hat }
          if (t >= 1) { a.move = null; a.rot = 0; a.l = m.l; a.hat = m.hat; land(a, now, 8) }
        }
      }
    }
    function draw(a, now, dt, n) {
      const L = LETTERS[a.l], busy = !!a.move || a.air, inShow = showT != null, f = inShow ? perf : now > wordAt && S.clock ? S.clock() : null
      let mode = S.ctl?.current?.mode
      const doze = !S.auto && f != null && now - lastIn > 30000 && S.ctl?.current?.paused
      let p = pose(cur, a.i, n, WORDS[cur][a.i] ? a.l : 'O', f, now)
      const [lx, ly, rx, ry] = L.a, sec = now / 1000
      if (a.ride) {
        const drive = cur === 'taxi' && a.i === 0
        p = { ...p, pl: null, pr: drive ? 'wheel' : null, into: 0, dx: 0, rot: 0, lid: 1, dy: -Math.abs(Math.sin(sec * 8 + a.i)) * 5, m: [11, 13, 8], look: [1, -.1], hl: drive ? [lx + 14, ly - 6, -30] : [lx - 20, ly - 46 + Math.sin(sec * 11 + a.i) * 8, -15], hr: drive ? [rx + 8, ry - 10, Math.sin(sec * 5) * 18] : [rx + 20, ry - 46 - Math.sin(sec * 11 + a.i) * 8, 15] }
        if (cur !== 'taxi' && cur !== 'quick') p = { ...p, hl: [lx - 8, ly + 14, -150], hr: [rx + 8, ry + 14, 150], look: [Math.sin(sec * 4), -.4], m: [7, 6, 9] }
      } else if (busy || now < wordAt) {
        p = { ...p, pl: null, pr: null, into: 0, dx: 0, dy: 0, rot: 0 }
        const pre = a.move && now < a.move.t0
        if (pre) { p.hl = [lx - 14, ly - 20, -40]; p.hr = [rx + 14, ry - 20, 40]; p.m = [4, 4, 8]; p.look = [0, -1] }
        else if (busy) { p.hl = [lx - 24, ly - 40, -30]; p.hr = [rx + 24, ry - 40, 30]; p.m = [9, 10, 11] }
        else { const w = bump((wordAt - now) / 1000, .1 + (n - a.i) * .1, .34 + (n - a.i) * .1); p.dy = -w * 24; p.m = [10, 12, 6] }
      } else if (a.shock > now) { p = { ...p, pl: null, pr: null, into: 0, hl: [lx - 24, ly - 48, -15], hr: [rx + 24, ry - 48, 15], m: [8, 7, 13], dy: -bump(now, a.shock - 900, a.shock - 350) * 46, look: [0, 0] } }
      else if (mode === 'point') p = { ...p, pl: null, pr: null, into: 0, hl: [lx - 36, ly - 14 + Math.sin(sec * 9 + a.i) * 3, -80], m: [11, 12, 6], look: [-1, -.1], dy: -Math.abs(Math.sin(sec * 5 + a.i)) * 7 }
      else if (a.hover || bye) { const o = Math.sin(sec * 11 + a.i) * 7; p = { ...p, into: 0, pr: null, hr: [rx + 21 + o, ry - 46, 10 + o * 3], m: [10, 11, 7], look: a.hover ? [0, 0] : p.look } }
      else if (doze) p = { ...p, pl: null, pr: null, into: 0, lid: .1, m: [4, 3, 3 + Math.sin(sec * 2 + a.i) * 3], hl: [lx - 10, ly + 30, -170], hr: [rx + 10, ry + 30, 170], rot: a.i % 2 ? -5 : 5, dx: 0, dy: 0 }
      // body
      let path = ''
      L.s.forEach((s, j) => { const b = s.map((x, k) => go(a, `s${j}${k}`, x, dt, 200, 17).toFixed(1)); path += `M${b[0]} ${b[1]}Q${b[2]} ${b[3]} ${b[4]} ${b[5]}` })
      if (path !== a.path) { a.path = path; a.st.forEach(e => e.setAttribute('d', path)) }
      // place
      a.hurt *= Math.exp(-dt * 7)
      a.qu += ((1 - a.q) * 260 - a.qu * 13) * dt; a.q = cl(a.q + a.qu * dt, .55, 1.35)
      const breathe = busy ? 0 : Math.sin(sec * 4 + a.i * 1.3) * .018
      const px = go(a, 'dx', p.dx + a.hurt, dt, 160, 15), py = go(a, 'dy', p.dy, dt, 300, 20), pr = go(a, 'rot', p.rot, dt, 160, 13), into = p.into
      let X = a.x + px * (a.s / .6), Yy = a.y + py * (a.s / .6), s = a.s
      if (into > 0) { X = lerp(X, PHONE[0], into); Yy = lerp(Yy, PHONE[1] + 46, into) - Math.sin(into * Math.PI) * 46; s = lerp(s, .05, into * into) }
      const r = a.rot + pr + (into > 0 ? into * 340 : 0), sy = a.q + breathe, sx = 2 - sy
      a.el.setAttribute('transform', `translate(${X.toFixed(2)} ${Yy.toFixed(2)}) translate(0 ${(-58 * s).toFixed(2)}) rotate(${r.toFixed(1)}) translate(0 ${(58 * s).toFixed(2)}) scale(${(s * sx).toFixed(3)} ${(s * sy).toFixed(3)}) translate(-50 -130)`)
      const gone = !a.on || s < .07
      a.el.style.visibility = gone ? 'hidden' : 'visible'
      const high = cl((FLOOR - Yy) / 90, 0, 1)
      a.sh.setAttribute('transform', `translate(${X.toFixed(1)} ${FLOOR}) scale(${(a.s * (1 - high * .6)).toFixed(2)})`); a.el.style.opacity = a.fade ?? 1
      a.sh.style.opacity = gone || a.ride ? 0 : (.2 * (1 - high)).toFixed(2)
      // face
      if (now > a.blink) a.blink = now + 1500 + Math.random() * 3200
      const lid = go(a, 'lid', a.blink - now < 120 ? .08 : p.lid, dt, 900, 50)
      let look = p.look || [Math.sin(now / 1700 + a.i) * .6, Math.cos(now / 2300 + a.i) * .3]
      if (mouse && now - mAt < 1500 && !mode && a.box) { const dx = mouse[0] - a.box.left - a.box.width / 2, dy = mouse[1] - a.box.top - a.box.height * .35, q = Math.hypot(dx, dy) || 1, k = Math.min(1, q / 110); look = [dx / q * k, dy / q * k] }
      const startled = A.find(b => b !== a && b.shock > now); if (startled && !busy) look = [startled.i < a.i ? -1 : 1, 0]
      for (let e = 0; e < 2; e++) {
        a.ey[e].setAttribute('transform', `translate(${go(a, 'ex' + e, L.e[e * 2], dt, 170, 13).toFixed(1)} ${go(a, 'ey' + e, L.e[e * 2 + 1], dt, 170, 13).toFixed(1)}) scale(1 ${Math.max(.07, lid).toFixed(2)})`)
        const sp = now < a.spin || busy, w = now / 70 + e * 2
        const gx = go(a, 'px' + e, sp ? Math.cos(w) * 6 : look[0] * 6.5, dt, sp ? 900 : 120 + e * 35, sp ? 40 : 8), gy = go(a, 'py' + e, sp ? Math.sin(w) * 6 : look[1] * 6.5, dt, sp ? 900 : 120 + e * 35, sp ? 40 : 8), h = Math.hypot(gx, gy), k = h > 7 ? 7 / h : 1
        a.pu[e].setAttribute('transform', `translate(${(gx * k).toFixed(1)} ${(gy * k).toFixed(1)})`)
      }
      const mw = go(a, 'mw', p.m[0], dt, 260, 18), mc = go(a, 'mc', p.m[1], dt, 260, 18), mo = Math.max(0, go(a, 'mo', p.m[2], dt, 260, 18))
      a.mo.setAttribute('transform', `translate(${go(a, 'mx', L.m[0], dt, 170, 14).toFixed(1)} ${go(a, 'my', L.m[1], dt, 170, 14).toFixed(1)})`)
      a.mo.setAttribute('d', `M${(-mw).toFixed(1)} ${(-mo / 2).toFixed(1)}Q0 ${(mc - mo).toFixed(1)} ${mw.toFixed(1)} ${(-mo / 2).toFixed(1)}Q0 ${(mc + mo).toFixed(1)} ${(-mw).toFixed(1)} ${(-mo / 2).toFixed(1)}Z`)
      // arms, hands, props
      ;[p.hl, p.hr].forEach((h, k) => {
        const ax = go(a, 'ax' + k, L.a[k * 2], dt, 190, 17), ay = go(a, 'ay' + k, L.a[k * 2 + 1], dt, 190, 17), x = go(a, 'hx' + k, h[0], dt, 210, 14), y = go(a, 'hy' + k, h[1], dt, 210, 14), q = go(a, 'hr' + k, h[2], dt, 150, 13), side = k ? 1 : -1
        a.ar[k].setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)}Q${((ax + x) / 2 + side * 8).toFixed(1)} ${((ay + y) / 2 + 9).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`)
        a.ha[k].setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${q.toFixed(0)}) scale(${side} 1)`)
      })
      const want = `${p.pl}|${p.pr}`
      if (want !== a.want) { a.want = want; a.pr.forEach(e => { e.style.display = (e.dataset.s === 'l' ? p.pl : p.pr) === e.dataset.k ? '' : 'none' }) }
      if (a.hat !== a.hatOn || a.l !== a.hatL) { a.hatOn = a.hat; a.hatL = a.l; a.hk.forEach(e => { e.style.display = e.dataset.k === a.hat ? '' : 'none' }); const [hx, hy] = HAT_AT[a.l] || [50, 8]; a.ht.setAttribute('transform', `translate(${hx} ${hy})`); if (!still) a.ht.firstChild.animate([{ transform: 'translateY(-60px) rotate(-40deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, delay: 120, fill: 'backwards', easing: 'cubic-bezier(.3,1.7,.5,1)' }) }
    }
    const put = (k, x, y, r, s = .6) => { const e = items[k]; shown[k] = 1; e.style.visibility = 'visible'; e.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${s})`) }
    function props(now, n) {
      for (const k in shown) { items[k].style.visibility = 'hidden'; delete shown[k] }
      const f = showT != null ? perf : now > wordAt && S.clock ? S.clock() : null
      if (f == null || still || S.ctl?.current?.mode || (S.ctl?.current?.paused && now - lastIn > 30000)) return
      const u = (f % 5200) / 5200, sec = now / 1000
      if ((cur === 'quick' || cur === 'hotel') && u < .62) {
        const pos = ramp(u, .08, .6) * n - .5, i0 = cl(Math.floor(pos), 0, n - 1), i1 = cl(i0 + 1, 0, n - 1), t = cl(pos - i0, 0, 1), top = FLOOR - 78 * A[0].s * 1.5
        if (u < .08 || pos < 0) { const q = cl((pos + .5) / .5, 0, 1); put(cur === 'quick' ? 'apple' : 'case2', lerp(PHONE[0], A[0].x, q), lerp(PHONE[1] + 40, top, q), q * 180, .3 + q * .35) }
        else put(cur === 'quick' ? 'apple' : 'case2', lerp(A[i0].x, A[i1].x, ease(t)), top - Math.sin(t * Math.PI) * 24, u * 1400 % 360, .66)
      }
      if (cur === 'super') for (let k = 0; k < 4; k++) { const w = sec * 2.3 + k * 1.571, c = Math.cos(w), q = Math.sin(w); put('tile' + k, 86 + c * 84, FLOOR - 92 - Math.max(0, q) * 40 + Math.max(0, -q) * 26, sec * 160 + k * 40, .62) }
      if (cur === 'ai' && u < .74) for (let k = 0; k < 3; k++) { const t = (sec * .8 + k / 3) % 1; put('spark' + k, lerp(A[0].x + 24, A[1].x - 16, t), FLOOR - 66 - Math.sin(t * Math.PI) * 34, t * 240, .45 + Math.sin(t * Math.PI) * .35) }
    }
    function frame(now) {
      const raw = now - last, dt = cl(raw / 1000, .001, .034); last = now; tick++
      if (raw < 120) slow += (raw - slow) * .04
      if (S.changed || !cur) change(now)
      if (showT != null) runShow(now)
      const n = WORDS[cur].length, lite = slow > 25 && !A.some(a => a.move || a.air || a.ride)
      if (now - boxAt > 350 && mouse && now - mAt < 1500) { boxAt = now; A.forEach(a => { if (a.on) a.box = a.el.getBoundingClientRect() }) }
      A.forEach(a => { place(a, now, dt); if (!a.on) { if (a.seen !== false) { a.seen = false; a.el.style.visibility = 'hidden'; a.sh.style.opacity = 0 } return } a.seen = true; if (lite && a.i && (tick + a.i) % 2) return; draw(a, now, lite ? Math.min(.034, dt * 2) : dt, n) })
      props(now, n)
      S.fps = 1000 / slow
      if (live && !document.hidden && !still) raf = requestAnimationFrame(frame)
    }
    frame(now0); host.dataset.ready = 1
    if (still) { const t = setInterval(() => frame(performance.now()), 500); return () => clearInterval(t) }
    const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame) }
    const svg = host.ownerSVGElement, io = new IntersectionObserver(([e]) => { const was = live; live = e.isIntersecting; if (live && !was) start() }); io.observe(svg)
    const mv = e => { lastIn = performance.now(); if (e.pointerType !== 'touch') { mouse = [e.clientX, e.clientY]; mAt = lastIn } }
    const sc = () => { lastIn = performance.now(); bye = scrollY > 180 }, vis = () => { if (!document.hidden && live) start() }
    const of = e => { const g = e.target.closest?.('.cw'); return g && A[+g.dataset.i] }
    const over = e => { A.forEach(a => { a.hover = false }); const a = of(e); if (a && e.pointerType === 'mouse') a.hover = true }, out = () => A.forEach(a => { a.hover = false })
    const click = e => { const a = of(e); if (a) { a.shock = performance.now() + 1300; a.spin = a.shock; a.qu += 5; lastIn = performance.now() } }
    addEventListener('pointermove', mv, { passive: true }); addEventListener('scroll', sc, { passive: true }); document.addEventListener('visibilitychange', vis)
    host.addEventListener('pointerover', over); host.addEventListener('pointerleave', out); host.addEventListener('click', click)
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('pointermove', mv); removeEventListener('scroll', sc); document.removeEventListener('visibilitychange', vis) }
  }, [])
  const base = { fill: 'none', ...rd }, d0 = letterPath('O')
  return <g ref={root} className="crew">
    {[...Array(MAX)].map((_, i) => <ellipse key={i} className="cw-sh" data-i={i} rx="40" ry="6" fill={I} style={{ opacity: 0 }} />)}
    <clipPath id="cw-floor"><path d="M-400-400H700V240H-400Z" /></clipPath><SetBacks /><CabBack />
    {[...Array(MAX)].map((_, i) => <g key={i} className="cw" data-i={i} style={{ visibility: 'hidden' }}>
      <path className="cw-a" {...base} stroke={I} strokeWidth="6" /><path className="cw-a" {...base} stroke={I} strokeWidth="6" />
      <g transform="translate(2 -4)"><path className="cw-s" d={d0} {...base} stroke={I} strokeWidth="30" /><path className="cw-s" d={d0} {...base} stroke={Y} strokeWidth="27" /></g>
      <path className="cw-s" d={d0} {...base} stroke={D} strokeWidth="29.500" /><path className="cw-s" d={d0} {...base} stroke={T} strokeWidth="26" />
      <g className="cw-hat"><g>{Object.entries(Hats).map(([k, h]) => <g key={k} className="cw-hk" data-k={k} style={{ display: 'none' }}>{h}</g>)}</g></g>
      <path className="cw-m" fill={I} stroke={I} strokeWidth="3" strokeLinejoin="round" />
      {[0, 1].map(e => <g key={e} className="cw-e"><circle r="14" fill={W} stroke={I} strokeWidth="2.600" /><g className="cw-p"><circle r="6.500" fill={I} /><circle cx="-2" cy="-2.500" r="2" fill={W} /></g></g>)}
      {['l', 'r'].map(s => <g key={s} className="cw-h">{Object.entries(Props).map(([k, h]) => <g key={k} className="cw-pr" data-k={k} data-s={s} style={{ display: 'none' }}>{h}</g>)}<Glove /></g>)}
    </g>)}
    <CabFront /><Burger /><SetFronts /><g className="cw-mark" />
    {Object.entries(Items).map(([k, h]) => <g key={k} className="cw-it" data-k={k} style={{ visibility: 'hidden' }}>{h}</g>)}
  </g>
}
