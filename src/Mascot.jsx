import { useEffect, useRef } from 'react'

const I = '#06282A', T = '#06A4A5', W = '#fff', Y = '#FAFD0F', G = '#33A77A', R = '#D9482B'
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Every letter is the same four bendable strokes: [x1,y1, cx,cy, x2,y2]. Feet at y 116, box 100 x 130.
export const LETTERS = {
  A: { s: [[17, 116, 30, 52, 50, 17], [83, 116, 70, 52, 50, 17], [32, 89, 50, 85, 68, 88], [32, 89, 50, 85, 68, 88]], e: [37, 47, 64, 46], m: [50, 88], a: [22, 80, 78, 80] },
  F: { s: [[28, 116, 25, 66, 28, 19], [28, 19, 56, 14, 84, 19], [28, 67, 48, 63, 68, 66], [28, 116, 26, 90, 28, 67]], e: [31, 25, 60, 22], m: [34, 50], a: [20, 82, 68, 67] },
  T: { s: [[13, 22, 32, 16, 50, 19], [87, 22, 68, 16, 50, 19], [50, 19, 47, 68, 50, 116], [50, 19, 53, 68, 50, 116]], e: [35, 24, 65, 24], m: [50, 52], a: [42, 76, 58, 76] },
  Q: { s: [[50, 18, 108, 24, 83, 90], [83, 90, 50, 150, 17, 90], [17, 90, -8, 24, 50, 18], [62, 90, 74, 104, 90, 117]], e: [34, 38, 66, 38], m: [50, 118], a: [13, 72, 87, 72] },
  S: { s: [[80, 32, 64, 8, 40, 23], [40, 23, 6, 46, 50, 65], [50, 65, 98, 84, 64, 109], [64, 109, 40, 121, 18, 104]], e: [36, 28, 65, 24], m: [50, 66], a: [24, 56, 80, 86] },
  H: { s: [[20, 116, 17, 66, 20, 19], [80, 116, 83, 66, 80, 19], [20, 70, 50, 65, 80, 70], [20, 70, 50, 65, 80, 70]], e: [22, 32, 78, 32], m: [50, 69], a: [10, 82, 90, 82] },
}
Object.assign(LETTERS, {
  O: { s: [[50, 18, 108, 24, 83, 90], [83, 90, 50, 150, 17, 90], [17, 90, -8, 24, 50, 18], [17, 90, -8, 24, 50, 18]], e: [34, 38, 66, 38], m: [50, 116], a: [13, 72, 87, 72] },
  D: { s: [[24, 116, 22, 66, 24, 19], [24, 19, 80, 14, 82, 66], [82, 66, 78, 118, 24, 116], [24, 116, 22, 66, 24, 19]], e: [30, 34, 62, 34], m: [27, 72], a: [14, 82, 84, 72] },
  I: { s: [[50, 116, 48, 66, 50, 19], [50, 116, 52, 66, 50, 19], [50, 116, 48, 66, 50, 19], [50, 116, 52, 66, 50, 19]], e: [36, 32, 64, 32], m: [50, 60], a: [38, 78, 62, 78] },
  U: { s: [[20, 19, 16, 60, 22, 88], [22, 88, 50, 142, 78, 88], [78, 88, 84, 60, 80, 19], [22, 88, 50, 142, 78, 88]], e: [21, 34, 79, 34], m: [50, 114], a: [10, 72, 90, 72] },
  C: { s: [[82, 34, 62, 8, 38, 24], [38, 24, 4, 48, 22, 90], [22, 90, 46, 128, 84, 102], [38, 24, 4, 48, 22, 90]], e: [38, 30, 67, 25], m: [20, 70], a: [10, 80, 80, 104] },
  K: { s: [[24, 116, 22, 66, 24, 19], [82, 19, 60, 52, 30, 68], [40, 60, 64, 84, 84, 116], [24, 116, 22, 66, 24, 19]], e: [26, 32, 70, 32], m: [26, 62], a: [14, 84, 70, 96] },
  E: { s: [[26, 116, 23, 66, 26, 19], [26, 19, 54, 15, 82, 19], [26, 67, 48, 63, 70, 67], [26, 116, 54, 119, 84, 114]], e: [30, 25, 60, 22], m: [32, 48], a: [16, 84, 68, 67] },
  L: { s: [[30, 19, 26, 66, 28, 116], [28, 116, 56, 119, 84, 114], [30, 19, 26, 66, 28, 116], [28, 116, 56, 119, 84, 114]], e: [18, 34, 46, 34], m: [30, 62], a: [18, 84, 42, 84] },
  Xx: { s: [[18, 19, 48, 66, 84, 116], [82, 19, 52, 66, 16, 116], [18, 19, 48, 66, 84, 116], [82, 19, 52, 66, 16, 116]], e: [34, 44, 66, 44], m: [50, 70], a: [30, 86, 70, 86] },
})
LETTERS.X = LETTERS.A // AI: an A in robot gear
const d = p => `M${p[0]} ${p[1]}Q${p[2]} ${p[3]} ${p[4]} ${p[5]}`
export const letterPath = l => LETTERS[l].s.map(d).join('')

