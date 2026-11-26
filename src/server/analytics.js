// Website analytics, kept in our own MongoDB. No cookies: a visitor is an anonymous hash of
// (address + browser + today's secret salt), so it changes every day and can't be traced to a person.
import { createHmac } from 'node:crypto'
import { db } from './db.js'

export const visits = async () => {
  const c = (await db()).collection('visits')
  if (!globalThis.__azVisitIdx) {
    globalThis.__azVisitIdx = Promise.all([
      c.createIndex({ at: 1 }, { expireAfterSeconds: 90 * 86400 }), // raw records kept 90 days
      c.createIndex({ type: 1, at: -1 }), c.createIndex({ path: 1, at: -1 }),
    ]).catch(() => { globalThis.__azVisitIdx = null })
  }
  return c
}
export const visitDays = async () => (await db()).collection('visit_days')

export const dayIST = (d = new Date()) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
export function visitorId(ip, ua) {
  const salt = createHmac('sha256', process.env.SESSION_SECRET || 'dev-salt').update('visitor:' + dayIST()).digest()
  return createHmac('sha256', salt).update(ip + '|' + ua).digest('base64url').slice(0, 16)
}

export const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp\/|curl|wget|python|axios|node-fetch|monitor|uptime/i
export function readUA(ua = '') {
  const device = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'Phone' : 'Desktop'
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Other'
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iOS/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Other'
  return { device, browser, os }
}

// Where a visit came from, in plain words
const SOCIAL = /facebook|fb\.|instagram|linkedin|lnkd|twitter|t\.co$|x\.com|youtube|youtu\.be|pinterest|reddit|quora/
const SEARCH = /google|bing|yahoo|duckduckgo|yandex|baidu|ecosia/
export function sourceOf(referrer, utm = {}, ownHost = '') {
  if (utm.source) return 'Campaign: ' + String(utm.source).slice(0, 40)
  let host = ''
  try { host = new URL(referrer).hostname.replace(/^www\./, '') } catch {}
  if (!host || host === ownHost) return 'Direct'
  if (/whatsapp|wa\.me/.test(host)) return 'WhatsApp'
  if (SEARCH.test(host)) return 'Search: ' + host.split('.')[0].replace(/^./, c => c.toUpperCase())
  if (SOCIAL.test(host)) return 'Social: ' + (/instagram/.test(host) ? 'Instagram' : /facebook|fb\./.test(host) ? 'Facebook' : /linkedin|lnkd/.test(host) ? 'LinkedIn' : /youtube|youtu/.test(host) ? 'YouTube' : /twitter|t\.co|x\.com/.test(host) ? 'X' : host)
  return host
}

// Rough region from the browser's timezone (no IP lookups)
const TZ = { 'Asia/Kolkata': 'India', 'Asia/Calcutta': 'India', 'Asia/Dubai': 'UAE', 'Asia/Riyadh': 'Saudi Arabia', 'Asia/Qatar': 'Qatar', 'Asia/Kathmandu': 'Nepal', 'Asia/Dhaka': 'Bangladesh', 'Asia/Karachi': 'Pakistan', 'Asia/Singapore': 'Singapore', 'Europe/London': 'UK', 'America/New_York': 'USA (East)', 'America/Chicago': 'USA (Central)', 'America/Los_Angeles': 'USA (West)', 'America/Toronto': 'Canada', 'Australia/Sydney': 'Australia', 'Africa/Lagos': 'Nigeria', 'Africa/Nairobi': 'Kenya' }
export const regionOf = tz => TZ[tz] || (tz ? tz.split('/')[0].replace('America', 'Americas') : 'Unknown')
