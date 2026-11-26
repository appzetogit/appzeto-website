'use client'
// Tiny tracker for our own analytics (/api/a). No cookies; honours Do Not Track.
// Sends: a view per page, time and scroll depth when leaving it, and a few useful clicks.
const off = () => typeof navigator === 'undefined' || navigator.doNotTrack === '1' || window.doNotTrack === '1'
function send(body) {
  if (off()) return
  const data = JSON.stringify(body)
  if (!(navigator.sendBeacon && navigator.sendBeacon('/api/a', new Blob([data], { type: 'text/plain' })))) fetch('/api/a', { method: 'POST', body: data, keepalive: true }).catch(() => {})
}

let page = null // { path, at, depth }
const depthNow = () => { const d = document.documentElement, h = d.scrollHeight - innerHeight; return h > 0 ? Math.round(Math.min(1, scrollY / h) * 100) : 100 }
function leave() {
  if (!page) return
  send({ t: 'leave', p: page.path, d: Date.now() - page.at, s: Math.max(page.depth, depthNow()) })
  page = null
}

export function trackView(path) {
  leave()
  let first = false
  try { first = !sessionStorage.getItem('az_seen'); sessionStorage.setItem('az_seen', '1') } catch {}
  const q = new URLSearchParams(location.search), u = {}
  for (const k of ['source', 'medium', 'campaign']) if (q.get('utm_' + k)) u[k] = q.get('utm_' + k)
  send({ t: 'view', p: path, f: first, r: first ? document.referrer : '', u, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, lg: navigator.language })
  page = { path, at: Date.now(), depth: 0 }
}
export const trackEvent = (n, l) => send({ t: 'event', p: location.pathname, n, l })

// Once per page load: scroll depth, leaving the site, and the clicks that matter
export function startTracking() {
  if (window.__azTrack) return
  window.__azTrack = true
  addEventListener('scroll', () => { if (page) page.depth = Math.max(page.depth, depthNow()) }, { passive: true })
  addEventListener('pagehide', leave)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') leave(); else if (!page) page = { path: location.pathname, at: Date.now(), depth: depthNow() } })
  let started = new WeakSet()
  document.addEventListener('focusin', e => { const f = e.target.closest?.('form.form'); if (f && !started.has(f)) { started.add(f); trackEvent('form_start', location.pathname) } })
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a,button'); if (!a) return
    const href = a.getAttribute('href') || '', text = (a.textContent || '').trim().slice(0, 60)
    if (href.startsWith('tel:')) trackEvent('call', href.slice(4))
    else if (/wa\.me|whatsapp/.test(href)) trackEvent('whatsapp', text || 'WhatsApp')
    else if (href.startsWith('mailto:')) trackEvent('email', href.slice(7).split('?')[0])
    else if (a.closest('.tabset')) trackEvent('product_tab', text)
    else if (href === '/contact' || href.startsWith('/contact#') || /tell us your idea|ask for a demo|start a project/i.test(text)) trackEvent('cta', text || href)
    else if (/^https?:/.test(href) && !href.includes(location.host)) trackEvent('outbound', new URL(href).hostname)
  }, true)
}