// What the character is doing: hands [x, y, rotation], mouth [width, curve, open], look [x, y] in -1..1.
function act(l, ms, f, s) {
  const [lx, ly, rx, ry] = LETTERS[l].a, sec = s.t / 1000
  const p = { hl: [lx - 17, ly + 22, -150], hr: [rx + 17, ry + 22, 150], m: [9, 8, 0], look: null, lid: 1, slice: 0, beat: 0, tool: 0, juggle: 0 }
  const wave = h => { const o = Math.sin(sec * 11) * 7; if (h === 'r') p.hr = [rx + 21 + o, ry - 46, 10 + o * 3]; else p.hl = [lx - 21 + o, ly - 46, -10 + o * 3]; p.m = [10, 11, 7] }
  const thumb = () => { p.hr = [rx + 22, ry - 18 + Math.sin(sec * 5) * 2, 0, 1]; p.m = [11, 12, 4] }
  if (s.mode === 'sleep') return { ...p, lid: .1, m: [4, 3, 3 + Math.sin(sec * 2) * 3], hl: [lx - 10, ly + 30, -170], hr: [rx + 10, ry + 30, 170] }
  if (s.mode === 'point') return { ...p, hl: [lx - 36, ly - 14 + Math.sin(sec * 9) * 2, -80], m: [11, 12, 6], look: [-1, .5] }
  if (s.mode === 'type') return { ...p, hl: [lx - 4, ly + 14 + Math.sin(sec * 9) * 2, -190], hr: [rx + 4, ry + 14 + Math.cos(sec * 9) * 2, 190], look: [Math.sin(sec * 2.2) * .7, 1], m: [7, 5, 2] }
  if (s.cheer > s.t) return { ...p, hl: [lx - 22, ly - 52 + Math.sin(sec * 15) * 7, -15], hr: [rx + 22, ry - 52 - Math.sin(sec * 15) * 7, 15], m: [11, 13, 10] }
  if (s.hover || s.bye) { wave('r'); if (s.hover) p.look = [0, 0]; return p }
  if (l === 'F' && f != null) {
    const u = (f % 5200) / 5200, toss = a => u > a && u < a + .16 ? Math.sin((u - a) / .16 * Math.PI) : 0, up = Math.max(toss(.17), toss(.43))
    const jerk = Math.max(toss(.15), toss(.41))
    if (u < .63) { p.look = [1, .35 - up * 1.2]; p.hr = [rx + 20, ry + 8 - jerk * 26, 60]; p.hl = [lx - 13, ly + 8 - up * 34, -120 + up * 90]; p.m = up > .2 ? [7, 8, 9] : [9, 8, 1] }
    else if (u < .73) { p.hl = [lx - 22, ly - 46, -15]; p.hr = [rx + 18, ry - 44, 15]; p.m = [11, 13, 9]; p.look = [1, 0] }
    else { p.slice = 1; const c = Math.sin(sec * 13); p.hl = [lx + 1, ly - 18 + c, -25]; p.m = [8, 5, 4 + c * 4]; p.look = [1, .1]; p.hr = [rx + 22 + c * 5, ry - 32, 10 + c * 16] }
  } else if (l === 'T' && f != null) {
    if (f < 900) { p.m = [4, 4, 8]; p.hl = [lx - 2, ly - 18, 20]; p.look = [1, .6] }
    else if (f < 4300) { p.hr = [rx + 26 + Math.sin(sec * 8) * 9, ry - 14, 50 + Math.sin(sec * 8) * 30]; p.look = [1, .7 - f / 4300 * 1.5]; p.m = [9, 9, 4] }
    else thumb()
  } else if (f != null && l !== 'T') {
    const u = (f % 5200) / 5200
    if (l === 'Q') { // tosses each item into the cart
      const k = [.1, .3, .5].findIndex(x => u > x && u < x + .16)
      if (k >= 0) { const q = (u - [.1, .3, .5][k]) / .16; p.hr = [rx + 14 + q * 18, ry - 36 + q * 44, 40 + q * 60]; p.hl = [lx - 14, ly - 8, -60]; p.look = [1, -.6 + q * 1.4]; p.m = [8, 9, 5] } else if (u > .7) thumb(); else p.look = [1, -.3]
    } else if (l === 'S') { // turns a wrench, then approves
      if (u < .55) { p.hr = [rx + 22, ry - 22, 30 + Math.sin(sec * 8) * 42]; p.tool = 1; p.look = [1, -.4 + u]; p.m = [7, 5, 1] } else thumb()
    } else if (l === 'H') { // bellhop: points at the hotel, salutes the booking
      if (u < .6) { p.hr = [rx + 27, ry - 28 + Math.sin(sec * 4) * 5, 70]; p.look = [1, -.7]; p.m = [9, 9, 3] } else { p.hl = [lx + 6, ly - 66, 40]; p.m = [10, 12, 4]; p.look = [0, .1] }
    } else if (l === 'A') { // juggles
      p.hl = [lx - 24, ly - 18 + Math.sin(sec * 7) * 18, -70]; p.hr = [rx + 24, ry - 18 - Math.sin(sec * 7) * 18, 70]; p.juggle = 1; p.look = [Math.sin(sec * 3.5) * .8, -1]; p.m = [10, 12, 6]
    } else { // AI types, then cheers the launch
      if (u < .74) { p.hl = [lx + 8, ly + 12 + Math.sin(sec * 13) * 4, -190]; p.hr = [rx + 12, ry + 10 + Math.cos(sec * 13) * 4, 120]; p.look = [1, .5]; p.m = [7, 5, 1] } else { p.hl = [lx - 22, ly - 50, -15]; p.hr = [rx + 22, ry - 50, 15]; p.m = [11, 13, 9] }
    }
  } else if (s.greet > s.t) wave('r')
  return p
}

