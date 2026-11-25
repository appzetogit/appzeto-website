'use client'
// More set pieces: grocery cart, toolbox, elevator, surprise box and UFO.
import { FLOOR } from './Shows.jsx'
const I = '#06282A', T = '#06A4A5', D = '#0D5353', W = '#fff', Y = '#FAFD0F', G = '#33A77A', R = '#D9482B', C = '#FFD84A', S = '#C9D3D8'
const rd = { strokeLinecap: 'round', strokeLinejoin: 'round' }, PHONE = [86, 92]
const cl = (n, a, b) => Math.max(a, Math.min(b, n)), lerp = (a, b, t) => a + (b - a) * t, ramp = (c, a, b) => cl((c - a) / (b - a), 0, 1)
const ease = t => t < .5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2, out = t => 1 - (1 - t) ** 3, bump = (c, a, b) => Math.sin(ramp(c, a, b) * Math.PI)
const hide = { visibility: 'hidden' }
const Set = ({ k, children, ...p }) => <g className="cw-set" data-k={k} style={hide} {...p}>{children}</g>

const groceries = {
  milk: <><path d="M-9-6l4-8h10l4 8v22h-18z" fill={W} stroke={I} strokeWidth="2" strokeLinejoin="round" /><path d="M-9 2h18v8h-18z" fill={T} /></>,
  bread: <><path d="M-18 4Q-20-4-12-6L14-10Q22-10 20-2T12 6L-12 10Q-18 10-18 4Z" fill="#E7B265" stroke={I} strokeWidth="2" /><path d="M-8-3l4 8M2-5l4 8M11-6l3 7" stroke="#A8712C" strokeWidth="2" {...rd} /></>,
  carrot: <><path d="M-6-12Q0-18 6-12L1 18Q0 20-1 18Z" fill="#F39A2B" stroke={I} strokeWidth="2" strokeLinejoin="round" /><path d="M0-13Q-8-24-5-27M0-13V-28M0-13Q8-24 5-27" fill="none" stroke={G} strokeWidth="3.500" {...rd} /></>,
  apple: <><path d="M0-7C-6-13-15-8-14 2C-13 11-6 18 0 14C6 18 13 11 14 2C15-8 6-13 0-7Z" fill={R} stroke={I} strokeWidth="2" /><path d="M3-11q7-5 10 0q-6 4-10 0z" fill={G} /></>,
  grape: <>{[[-6, 0], [6, 0], [0, 0], [-3, 7], [4, 7], [0, 13]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="5" fill="#7A4BB0" stroke={I} strokeWidth="1.600" />)}</>,
  fish: <path d="M-16 0Q-4-12 10 0L18-7V7L10 0Q-4 12-16 0Z" fill="#8FC9DD" stroke={I} strokeWidth="2" strokeLinejoin="round" />,
}
const Wh = ({ x }) => <g transform={`translate(${x} 74)`}><g className="st-wh"><circle r="8" fill="#14181B" /><circle r="3.500" fill={S} /><path d="M-7 0H7M0-7V7" stroke={S} strokeWidth="1.600" /></g></g>

export const SetBacks = () => <>
  <Set k="quick-b"><path d="M26 18L38 60H190L204 18Z" fill="#0A3A3C" opacity=".35" /><g transform="translate(60 14) rotate(-14)">{groceries.bread}</g><g transform="translate(176 12) rotate(12)">{groceries.carrot}</g><g transform="translate(120 10)">{groceries.milk}</g></Set>
  <Set k="service-b"><path d="M-84-62H84V-6H-84Z" fill="#5E1E12" /><g className="st-lid"><path d="M-88-62V-78Q-88-88-76-88H76Q88-88 88-78V-62Z" fill={R} stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M-26-88V-97Q-26-104-18-104H18Q26-104 26-97V-88" fill="none" stroke={I} strokeWidth="6" {...rd} /></g></Set>
  <g clipPath="url(#cw-floor)"><Set k="hotel-b"><path d="M-86-122H86V0H-86Z" fill="#0D2E39" /><path d="M-86-30H86V0H-86Z" fill="#5B3A21" /><path d="M-70-122V-30M-35-122V-30M0-122V-30M35-122V-30M70-122V-30" stroke="#123B4A" strokeWidth="3" /><ellipse cy="-112" rx="24" ry="5" fill="#FFF3C4" /></Set></g>
  <Set k="pharmacy-b"><path d="M-50-112H50V-90H-50Z" fill="#5E2A0E" /><g className="st-lid"><rect x="-58" y="-136" width="116" height="28" rx="7" fill={W} stroke={I} strokeWidth="3" />{[-44, -30, -16, -2, 12, 26, 40].map(x => <path key={x} d={`M${x} -131v18`} stroke="#C9D3D8" strokeWidth="3" strokeLinecap="round" />)}</g></Set>
  <Set k="super-b"><path d="M-64-64H64V-6H-64Z" fill="#5A2A7A" /></Set>
  <Set k="ai-b"><path className="st-beam" d="M-26 8H26L96 128H-96Z" fill="#B8FFF6" opacity=".55" /></Set>
