'use client'
// The few React Router pieces the site used, rebuilt on Next's router.
// Every link goes through App's go(), so the curtain can rise before the page changes.
import { createContext, useContext, useEffect } from 'react'
import NextLink from 'next/link'

export const Nav = createContext(null)
export const useLocation = () => useContext(Nav).loc

const plain = (e, p) => !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !p.target

export function Link({ to, onClick, ...p }) {
  const nav = useContext(Nav)
  return <NextLink href={to} scroll={false} {...p} onClick={e => { onClick?.(e); if (plain(e, p)) { e.preventDefault(); nav.go(to) } }} />
}

// Same matching as React Router's NavLink: the path itself or anything under it.
export function NavLink({ to, className, ...p }) {
  const { pathname } = useLocation(), on = pathname === to || pathname.startsWith(to.replace(/\/$/, '') + '/')
  return <Link to={to} className={[className, on && 'active'].filter(Boolean).join(' ') || undefined} aria-current={on ? 'page' : undefined} {...p} />
}

export function Navigate({ to, replace }) {
  const nav = useContext(Nav)
  useEffect(() => { nav.go(to, { replace }) }, [])
  return null
}
