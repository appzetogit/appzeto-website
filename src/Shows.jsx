'use client'
// Big set pieces for the crew: the cab that brings TAXI, and the burger that FOOD bursts out of.
const I = '#06282A', T = '#06A4A5', W = '#fff', Y = '#FAFD0F', G = '#33A77A', R = '#D9482B'
const rd = { strokeLinecap: 'round', strokeLinejoin: 'round' }
export const FLOOR = 236, PHONE = [86, 92]
const cl = (n, a, b) => Math.max(a, Math.min(b, n)), lerp = (a, b, t) => a + (b - a) * t
const ramp = (c, a, b) => cl((c - a) / (b - a), 0, 1), ease = t => t < .5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2, out = t => 1 - (1 - t) ** 3

const Wheel = ({ x }) => <g transform={`translate(${x} 54)`}><circle r="15" fill="#14181B" stroke={I} strokeWidth="2" /><g className="cw-wh"><circle r="10" fill="#C9D3D8" /><circle r="8.400" fill="#8FA0A8" />{[0, 72, 144, 216, 288].map(a => <path key={a} transform={`rotate(${a})`} d="M-1.700 0L-2.600-9H2.600L1.700 0z" fill="#EEF2F4" />)}<circle r="2.600" fill="#5E6E76" /></g></g>
// 208 x 70, nose to the right, open top
export const CabBack = () => <g className="cw-cab" style={{ visibility: 'hidden' }}><path d="M44 34Q44 16 54 16H62Q68 16 68 24V34M96 34V18Q96 12 102 12H108Q114 12 114 18V34" fill="#7A4B2B" stroke={I} strokeWidth="2.200" /><path d="M46 28H156V46H46z" fill="#2A1A12" /><path d="M140 30L128 6" stroke={I} strokeWidth="4" {...rd} /></g>
export const CabFront = () => <g className="cw-cab" style={{ visibility: 'hidden' }}>
  <ellipse cx="104" cy="69" rx="98" ry="4" fill="#000" opacity=".22" /><path d="M128 5L150 30" stroke={I} strokeWidth="4.500" {...rd} /><path d="M129 8L147 29H133Z" fill="#BFE6F2" opacity=".55" />
  <path d="M4 47C3 37 8 32 18 30Q32 25 46 28H158L188 31C200 33 206 39 205 48C205 54 202 56 197 56H11C6 56 4 53 4 47Z" fill="#F7F9FA" stroke={I} strokeWidth="2.600" strokeLinejoin="round" />
  <path d="M5 47C5 53 7 55 12 55H196C202 55 204 52 204 48L203 45C150 49 60 49 6 44Z" fill="#CFD8DC" /><path d="M14 35C70 38 140 38 198 38" fill="none" stroke={W} strokeWidth="1.600" />
  <path d="M64 41H146V47H64z" fill={I} />{[...Array(10)].map((_, i) => <path key={i} d={`M${64 + i * 8.2} ${i % 2 ? 44 : 41}h8.200v3h-8.200z`} fill={Y} />)}
  <path d="M100 30V53M66 30Q62 42 68 53M148 30Q152 42 146 53" fill="none" stroke="#B4C0C6" strokeWidth="1.300" /><path d="M84 35h9M128 35h9" stroke="#8FA0A8" strokeWidth="2.400" strokeLinecap="round" />
  <text x="83" y="58" fontSize="0" /><path d="M190 33C199 34 203 37 204 41L192 39z" fill="#FFF3C4" stroke="#B4C0C6" strokeWidth=".8" /><path d="M6 34L16 32 15 39 5 40z" fill={R} /><path d="M199 48h6v5h-8z" fill="#1B2226" />
  <path d="M28 56a18 18 0 0 1 36 0zM146 56a18 18 0 0 1 36 0z" fill="#1B2226" /><Wheel x={46} /><Wheel x={164} />
</g>

