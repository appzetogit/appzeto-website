import '../src/fonts.css'
import '@fontsource/baloo-2/devanagari-800.css'
import '@fontsource/mukta/devanagari-400.css'
import '@fontsource/noto-serif/latin-700-italic.css'
import '../src/styles.css'
import '../src/motion.css'
import '../src/water.css'
import '../src/screens.css'
import App from '../src/App.jsx'
import { getSite, siteForPages } from '../src/server/settings.js'

// Contact details come from admin › Settings; pages refresh when they're saved (and at least hourly)
export const revalidate = 3600

export const metadata = {
  title: 'Appzeto | Websites, apps and ready-to-launch platforms',
  description: 'Appzeto designs and builds websites, mobile apps and food, taxi, quick commerce, pharmacy, home services, hotel and all-in-one apps from Indore.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F3FAF8', colorScheme: 'light only' }

// Runs before first paint: marks JS as on, and starts the opening unless motion is reduced.
const boot = "var d=document.documentElement;d.classList.add('js');if(location.pathname.indexOf('/admin')!==0&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('opening')"

// The fonts the first screen uses; preloaded so text does not redraw after the first paint
const FONTS = ['baloo-2-latin-800', 'baloo-2-latin-700', 'mukta-latin-400', 'mukta-latin-600']

export default async function RootLayout({ children }) {
  const site = siteForPages(await getSite())
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: boot }} />{FONTS.map(f => <link key={f} rel="preload" as="font" type="font/woff2" href={`/fonts/${f}-normal.woff2`} crossOrigin="anonymous" />)}</head>
    <body><div id="root"><App site={site}>{children}</App></div></body>
  </html>
}
