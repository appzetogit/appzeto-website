'use client'
import { useEffect, useId, useRef } from 'react'
import g from './glyphs.js'
import Screen from './Screens.jsx'

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds .live while the element is on screen; all loops are paused without it.
export function useLive() {
  const ref = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.target.classList.toggle('live', e.isIntersecting), { threshold: 0.15 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return ref
}

export function Letter({ k }) {
  return <path d={g[k]} fill="#06A4A5" stroke="#0D5353" strokeWidth="1.2" fillRule="evenodd" />
}
export function LetterA() {
  return <><path d={g.A} transform="translate(.8 -3)" fill="none" stroke="#06282A" strokeWidth="1.2" /><path d={g.A} fill="#06A4A5" stroke="#0D5353" strokeWidth="1.6" fillRule="evenodd" /></>
}
export function PhoneBody({ children, off }) {
  const id = useId().replace(/[^\w-]/g, '')
  return <>
    <rect x="40" y="3" width="90" height="181" rx="14" fill="#33A77A" />
    <path d="M40 23h90v4H40zM40 159h90v4H40z" fill="#fff" />
    <rect x="43" y="28.5" width="84" height="127" fill="#2A8C68" />
    <clipPath id={id}><rect x="45.5" y="31" width="79" height="122" /></clipPath>
    <rect x="45.5" y="31" width="79" height="122" fill={off ? '#0D5353' : '#FAFD0F'} />
    <g clipPath={`url(#${id})`}>{children}</g>
    <path d="M74 14.5h30" stroke="#FAFD0F" strokeWidth="3" strokeLinecap="round" />
    <circle className="home-dot" cx="88.5" cy="172.5" r="5" fill={off ? '#2A8C68' : '#FAFD0F'} />
    <rect className="slip" x="43.5" y="4.5" width="89" height="180" rx="14" fill="none" stroke="#06282A" strokeWidth="1.6" />
  </>
}
export function Phone({ name, off, className = '', children }) {
  return <svg className={`phone ${className}`} viewBox="36 0 100 188" aria-hidden="true">
    <PhoneBody off={off}>{children || (name !== undefined && <g key={name} className="sc-in"><g transform="translate(45 30.4) scale(.507)"><Screen name={name} /></g></g>)}</PhoneBody>
  </svg>
}
export function LogoCompact({ className = '' }) {
  return <svg className={className} viewBox="36 0 540 192" role="img" aria-label="Appzeto"><PhoneBody /><g className="logo-a"><LetterA /></g>{['p1', 'p2', 'z', 'e', 't', 'o'].map(k => <Letter key={k} k={k} />)}</svg>
}