const seeds = [[-42, -24], [-22, -33], [0, -36], [22, -33], [42, -24], [-32, -14], [-10, -20], [12, -20], [32, -14]]
// Burger layers, each drawn around its own bottom centre
const LAYERS = {
  bunB: <><path d="M-74-22H74Q76 0 56 0H-56Q-76 0-74-22Z" fill="#E39A3B" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M-72-20H72Q72-13 66-13H-66Q-72-13-72-20Z" fill="#F6D7A0" /></>,
  patty: <><path d="M-76-9Q-76-20-64-20H64Q76-20 76-9T64 2H-64Q-76 2-76-9Z" fill="#6B3A1F" stroke={I} strokeWidth="3" /><path d="M-56-12h12M-20-7h14M14-13h12M44-7h10" stroke="#4A2612" strokeWidth="4" {...rd} /></>,
  cheese: <path d="M-76-7H76L58 2 40-5 26 12 10-5-18-5-36 9-54-4Z" fill="#FFC93C" stroke={I} strokeWidth="2.600" strokeLinejoin="round" />,
  tomato: <><path d="M-68-11H-6Q0-11 0-5T-6 1H-68Q-74 1-74-5T-68-11ZM6-11H68Q74-11 74-5T68 1H6Q0 1 0-5T6-11Z" fill={R} stroke={I} strokeWidth="2.600" /><path d="M-60-7H-22M18-7H56" stroke="#F2836B" strokeWidth="3" {...rd} /></>,
  lettuce: <path d="M-82-8Q-70-18-58-10Q-46-19-34-10Q-22-19-10-10Q2-19 14-10Q26-19 38-10Q50-19 62-10Q74-18 82-8Q74 8 62 1Q50 11 38 2Q26 11 14 2Q2 11-10 2Q-22 11-34 2Q-46 11-58 2Q-72 8-82-8Z" fill="#6CC24A" stroke={I} strokeWidth="2.600" strokeLinejoin="round" />,
  bunT: <><path d="M-76 0Q-80-50 0-52Q80-50 76 0Q0 6-76 0Z" fill="#E39A3B" stroke={I} strokeWidth="3" strokeLinejoin="round" /><path d="M-58-22Q-48-40-18-44" fill="none" stroke="#F6BE6B" strokeWidth="6" {...rd} />{seeds.map(([x, y]) => <ellipse key={x + '' + y} cx={x} cy={y} rx="4" ry="2.300" transform={`rotate(${x / 2} ${x} ${y})`} fill="#FFF1CF" stroke="#B9772A" strokeWidth=".8" />)}</>,
}
export const Burger = () => <g className="cw-bg" style={{ visibility: 'hidden' }}>{Object.entries(LAYERS).map(([k, v]) => <g key={k} className="cw-ly" data-k={k}>{v}</g>)}
  {[...Array(14)].map((_, i) => <path key={i} className="cw-cr" d={['M-5-5H6L3 5H-4Z', 'M-6 0Q0-7 6 0Q0 5-6 0Z', 'M0-6L6 4H-6Z'][i % 3]} fill={['#FFC93C', '#6CC24A', R, '#E39A3B'][i % 4]} stroke={I} strokeWidth="1.800" strokeLinejoin="round" />)}</g>

