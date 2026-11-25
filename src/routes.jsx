'use client'
// Product and service pages share one component instance across their own kind,
// like they did under React Router, so moving Food -> Taxi updates in place
// (the mascot does its letter-swap hop instead of being rebuilt).
import { usePathname } from 'next/navigation'
import { Navigate } from './router.jsx'
import { products } from './data.js'
import { Product, Service } from './views/Inner.jsx'

export function ProductRoute() {
  const p = products.find(x => x.path === usePathname())
  return p ? <Product p={p} /> : null
}
export function ServiceRoute() {
  return <Service slug={usePathname().split('/')[2]} />
}
export { Navigate }