</>
export const SetFronts = () => <>
  <Set k="quick-f"><ellipse cx="112" cy="84" rx="96" ry="4" fill="#000" opacity=".2" /><path d="M2 2H20L40 62H192L206 16H25" fill="none" stroke={I} strokeWidth="8" {...rd} /><path d="M2 2H20L40 62H192L206 16H25" fill="none" stroke={S} strokeWidth="4.500" {...rd} /><path d="M30 31H201M35 46H197M56 17L66 62M88 17L92 62M120 17V62M152 17L148 62M182 17L172 62" fill="none" stroke={I} strokeWidth="4" {...rd} /><path d="M30 31H201M35 46H197M56 17L66 62M88 17L92 62M120 17V62M152 17L148 62M182 17L172 62" fill="none" stroke={S} strokeWidth="2" {...rd} /><path d="M-4 2H16" stroke={R} strokeWidth="9" {...rd} /><path d="M40 62L50 68H186" fill="none" stroke={I} strokeWidth="4" {...rd} /><rect x="96" y="26" width="46" height="20" rx="5" fill={Y} stroke={I} strokeWidth="2.400" /><text x="119" y="40" textAnchor="middle" fontSize="13" className="scr-t" fill={I}>FRESH</text><Wh x={60} /><Wh x={176} /></Set>
  <Set k="service-f"><ellipse rx="94" ry="5" cy="2" fill="#000" opacity=".2" /><path d="M-88-62H88V-8Q88 0 78 0H-78Q-88 0-88-8Z" fill={R} stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M-86-18H86V-8Q86-1.500 78-1.500H-78Q-86-1.500-86-8Z" fill="#A83322" /><path d="M-88-62H88V-52H-88Z" fill="#B9402C" stroke={I} strokeWidth="2.400" /><rect x="-58" y="-66" width="18" height="22" rx="4" fill={C} stroke={I} strokeWidth="2.400" /><rect x="40" y="-66" width="18" height="22" rx="4" fill={C} stroke={I} strokeWidth="2.400" /><path d="M-16-28a9 9 0 0 1 11-9l5 5 5-5a9 9 0 0 1-7 15l-9 9-6-6z" fill={W} stroke={I} strokeWidth="2.200" strokeLinejoin="round" /></Set>
  <g clipPath="url(#cw-floor)"><Set k="hotel-f"><g className="st-dl"><path d="M-86-116H0V0H-86Z" fill={C} stroke={I} strokeWidth="2.600" /><path d="M-74-104H-12V-12H-74Z" fill="none" stroke="#B98B2E" strokeWidth="3" /></g><g className="st-dr"><path d="M0-116H86V0H0Z" fill={C} stroke={I} strokeWidth="2.600" /><path d="M12-104H74V-12H12Z" fill="none" stroke="#B98B2E" strokeWidth="3" /></g><path d="M-104 2V-128Q-104-136-96-136H96Q104-136 104-128V2H88V-120H-88V2Z" fill={D} stroke={I} strokeWidth="3" strokeLinejoin="round" /><rect x="-36" y="-156" width="72" height="26" rx="8" fill={I} stroke={I} strokeWidth="2" /><text className="scr-t st-fl" y="-138" textAnchor="middle" fontSize="16" fill={Y}>LOBBY</text></Set></g>
  <Set k="pharmacy-f"><ellipse rx="78" ry="5" cy="2" fill="#000" opacity=".2" /><path d="M-58-100Q-58-112-46-112H46Q58-112 58-100L66-86V-8Q66 0 58 0H-58Q-66 0-66-8V-86Z" fill="#E39A3B" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M50-84V-12" stroke="#F4C27A" strokeWidth="7" strokeLinecap="round" /><rect x="-50" y="-76" width="86" height="56" rx="6" fill={W} stroke={I} strokeWidth="2.400" /><path d="M-34-62h10v10h10v10h-10v10h-10v-10h-10v-10h10z" fill={R} stroke={I} strokeWidth="1.800" strokeLinejoin="round" /><text x="14" y="-42" textAnchor="middle" fontSize="20" className="scr-t" fill={I}>Rx</text><path d="M-4-30h34" stroke={T} strokeWidth="3" strokeLinecap="round" /></Set>
  <Set k="super-f"><ellipse rx="74" ry="5" cy="2" fill="#000" opacity=".2" /><path d="M-66-64H66V-6Q66 0 60 0H-60Q-66 0-66-6Z" fill="#7A4BB0" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M-12-64H12V0H-12Z" fill={Y} stroke={I} strokeWidth="2.400" />{[[-40, -44], [40, -44], [-42, -18], [42, -18]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="6" fill="#A67AD6" />)}<g className="st-lid"><path d="M-74-84H74V-60H-74Z" fill="#8E5FC6" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M-12-84H12V-60H-12Z" fill={Y} stroke={I} strokeWidth="2.400" /><path d="M0-84C-34-84-36-112-18-110Q-6-108 0-84C34-84 36-112 18-110Q6-108 0-84Z" fill={Y} stroke={I} strokeWidth="2.800" strokeLinejoin="round" /></g></Set>
  <Set k="ai-f"><g className="st-ufo"><path d="M-38-6C-36-44 36-44 38-6Z" fill="#BFE6F2" opacity=".85" stroke={I} strokeWidth="2.800" /><path d="M-22-14Q-20-32-4-35" fill="none" stroke={W} strokeWidth="4" {...rd} /><path d="M-78 0Q-74-14-40-12H40Q74-14 78 0Q70 16 0 17Q-70 16-78 0Z" fill={S} stroke={I} strokeWidth="3" /><path d="M-76 2Q-40 12 0 12T76 2Q68 16 0 17Q-68 16-76 2Z" fill="#8FA0A8" />{[-52, -27, 0, 27, 52].map((x, i) => <circle key={x} className="st-lamp" style={{ animationDelay: `${i * 160}ms` }} cx={x} cy={Math.abs(x) > 40 ? 1 : 3} r="6" fill={i % 2 ? T : Y} stroke={I} strokeWidth="2" />)}</g></Set>
  {Object.entries(groceries).map(([k, v]) => <g key={k} className="cw-gr" style={hide}>{v}</g>)}
  {[...Array(16)].map((_, i) => <path key={i} className="cw-cf" d={i % 2 ? 'M-5-3H5V3H-5Z' : 'M0-6L6 4H-6Z'} fill={[R, Y, T, '#7A4BB0'][i % 4]} stroke={I} strokeWidth="1.600" style={{ opacity: 0 }} />)}