const W2 = ({ x }) => <g transform={`translate(${x} -13)`}><circle r="13" fill="#14181B" stroke={I} strokeWidth="2" /><g className="cw-sw"><circle r="7.500" fill="#C9D3D8" /><path d="M-7 0H7M0-7V7M-5-5L5 5M-5 5L5-5" stroke="#5E6E76" strokeWidth="1.600" /></g></g>
// Drawn around its own ground centre, nose to the right
export const Scooter = () => <g className="cw-set" data-k="food-s" style={{ visibility: 'hidden' }}><ellipse cx="0" cy="1" rx="62" ry="4" fill="#000" opacity=".2" />{[0, 1, 2].map(i => <circle key={i} className="cw-pf" r="7" fill={W} stroke={I} strokeWidth="1.800" />)}
  <path d="M44-13L30-66H20" fill="none" stroke={I} strokeWidth="7" {...rd} /><path d="M12-68L34-64" stroke={I} strokeWidth="6" {...rd} /><circle cx="38" cy="-54" r="6" fill="#FFF3C4" stroke={I} strokeWidth="2.200" />
  <path d="M-58-16Q-60-38-40-41H-6Q2-41 4-30L6-20H20L26-52Q36-50 40-38L46-22Q46-14 38-14H-50Q-58-12-58-16Z" fill={W} stroke={I} strokeWidth="2.800" strokeLinejoin="round" /><path d="M-56-20Q-30-30 4-26L6-20H20Q30-20 44-20Q45-14 38-14H-50Q-57-13-56-20Z" fill={R} /><path d="M-46-44H-2Q2-40-2-36H-44Q-50-40-46-44Z" fill="#14181B" stroke={I} strokeWidth="2" /><path d="M-60-30h6v7h-6z" fill={R} stroke={I} strokeWidth="1.600" /><W2 x={-38} /><W2 x={44} /></g>

const arc = (a, p, q, t, high, turns) => { const e = ease(t); a.x = lerp(p.x, q.x, e); a.y = lerp(p.y, q.y, e) - Math.sin(t * Math.PI) * high; a.s = lerp(p.s, q.s, e); a.rot = turns * 360 * e }

// TAXI. Returns {perf} in ms while the crew is performing, else {perf:null}
export const TAXI = { len: 9600, sync: 2500 }
export function taxi(c, A, E, front, now) {
  const x = c < 1300 ? lerp(-330, 86, out(c / 1300)) : c < 2450 ? 86 : c < 3350 ? lerp(86, 480, ramp(c, 2450, 3350) ** 2) : c < 6300 ? 480 : c < 7300 ? lerp(-330, 86, out(ramp(c, 6300, 7300))) : c < 8500 ? 86 : lerp(86, 500, ramp(c, 8500, 9500) ** 2)
  const moving = c < 1150 || (c > 2450 && c < 3350) || (c > 6300 && c < 7150) || c > 8500
  const nod = Math.sin(ramp(c, 1050, 1500) * Math.PI) * 3 + Math.sin(ramp(c, 7050, 7500) * Math.PI) * 3 - Math.sin(ramp(c, 8500, 8800) * Math.PI) * 4, hop = moving ? Math.abs(Math.sin(now / 60)) * -2 : 0
  const show = x > -300 && x < 470
  E.cab.forEach(g => { g.style.visibility = show ? 'visible' : 'hidden'; g.setAttribute('transform', `translate(${x.toFixed(1)} ${(FLOOR + 3 + hop).toFixed(1)}) rotate(${nod.toFixed(2)}) scale(1.06) translate(-104 -69)`) })
  E.wheels.forEach(w => w.setAttribute('transform', `rotate(${(x * 3.6 % 360).toFixed(0)})`))
  for (let i = 0; i < 4; i++) {
    const a = A[i], seat = { x: x + [26, 3, -20, -43][i] * 1.06, y: FLOOR - 22 + hop, s: .34 }, home = { x: a.home.x, y: FLOOR, s: a.home.s }
    const o = ramp(c, 1400 + i * 210, 1980 + i * 210), n = ramp(c, 7350 + (3 - i) * 210, 7930 + (3 - i) * 210)
    a.on = true; a.ride = false; a.air = false; a.rot = 0; a.fade = 1
    if (o <= 0 || n >= 1) { a.x = seat.x; a.y = seat.y; a.s = seat.s; a.rot = nod * 1.5; a.ride = true; front(a, false); a.fade = ramp(x, -70, -30) * (1 - ramp(x, 330, 400)) }
    else if (o < 1) { arc(a, seat, home, o, 66, i % 2 ? -1 : 1); a.air = true; front(a, true) }
    else if (n > 0) { arc(a, home, seat, n, 72, i % 2 ? 1 : -1); a.air = true; front(a, n < .62) }
    else { a.x = home.x; a.y = home.y; a.s = home.s; front(a, true) }
    if (o >= 1 && !a.out) { a.out = true; a.qu -= 8 } else if (o < .5) a.out = false
  }
  return c > 2500 && c < 7300 ? (c - 2500) * 1.05 : null
}

