import { useEffect, useRef } from 'react'

// Googly eyes for the logo A (600x200 logo space). Pupils follow the pointer, glance around when idle, and blink.
export default function Eyes({ r = 16 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current, ps = [...el.querySelectorAll('.ey-p')]
    let last = -1e9, raf = 0
    const look = (x, y) => ps.forEach(p => { p.style.transform = `translate(${(x * r * .48).toFixed(1)}px,${(y * r * .48).toFixed(1)}px)` })
    const mv = e => {
      last = performance.now(); cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => { const b = el.getBoundingClientRect(), dx = e.clientX - b.left - b.width / 2, dy = e.clientY - b.top - b.height / 2, n = Math.hypot(dx, dy) || 1, k = Math.min(1, n / 60); look(dx / n * k, dy / n * k) })
    }
    const glance = setInterval(() => { if (!document.hidden && performance.now() - last > 1600) { const a = Math.random() * 6.28; look(Math.cos(a) * .9, Math.sin(a) * .7) } }, 1100)
    addEventListener('pointermove', mv, { passive: true })
    return () => { clearInterval(glance); cancelAnimationFrame(raf); removeEventListener('pointermove', mv) }
  }, [])
  return <g ref={ref} className="ey">{[70, 102].map(x => <g key={x} transform={`translate(${x} 72)`}><g className="ey-b"><circle r={r} fill="#fff" stroke="#06282A" strokeWidth="3" /><g className="ey-p"><circle r={r * .48} fill="#06282A" /><circle cx={-r * .15} cy={-r * .18} r={r * .15} fill="#fff" /></g></g></g>)}</g>
}