</>

function arc(a, p, q, t, high, turns) { const e = ease(t); a.x = lerp(p.x, q.x, e); a.y = lerp(p.y, q.y, e) - Math.sin(t * Math.PI) * high; a.s = lerp(p.s, q.s, e); a.rot = turns * 360 * e }
// Everyone leaves their seat, performs, and goes back
function cast(c, A, n, front, o) {
  for (let i = 0; i < n; i++) {
    const a = A[i], home = { x: a.home.x, y: FLOOR, s: a.home.s }, seat = o.seat(i), w = ramp(c, o.out + i * o.step, o.out + i * o.step + o.dur), b = ramp(c, o.in + (n - 1 - i) * o.step, o.in + (n - 1 - i) * o.step + o.dur)
    a.on = true; a.ride = false; a.air = false; a.rot = 0; a.fade = 1
    if (w <= 0 || b >= 1) { a.x = seat.x; a.y = seat.y; a.s = seat.s; a.rot = seat.r || 0; a.ride = true; a.fade = seat.f ?? 1; front(a, false) }
    else if (w < 1) { arc(a, seat, home, w, o.high, o.turns ? (i % 2 ? -o.turns : o.turns) : 0); a.air = true; front(a, o.sink ? true : w > .12) }
    else if (b > 0) { arc(a, home, seat, b, o.high, o.turns ? (i % 2 ? o.turns : -o.turns) : 0); a.air = true; front(a, b < .62) }
    else { a.x = home.x; a.y = home.y; a.s = home.s; front(a, true) }
    if (w >= 1 && !a.out) { a.out = true; a.qu -= 7 } else if (w < .5) a.out = false
  }
}
const put = (E, k, show, tr) => { const g = E.sets[k]; g.style.visibility = show ? 'visible' : 'hidden'; if (show && tr) g.setAttribute('transform', tr) }
const lid = (g, y, r, x = 0) => g.querySelector('.st-lid').setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)})`)
function confetti(E, t, x, y) { E.cf.forEach((d, i) => { const w = i / 16 * 6.283 + .2, v = 70 + i * 41 % 70; d.style.opacity = t > 0 && t < 1 ? (1 - t ** 3).toFixed(2) : 0; if (t > 0 && t < 1) d.setAttribute('transform', `translate(${(x + Math.cos(w) * v * out(t)).toFixed(1)} ${(y + Math.sin(w) * v * out(t) + t * t * 80).toFixed(1)}) rotate(${(i * 40 + t * 600).toFixed(0)}) scale(1.2)`) }) }

// QUICK: a loaded cart rolls in, everyone and the groceries jump out, then it comes back for them
export const QUICK = { len: 9600, sync: 2600 }
export function quick(c, A, E, front, now) {
  const x = c < 1250 ? lerp(-330, 86, out(c / 1250)) : c < 2600 ? 86 : c < 3450 ? lerp(86, 480, ramp(c, 2600, 3450) ** 2) : c < 6500 ? 480 : c < 7400 ? lerp(-330, 86, out(ramp(c, 6500, 7400))) : c < 8650 ? 86 : lerp(86, 500, ramp(c, 8650, 9550) ** 2)
  const go = c < 1100 || (c > 2600 && c < 3450) || (c > 6500 && c < 7250) || c > 8650, jig = go ? Math.sin(now / 38) * 1.6 : 0, r = go ? Math.sin(now / 52) * 1.3 : bump(c, 1150, 1650) * 6 + bump(c, 7300, 7700) * 4
  const show = x > -300 && x < 470, tr = `translate(${x.toFixed(1)} ${(FLOOR + 4 + jig).toFixed(1)}) rotate(${r.toFixed(2)}) scale(1.06) translate(-112 -82)`
  put(E, 'quick-b', show, tr); put(E, 'quick-f', show, tr); E.swh.forEach(w => w.setAttribute('transform', `rotate(${(x * 6 % 360).toFixed(0)})`))
  cast(c, A, 5, front, { out: 1350, in: 7420, step: 130, dur: 560, high: 78, turns: 1, seat: i => ({ x: x + (i - 2) * 33, y: FLOOR - 48 + jig, s: .33, r, f: ramp(x, -70, -30) * (1 - ramp(x, 330, 400)) }) })
  E.gr.forEach((g, i) => {
    const o = ramp(c, 1300 + i * 110, 2050 + i * 110), b = ramp(c, 7150 + i * 120, 7850 + i * 120), t = o > 0 && o < 1 ? o : b > 0 && b < 1 ? 1 - b : -1
    g.style.visibility = t >= 0 ? 'visible' : 'hidden'
    if (t >= 0) { const e = ease(t), sx = x + (i - 2.5) * 26; g.setAttribute('transform', `translate(${lerp(sx, PHONE[0], e).toFixed(1)} ${(lerp(FLOOR - 70, PHONE[1], e) - Math.sin(t * Math.PI) * 60).toFixed(1)}) rotate(${(t * 420 + i * 60).toFixed(0)}) scale(${lerp(.95, .25, e).toFixed(2)})`) }
  })
  return c > 2600 && c < 7200 ? c - 2600 : null
}

// FIXIT: a toolbox drops in and the crew climbs out
export const SERVICE = { len: 9300, sync: 1900 }
export function service(c, A, E, front, now) {
  const f = ramp(c, 0, 480), go = ramp(c, 8450, 9250), y = FLOOR + 2 - (1 - f * f) * 340 - Math.abs(Math.sin(go * Math.PI * 3)) * 44, x = 86 + go * go * 330
  const q = 1 - bump(c, 480, 720) * .2 - bump(c, 8200, 8420) * .14, r = (c > 720 && c < 940 ? Math.sin(now / 24) * 3 : 0) + go * 18, open = out(ramp(c, 940, 1150)) * (1 - ease(ramp(c, 8050, 8250)))
  const tr = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${(2 - q).toFixed(3)} ${q.toFixed(3)})`, show = c < 9250
  put(E, 'service-b', show, tr); put(E, 'service-f', show, tr); if (show) lid(E.sets['service-b'], -open * 40, -open * 15, -open * 10)
  cast(c, A, 5, front, { out: 1120, in: 6950, step: 120, dur: 540, high: 92, turns: 1, sink: true, seat: i => ({ x: x + (i - 2) * 27, y: y - 4, s: .28, f: c < 900 || c > 8250 ? 0 : 1 }) })
  return c > 1900 && c < 6900 ? Math.min(5199, c - 1900) : null
}