// FOOD: the burger bursts into O-O-D; F rides in from the left on a scooter and completes the word.
export const FOOD = { len: 11300, sync: 3250 }
const REST = { bunB: 0, patty: -21, cheese: -40, tomato: -44, lettuce: -53, bunT: -60 }
const STACK = { bunB: 0, patty: -21, cheese: -40, lettuce: -46, tomato: -84, bunT: -92 }
const FLY = { bunB: [0, 60, 0], patty: [150, -20, 160], cheese: [-160, -40, -200], tomato: [170, -150, 220], lettuce: [-175, -140, -180], bunT: [12, -250, 70] }
const IN = { bunB: 8250, patty: 8350, cheese: 8470, lettuce: 9230, tomato: 9330, bunT: 9450 }
export function food(c, A, E, front, now) {
  const g = { x: 86, y: FLOOR, s: 1, sy: 1, r: 0 }, part = {}
  let seen = c < 1950 || c > 8150
  const fall = ramp(c, 0, 620), burst = ramp(c, 1200, 1950)
  if (c < 1950) {
    g.y = FLOOR - (1 - fall * fall) * 330; g.sy = 1 - Math.sin(ramp(c, 620, 860) * Math.PI) * .28
    const sh = ramp(c, 820, 1200); if (sh > 0 && !burst) { g.r = Math.sin(now / 22) * 5 * sh; g.sy += sh * .12; g.s = 1 + sh * .08 }
    for (const k in REST) { const [fx, fy, fr] = FLY[k], e = out(burst); part[k] = [fx * e, REST[k] + fy * e + burst * burst * 90, fr * e, burst ? 1 - ramp(burst, .55, 1) : 1] }
  } else {
    for (const k in STACK) { const t = ramp(c, IN[k], IN[k] + 240), h = k === 'bunB' ? 0 : 190; part[k] = [0, STACK[k] - (1 - t * t) * h, (1 - t) * (k === 'bunT' ? 30 : 12), k === 'bunB' ? t : ramp(c, IN[k], IN[k] + 60)] }
    g.sy = 1 - Math.sin(ramp(c, 9690, 9930) * Math.PI) * .2
    const b = ramp(c, 9930, 10480); g.y = FLOOR - Math.abs(Math.sin(b * Math.PI * 2)) * 22; g.r = Math.sin(b * Math.PI * 4) * 4
    const j = ramp(c, 10500, 11150); if (j > 0) { const e = ease(j); g.x = lerp(86, PHONE[0], e); g.y = lerp(FLOOR, PHONE[1] + 20, e) - Math.sin(j * Math.PI) * 40; g.s = lerp(1, .04, e * e); g.r = e * 360; if (j >= 1) seen = false }
  }
  E.burger.style.visibility = seen ? 'visible' : 'hidden'
  if (seen) {
    const sq = g.s * (2 - g.sy)
    E.burger.setAttribute('transform', `translate(${g.x.toFixed(1)} ${g.y.toFixed(1)}) rotate(${g.r.toFixed(1)}) scale(${sq.toFixed(3)} ${(g.s * g.sy).toFixed(3)})`)
    E.layers.forEach(l => { const p = part[l.dataset.k]; l.setAttribute('transform', `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${p[2].toFixed(0)})`); l.style.opacity = p[3].toFixed(2) })
    E.crumbs.forEach((d, i) => { const w = i / 14 * 6.283 + .3, v = 90 + (i * 37 % 70), e = out(burst); d.style.opacity = burst > 0 && burst < 1 ? (1 - burst ** 3).toFixed(2) : 0; if (burst > 0 && burst < 1) d.setAttribute('transform', `translate(${(Math.cos(w) * v * e).toFixed(1)} ${(-50 + Math.sin(w) * v * e + burst * burst * 70).toFixed(1)}) rotate(${(i * 50 + burst * 500).toFixed(0)}) scale(1.3)`) })
  }
  // The scooter: in from the left, brakes beside the word, waits for F to hop off, rolls back out
  const stop = A[0].home.x + 4, ride = out(ramp(c, 1700, 2650)), leave = ramp(c, 3250, 4000) ** 2
  const sx = lerp(-230, stop, ride) - leave * 330, moving = (c > 1700 && c < 2480) || c > 3250, jig = moving ? Math.sin(now / 34) * 1.2 : 0
  const wheelie = -Math.sin(ramp(c, 1750, 2250) * Math.PI) * 13 + Math.sin(ramp(c, 2450, 2800) * Math.PI) * 9, on = c > 1700 && c < 4000
  const sc = E.sets['food-s']; sc.style.visibility = on ? 'visible' : 'hidden'
  if (on) { sc.setAttribute('transform', `translate(${sx.toFixed(1)} ${(FLOOR + 4 + jig).toFixed(1)}) rotate(${wheelie.toFixed(1)}) scale(.98)`); E.scw.forEach(w => w.setAttribute('transform', `rotate(${(sx * 6 % 360).toFixed(0)})`)); E.puff.forEach((p, i) => { const t = (now / 520 + i / 3) % 1; p.setAttribute('transform', `translate(${(-52 - t * 34).toFixed(1)} ${(-14 - t * 14).toFixed(1)}) scale(${(.5 + t).toFixed(2)})`); p.style.opacity = moving ? (1 - t).toFixed(2) : 0 }) }
  for (let i = 0; i < 4; i++) {
    const a = A[i], home = { x: a.home.x, y: FLOOR, s: a.home.s }, n = ramp(c, 8480 + i * 150, 9050 + i * 150)
    const px = (i - 1.5) * 34, py = -42, pk = { x: g.x + px * g.s, y: g.y + py * g.s * g.sy, s: .29 * g.s }
    const o = i ? ramp(c, 1200 + i * 70, 1930 + i * 70) : ramp(c, 2760, 3250)
    a.on = (i ? o > 0 : c > 1700) && c < 11150; a.ride = false; a.air = false; a.drive = false; a.rot = 0; a.fade = 1
    if (o < 1) {
      if (i) { arc(a, { x: 86, y: FLOOR - 44, s: .1 }, home, o, 96 + (i % 2) * 22, i < 2 ? -1 : 1); a.s = lerp(.1, home.s, Math.sqrt(o)); a.air = true; front(a, true) }
      else {
        const seat = { x: sx - 8, y: FLOOR - 21 + jig, s: .5 }
        if (o <= 0) { a.x = seat.x; a.y = seat.y; a.s = seat.s; a.rot = wheelie; a.ride = a.drive = true; a.fade = 1; front(a, false) }
        else { arc(a, seat, home, o, 60, 1); a.air = true; front(a, true) }
      }
    } else if (n >= 1) { a.x = pk.x; a.y = pk.y; a.s = pk.s; a.rot = g.r; a.ride = true; front(a, false) }
    else if (n > 0) { arc(a, home, pk, n, 84, i % 2 ? 1 : -1); a.air = true; front(a, n < .66) }
    else { a.x = home.x; a.y = home.y; a.s = home.s; front(a, true) }
    if (o >= 1 && !a.out) { a.out = true; a.qu -= 8 } else if (o < .5) a.out = false
  }
  return c > 3250 && c < 8250 ? Math.min(5199, c - 3250) : null
}
export const hideShows = E => { E.cab.forEach(g => { g.style.visibility = 'hidden' }); E.burger.style.visibility = 'hidden'; Object.values(E.sets).forEach(g => { g.style.visibility = 'hidden' }); E.gr.forEach(g => { g.style.visibility = 'hidden' }); E.cf.forEach(g => { g.style.opacity = 0 }) }
