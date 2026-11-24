// Phones only: coloured panels hold "water" that stays level as the phone tilts.
const still = matchMedia('(prefers-reduced-motion: reduce)').matches
const phone = matchMedia('(pointer: coarse) and (max-width: 820px)').matches
const hosts = new Map()
let goal = 0, lift = 0, seen = 0, a = 0, v = 0, y = 0, raf = 0, last = 0, splashAt = 0

function tilt(e) {
  if (e.gamma == null || e.beta == null) return
  const r = Math.PI / 180, o = (screen.orientation?.angle ?? 0) * r
  const gx = Math.sin(e.gamma * r) * Math.cos(e.beta * r), gy = Math.sin(e.beta * r)
  const sx = gx * Math.cos(o) + gy * Math.sin(o), sy = -gx * Math.sin(o) + gy * Math.cos(o)
  const ang = Math.atan2(sx, Math.max(.35, sy)) / r // lying flat: stay calm
  goal = -Math.max(-32, Math.min(32, ang))
  lift = Math.max(-1, Math.min(1, (.75 - sy) / .75)) * -14
  seen = performance.now()
  if (!asked) { asked = true; ask() }
}
function splash(h) {
  for (let n = 0; n < 6; n++) {
    const d = document.createElement('b'); d.className = 'wt-d'; d.style.left = 15 + Math.random() * 70 + '%'; d.style.top = '42%'; h.box.append(d)
    const x = (Math.random() - .5) * 90
    d.animate([{ transform: 'translate(0,0) scale(.4)' }, { transform: `translate(${x / 2}px,${-50 - Math.random() * 50}px)`, offset: .45, easing: 'ease-in' }, { transform: `translate(${x}px,60px) scale(.6)` }], { duration: 800, easing: 'ease-out' }).onfinish = () => d.remove()
  }
}
function frame(now) {
  const dt = Math.min(.034, (now - last) / 1000); last = now
  const g = now - seen < 1500 ? goal : Math.sin(now / 1300) * 4
  v += ((g - a) * 42 - v * 3.2) * dt; a += v * dt; y += ((now - seen < 1500 ? lift : 0) - y) * dt * 4
  const amp = 1 + Math.min(1.1, Math.abs(v) / 70)
  for (const [, h] of hosts) if (h.on) {
    h.tilt.style.transform = `translateY(${y.toFixed(1)}px) rotate(${a.toFixed(2)}deg)`
    h.front.style.transform = `scaleY(${amp.toFixed(2)})`; h.back.style.transform = `rotate(${(-v / 30).toFixed(2)}deg)`
    if (Math.abs(v) > 95 && now - splashAt > 700) splash(h)
  }
  if (Math.abs(v) > 95 && now - splashAt > 700) splashAt = now
  raf = !document.hidden && [...hosts.values()].some(h => h.on) ? requestAnimationFrame(frame) : 0
}
const wake = () => { if (!raf && !still) { last = performance.now(); raf = requestAnimationFrame(frame) } }
const io = phone && new IntersectionObserver(es => { es.forEach(e => { const h = hosts.get(e.target); if (h) { h.on = e.isIntersecting; h.box.classList.toggle('run', h.on) } }); wake() })

let asked = false, btn
const needsAsk = () => typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'
function ask() {
  if (btn && !btn.isConnected) btn = null
  const want = needsAsk() && !asked && hosts.size && !still
  if (want && !btn) {
    btn = Object.assign(document.createElement('button'), { className: 'wt-ask', type: 'button', textContent: 'Tilt to play' })
    btn.onclick = async () => { asked = true; btn.remove(); btn = null; try { await DeviceOrientationEvent.requestPermission() } catch { /* waves stay automatic */ } }
    const first = hosts.keys().next().value
    ;(first.matches('.sh-panel') ? first.parentNode.querySelector('.sh-stage') || first : first).append(btn)
  } else if (!want && btn) { btn.remove(); btn = null }
}
function scan() {
  for (const el of hosts.keys()) if (!el.isConnected) { io.unobserve(el); hosts.delete(el) }
  document.querySelectorAll('.sh-panel:not(.wt-on),.prod-row:not(.wt-on)').forEach(el => {
    const box = document.createElement('div'); box.className = 'wt'; box.setAttribute('aria-hidden', 'true')
    box.innerHTML = '<div class="wt-tilt"><div class="wt-w wt-b"><i></i></div><div class="wt-w"><i></i></div></div>'
    el.append(box); el.classList.add('wt-on')
    hosts.set(el, { box, tilt: box.firstChild, back: box.firstChild.children[0], front: box.firstChild.children[1], on: false }); io.observe(el)
  })
  ask()
}
if (phone) {
  if (!still) addEventListener('deviceorientation', tilt)
  document.addEventListener('visibilitychange', wake)
  new MutationObserver(scan).observe(document.getElementById('root'), { childList: true, subtree: true }); scan()
}