export const Glove = () => <><path d="M-9 8Q-13-3-8-11Q-6-16-2-13Q1-18 4-13Q9-15 9-8Q13-2 9 8Q0 13-9 8Z" fill={W} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-9 4Q-18 3-17-4Q-13-8-8-3" fill={W} stroke={I} strokeWidth="2.600" strokeLinejoin="round" strokeLinecap="round" /><path d="M-2.500-7v5M3.500-7v5" stroke={I} strokeWidth="2" strokeLinecap="round" /></>

const Hats = {
  F: <g transform="translate(56 6) rotate(5)"><path d="M-20 0C-36-8-30-27-15-24C-11-36 11-36 15-24C30-27 36-8 20 0Z" fill={W} stroke={I} strokeWidth="2.600" /><path d="M-20-2Q0 3 20-2V9Q0 13-20 9Z" fill={W} stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-9-12v7M0-14v8M9-12v7" stroke={I} strokeWidth="2" strokeLinecap="round" /></g>,
  T: <g transform="translate(50 6)"><path d="M-25 2C-30-14-18-20 0-20S30-14 25 2Z" fill={Y} stroke={I} strokeWidth="2.600" /><path d="M-27 0Q0 7 27 0L34 7Q0 17-34 7Z" fill={I} /><rect x="-9" y="-14" width="18" height="9" rx="3" fill={G} stroke={I} strokeWidth="2" /></g>,
  Q: <g transform="translate(50 12)"><path d="M-31 6C-33-22 33-22 31 6Q0-3-31 6Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M-6-14.500Q0-16 6-14.500L7 0H-7z" fill={W} stroke={I} strokeWidth="2" /></g>,
  S: <g transform="translate(52 11) rotate(-6)"><path d="M-27 2C-27-27 27-27 27 2Z" fill={Y} stroke={I} strokeWidth="2.600" /><path d="M-33 1H35Q37 8 30 8H-28Q-35 8-33 1Z" fill={Y} stroke={I} strokeWidth="2.600" /><path d="M-5-20h10V1H-5z" fill="#E4D70A" stroke={I} strokeWidth="2" /></g>,
  H: <g transform="translate(22 4) rotate(-8)"><path d="M-17 4V-12Q0-18 17-12V4Q0 8-17 4Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M-17-2Q0 3 17-2V4Q0 8-17 4Z" fill={Y} stroke={I} strokeWidth="2" /><path d="M-15 5Q-18 18-8 19" fill="none" stroke={I} strokeWidth="2" /></g>,
  A: <g transform="translate(50 4)"><path d="M-19 4L-22-18L-9-7L0-24L9-7L22-18L19 4Q0 9-19 4Z" fill="#FFD84A" stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><circle cx="0" cy="-3" r="3.500" fill={R} /><circle cx="-11" cy="-2" r="2.500" fill={G} /><circle cx="11" cy="-2" r="2.500" fill={G} /></g>,
  X: <g><path d="M50 6V-12" stroke={I} strokeWidth="4" /><circle cx="50" cy="-16" r="7" fill={Y} stroke={I} strokeWidth="2.600" className="bulb" /><path d="M16 44Q14 8 50 6T84 44" fill="none" stroke={I} strokeWidth="5" /><rect x="8" y="38" width="12" height="22" rx="5" fill={G} stroke={I} strokeWidth="2.600" /><rect x="80" y="38" width="12" height="22" rx="5" fill={G} stroke={I} strokeWidth="2.600" /></g>,
}