// HEAL: a medicine bottle drops in, the child-proof cap pops off with confetti, and the crew climbs out
export const PHARMACY = { len: 9300, sync: 1900 }
export function pharmacy(c, A, E, front, now) {
  const f = ramp(c, 0, 480), go = ramp(c, 8450, 9250), y = FLOOR + 2 - (1 - f * f) * 340 - Math.abs(Math.sin(go * Math.PI * 3)) * 44, x = 86 + go * go * 330
  const q = 1 - bump(c, 480, 720) * .2 - bump(c, 8200, 8420) * .14, r = (c > 720 && c < 940 ? Math.sin(now / 24) * 3 : 0) + go * 18
  const pop = ramp(c, 940, 1500), back = ease(ramp(c, 7700, 8200)), cap = pop >= 1 ? 1 - back : out(pop)
  const tr = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${(2 - q).toFixed(3)} ${q.toFixed(3)})`, show = c < 9250
  put(E, 'pharmacy-b', show, tr); put(E, 'pharmacy-f', show, tr)
  // The cap arcs off to the right, spinning, and lands on its side; it hops back on before the bottle leaves
  if (show) E.sets['pharmacy-b'].querySelector('.st-lid').setAttribute('transform', `translate(${(cap * 104).toFixed(1)} ${(cap * cap * 114 - Math.sin(cap * Math.PI) * 96).toFixed(1)}) rotate(${(cap * 270).toFixed(1)} 0 -122)`)
  confetti(E, ramp(c, 980, 1780), x, y - 120)
  cast(c, A, 4, front, { out: 1150, in: 6950, step: 130, dur: 560, high: 96, turns: 1, sink: true, seat: i => ({ x: x + (i - 1.5) * 30, y: y - 4, s: .3, f: c < 940 || c > 8250 ? 0 : 1 }) })
  return c > 1900 && c < 6900 ? Math.min(5199, c - 1900) : null
}

// HOTEL: an elevator comes up, the doors slide, the staff step out
export const HOTEL = { len: 9000, sync: 2000 }
export function hotel(c, A, E, front) {
  const rise = out(ramp(c, 0, 620)) * (1 - ease(ramp(c, 2520, 3000))) + out(ramp(c, 6150, 6700)) * (1 - ease(ramp(c, 8400, 8950))), y = FLOOR + 2 + (1 - rise) * 172, show = c < 3000 || (c > 6150 && c < 8950)
  const open = ease(ramp(c, 780, 1080)) * (1 - ease(ramp(c, 2200, 2500))) + ease(ramp(c, 6700, 6950)) * (1 - ease(ramp(c, 8050, 8330)))
  const tr = `translate(86 ${y.toFixed(1)})`
  put(E, 'hotel-b', show, tr); put(E, 'hotel-f', show, tr)
  if (show) { E.dl.setAttribute('transform', `translate(-86 0) scale(${(1 - open * .9).toFixed(3)} 1) translate(86 0)`); E.dr.setAttribute('transform', `translate(86 0) scale(${(1 - open * .9).toFixed(3)} 1) translate(-86 0)`) }
  cast(c, A, 5, front, { out: 1080, in: 6950, step: 110, dur: 520, high: 26, turns: 0, seat: i => ({ x: 86 + (i - 2) * 32, y: y - 6, s: .42, f: open > .03 || (c > 620 && c < 1400) ? 1 : 0 }) })
  return c > 2000 && c < 6900 ? Math.min(5199, c - 2000) : null
}

// ALL: a surprise box pops, then they squeeze back in and it leaps into the phone
export const SUPER = { len: 8600, sync: 1700 }
export function superShow(c, A, E, front, now) {
  const f = ramp(c, 0, 460), pop = ramp(c, 1000, 1500), back = ramp(c, 7450, 7720), j = ramp(c, 7900, 8500), e = ease(j)
  const x = lerp(86, PHONE[0], e), y = lerp(FLOOR + 2 - (1 - f * f) * 340, PHONE[1] + 30, e) - Math.sin(j * Math.PI) * 44, s = lerp(1.05, .04, e * e)
  const sh = c > 620 && c < 1000 ? Math.sin(now / 20) * 5 : 0, q = 1 - bump(c, 460, 700) * .24 - bump(c, 980, 1160) * .18 - bump(c, 7720, 7900) * .16, show = c < 8500
  const tr = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(sh + e * 360).toFixed(1)}) scale(${(s * (2 - q)).toFixed(3)} ${(s * q).toFixed(3)})`
  put(E, 'super-b', show, tr); put(E, 'super-f', show, tr)
  if (show) { const g = E.sets['super-f'], l = g.querySelector('.st-lid'); if (c < 7450) lid(g, -out(pop) * 210 + pop * pop * 30, pop * 50, pop * 70); else lid(g, -(1 - back * back) * 200, (1 - back) * 30, 0); l.style.opacity = c < 7450 ? 1 - ramp(pop, .6, 1) : 1 }
  confetti(E, ramp(c, 1000, 1800), 86, FLOOR - 66)
  cast(c, A, 3, front, { out: 1010, in: 6650, step: 90, dur: 640, high: 130, turns: 1, sink: true, seat: i => ({ x: x + (i - 1) * 30 * s, y: y - 6 * s, s: .3 * s, f: (c < 990 || c > 7650) ? 0 : 1 }) })
  return c > 1700 && c < 6600 ? c - 1700 : null
}

