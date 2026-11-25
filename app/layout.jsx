import '@fontsource/baloo-2/latin-700.css'
import '@fontsource/baloo-2/latin-800.css'
import '@fontsource/baloo-2/devanagari-800.css'
import '@fontsource/mukta/latin-400.css'
import '@fontsource/mukta/latin-600.css'
import '@fontsource/mukta/devanagari-400.css'
import '@fontsource/noto-serif/latin-700-italic.css'
import '../src/styles.css'
import '../src/motion.css'
import '../src/water.css'
import '../src/screens.css'
import App from '../src/App.jsx'

export const metadata = {
  title: 'Appzeto | Websites, apps and ready-to-launch platforms',
  description: 'Appzeto designs and builds websites, mobile apps and food, taxi, quick commerce, home services, hotel and all-in-one apps from Indore.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F3FAF8', colorScheme: 'light only' }

// Runs before first paint: marks JS as on, and starts the opening unless motion is reduced.
const boot = "var d=document.documentElement;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('opening')"

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
    <body><div id="root"><App>{children}</App></div></body>
  </html>
}