/* letter: A F T H. clock(): ms into the app's scene, or null. ctl: ref for {mode}. */
export function MascotG({ letter = 'A', clock, ctl, crown }) {
  const root = useRef(null), live = useRef({ letter })
  live.current.letter = letter; live.current.clock = clock; live.current.ctl = ctl; live.current.crown = crown
  const changed = useRef(false)
  useEffect(() => {
    if (!changed.current) { changed.current = true; return }
    live.current.swapAt = performance.now() + 230
    if (!calm()) root.current.animate([
      { transform: 'none' }, { transform: 'scale(1.16,.74)', offset: .17 }, { transform: 'translateY(-58px) rotate(190deg) scale(.86,1.1)', offset: .45 },
      { transform: 'translateY(-12px) rotate(360deg) scale(.96,1.08)', offset: .64 }, { transform: 'rotate(360deg) scale(1.2,.76)', offset: .75 }, { transform: 'rotate(360deg) scale(.94,1.08)', offset: .88 }, { transform: 'rotate(360deg)' },
    ], { duration: 900, easing: 'ease-in-out' })
  }, [letter])
  useEffect(() => {
    const el = root.current, q = c => [...el.querySelectorAll('.' + c)]
    const strokes = q('mk-s'), eyes = q('mk-e'), pupils = q('mk-p'), arms = q('mk-arm'), hands = q('mk-h'), mouth = q('mk-m')[0], hats = q('mk-hat'), slice = q('mk-sl')[0], tool = q('mk-tl')[0], balls = q('mk-jb'), still = calm()
    const S = live.current, v = {}, now0 = performance.now()
    let cur = S.letter, raf = 0, last = now0, on = false, nextBlink = now0 + 1800, mouse = null, mouseAt = -1e9, spinUntil = 0, box = null, boxAt = 0, lastIn = now0
    const st = { hover: false, bye: false, cheer: 0, greet: now0 + 2400, t: now0, mode: null }
    const go = (k, to, dt, K, D) => {
      const o = v[k] || (v[k] = { x: to, u: 0 })
      if (still) { o.x = to; return to }
      for (let i = 0; i < 2; i++) { o.u += ((to - o.x) * K - o.u * D) * dt / 2; o.x += o.u * dt / 2 }
      return o.x
    }
    const frame = now => {
      const dt = Math.min(.034, Math.max(.001, (now - last) / 1000)); last = now; st.t = now
      if (S.letter !== cur && (still || now >= (S.swapAt || 0))) cur = S.letter
      const L = LETTERS[cur], f = S.clock ? S.clock() : null
      st.mode = S.ctl?.current?.mode || (f == null && now - lastIn > 8000 && now > st.greet && !st.hover ? 'sleep' : null)
      const p = act(cur, now - now0, f, st)
      let pathD = ''
      L.s.forEach((s, i) => { const b = s.map((n, j) => go(`s${i}${j}`, n - (p.beat && i > 1 && j === 3 ? p.beat * 26 : 0), dt, 190, 17).toFixed(1)); pathD += d(b) })
      strokes.forEach(x => x.setAttribute('d', pathD))
      if (now - boxAt > 400) { box = el.getBoundingClientRect(); boxAt = now }
      let look = p.look
      if (mouse && now - mouseAt < 1600 && box && !S.ctl?.current?.mode) { const dx = mouse[0] - box.left - box.width / 2, dy = mouse[1] - box.top - box.height * .35, n = Math.hypot(dx, dy) || 1, r = Math.min(1, n / 120); look = [dx / n * r, dy / n * r] }
      look = look || [Math.sin(now / 1700) * .6, Math.cos(now / 2300) * .3]
      if (now > nextBlink) nextBlink = now + 1600 + Math.random() * 3200
      const lid = nextBlink - now > 0 && now < nextBlink && nextBlink - now < 120 ? .08 : p.lid
      const open = go('lid', lid, dt, 900, 50)
      eyes.forEach((e, i) => {
        const x = go('ex' + i, L.e[i * 2], dt, 170, 13), y = go('ey' + i, L.e[i * 2 + 1], dt, 170, 13)
        e.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1 ${Math.max(.07, open).toFixed(2)})`)
        const a = now / 70 + i * 2, spin = now < spinUntil
        const px = go('px' + i, spin ? Math.cos(a) * 6.5 : look[0] * 6.5, dt, spin ? 900 : 120 + i * 35, spin ? 40 : 8), py = go('py' + i, spin ? Math.sin(a) * 6.5 : look[1] * 6.5, dt, spin ? 900 : 120 + i * 35, spin ? 40 : 8)
        const n = Math.hypot(px, py), k = n > 7 ? 7 / n : 1
        pupils[i].setAttribute('transform', `translate(${(px * k).toFixed(1)} ${(py * k).toFixed(1)})`)
      })
      const mx = go('mx', L.m[0], dt, 170, 14), my = go('my', L.m[1], dt, 170, 14), mw = go('mw', p.m[0], dt, 260, 18), mc = go('mc', p.m[1], dt, 260, 18), mo = Math.max(0, go('mo', p.m[2], dt, 260, 18))
      mouth.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`); mouth.setAttribute('d', `M${-mw} ${-mo / 2}Q0 ${mc - mo} ${mw} ${-mo / 2}Q0 ${mc + mo} ${-mw} ${-mo / 2}Z`)
      ;['hl', 'hr'].forEach((h, i) => {
        const sx = go('ax' + i, L.a[i * 2], dt, 190, 17), sy = go('ay' + i, L.a[i * 2 + 1], dt, 190, 17)
        const x = go(h + 'x', p[h][0], dt, 210, 13), y = go(h + 'y', p[h][1], dt, 210, 13), r = go(h + 'r', p[h][3] ? 90 : p[h][2], dt, 150, 13), side = i ? 1 : -1
        arms[i].setAttribute('d', `M${sx.toFixed(1)} ${sy.toFixed(1)}Q${((sx + x) / 2 + side * 8).toFixed(1)} ${((sy + y) / 2 + 9).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`)
        hands[i].setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${i ? 1 : -1} 1)`)
      })
      hats.forEach(h => h.classList.toggle('on', h.dataset.l === cur && (cur !== 'A' || f != null || S.crown))); slice.style.opacity = p.slice; tool.style.opacity = p.tool
      balls.forEach((x, i) => { const w = now / 420 + i * 1.57, cx = 50 + Math.cos(w) * 62, cy = 14 - Math.max(0, Math.sin(w)) * 66 + Math.max(0, -Math.sin(w)) * 46; x.style.opacity = p.juggle; x.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(now / 6 % 360).toFixed(0)})`) })
      if (on && !document.hidden) raf = requestAnimationFrame(frame)
    }
    frame(now0)
    if (still) { const t = setInterval(() => frame(performance.now()), 600); return () => clearInterval(t) }
    const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame) }
    const io = new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) start() }); io.observe(el)
    const wake = () => { if (performance.now() - lastIn > 8000) st.greet = performance.now() + 1500; lastIn = performance.now() }
    const mv = e => { wake(); if (e.pointerType !== 'touch') { mouse = [e.clientX, e.clientY]; mouseAt = performance.now() } }
    const sc = () => { wake(); st.bye = !!S.clock && scrollY > 140 }
    const vis = () => { if (!document.hidden && on) start() }
    const cheer = () => { st.cheer = performance.now() + 2200; el.animate([{ transform: 'none' }, { transform: 'scale(1.1,.85)' }, { transform: 'translateY(-26px)' }, { transform: 'scale(1.1,.86)' }, { transform: 'none' }], { duration: 700, iterations: 2 }) }
    const enter = () => { st.hover = true }, leave = () => { st.hover = false }
    const click = () => { spinUntil = performance.now() + 1300; cheer() }
    addEventListener('pointermove', mv, { passive: true }); addEventListener('scroll', sc, { passive: true }); addEventListener('keydown', wake); addEventListener('appzeto:cheer', cheer); document.addEventListener('visibilitychange', vis)
    el.addEventListener('pointerenter', enter); el.addEventListener('pointerleave', leave); el.addEventListener('click', click)
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('pointermove', mv); removeEventListener('scroll', sc); removeEventListener('keydown', wake); removeEventListener('appzeto:cheer', cheer); document.removeEventListener('visibilitychange', vis) }
  }, [])
  const ds = letterPath(letter), base = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  return <g ref={root} className="mk">
    <path className="mk-arm" {...base} stroke={I} strokeWidth="6" /><path className="mk-arm" {...base} stroke={I} strokeWidth="6" />
    <g transform="translate(2 -4)"><path className="mk-s" d={ds} {...base} stroke={I} strokeWidth="30" /><path className="mk-s" d={ds} {...base} stroke={Y} strokeWidth="27" /></g>
    <path className="mk-s" d={ds} {...base} stroke="#0D5353" strokeWidth="29.500" /><path className="mk-s" d={ds} {...base} stroke={T} strokeWidth="26" />
    {Object.entries(Hats).map(([l, h]) => <g key={l} className="mk-hat" data-l={l}>{h}</g>)}
    <path className="mk-m" fill={I} stroke={I} strokeWidth="3" strokeLinejoin="round" />
    {[0, 1].map(i => <g key={i} className="mk-e"><circle r="14" fill={W} stroke={I} strokeWidth="2.600" /><g className="mk-p"><circle r="6.500" fill={I} /><circle cx="-2" cy="-2.500" r="2" fill={W} /></g></g>)}
    {[0, 1].map(i => <g key={i} className="mk-h">{i === 0 && <g className="mk-sl" style={{ opacity: 0 }}><path d="M-14-8h28L0-38z" fill="#FFD84A" stroke={I} strokeWidth="2.600" strokeLinejoin="round" /><path d="M-16-8h32" stroke="#E39A3B" strokeWidth="7" strokeLinecap="round" /><circle cx="-2" cy="-18" r="4" fill={R} /><circle cx="2" cy="-28" r="2.500" fill={R} /></g>}{i === 1 && <g className="mk-tl" style={{ opacity: 0 }}><path d="M-3-6V-34Q-14-38-11-50L-4-44H4L11-50Q14-38 3-34V-6Z" fill="#C9D3D8" stroke={I} strokeWidth="2.600" strokeLinejoin="round" /></g>}<Glove /></g>)}
    {[R, '#FFD84A', G, W].map(c => <g key={c} className="mk-jb" style={{ opacity: 0 }}><rect x="-10" y="-10" width="20" height="20" rx="6" fill={c} stroke={I} strokeWidth="2.600" /></g>)}
  </g>
}
export function Mascot({ className = '', ...p }) {
  return <svg className={`mascot ${className}`} viewBox="-30 -36 160 170" aria-hidden="true"><MascotG {...p} /></svg>
}