// AI: a UFO beams them down and takes them home
export const AI = { len: 8600, sync: 2000 }
export function ai(c, A, E, front, now) {
  const inn = out(ramp(c, 0, 750)), off = ramp(c, 1850, 2500) ** 2, inn2 = out(ramp(c, 6250, 6950)), off2 = ramp(c, 7900, 8550) ** 2
  const first = c < 4000, x = first ? lerp(330, 86, inn) - off * 330 : lerp(-240, 86, inn2) + off2 * 330, y = 104 + Math.sin(now / 260) * 4 - (first ? (1 - inn) * 90 + off * 130 : (1 - inn2) * 90 + off2 * 130)
  const show = c < 2500 || c > 6250, beam = (ramp(c, 750, 950) * (1 - ramp(c, 1650, 1850))) + (ramp(c, 6950, 7100) * (1 - ramp(c, 7700, 7880)))
  put(E, 'ai-b', show && beam > .02, `translate(${x.toFixed(1)} ${y.toFixed(1)})`); E.beam.setAttribute('transform', `scale(${(.3 + beam * .7).toFixed(2)} 1)`); E.beam.style.opacity = (beam * (.5 + Math.sin(now / 45) * .08)).toFixed(2)
  put(E, 'ai-f', show, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(first ? (1 - inn) * -18 + off * -20 : (1 - inn2) * 18 + off2 * 20).toFixed(1)})`)
  for (let i = 0; i < 2; i++) {
    const a = A[i], home = { x: a.home.x, y: FLOOR, s: a.home.s }, w = ramp(c, 900 + i * 180, 1600 + i * 180), b = ramp(c, 7050 + i * 160, 7650 + i * 160), t = b > 0 ? 1 - b : w
    a.ride = false; a.air = t > 0 && t < 1; a.on = t > 0; a.fade = Math.min(1, t * 2.5); a.rot = 0; front(a, true)
    const e = ease(t); a.x = lerp(x + (i - .5) * 20, home.x, e); a.y = lerp(y + 26, FLOOR, e); a.s = lerp(.1, home.s, e); a.rot = (1 - e) * 360 * (i ? -1 : 1)
    if (w >= 1 && !a.out) { a.out = true; a.qu -= 6 } else if (w < .5) a.out = false
  }
  return c > 2000 && c < 6900 ? Math.min(5199, c - 2000) : null
}
