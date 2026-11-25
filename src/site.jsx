'use client'
// Contact details for the pages, loaded on the server (admin › Settings) and passed down from the layout.
import { createContext, useContext } from 'react'
import defaults from './settings.js'

export const SiteCtx = createContext(defaults)
export const useSite = () => useContext(SiteCtx)
export const waLinkOf = s => s.whatsapp && `https://wa.me/${s.whatsapp}?text=${encodeURIComponent('Hi Appzeto, I have an idea.')}`
