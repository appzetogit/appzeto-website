'use client'
// Below-the-fold sections on page changes: the hero mounts at once, the rest a beat later,
// one at a time, so arriving on a heavy page doesn't freeze the curtain.
// The first load (hydration) renders everything, exactly like the server HTML.
import { useEffect, useState } from 'react'

let booted = false
export const markBooted = () => { booted = true }
// True once the first page has loaded: later pages are reached through the curtain, not the opening
export const isBooted = () => booted

export default function Later({ i = 0, h = 700, children }) {
  const [on, setOn] = useState(!booted)
  useEffect(() => {
    if (on) return
    const t = setTimeout(() => { setOn(true); requestAnimationFrame(() => dispatchEvent(new Event('appzeto:more'))) }, 140 + i * 90)
    return () => clearTimeout(t)
  }, [])
  return on ? children : <div style={{ minHeight: h }} aria-hidden="true" />
}
