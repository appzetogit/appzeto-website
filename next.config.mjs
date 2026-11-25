// Server mode (for the lead API and /admin). Public pages are still pre-rendered at build time.
// `standalone` bundles only what the server needs, for pm2 on the VPS.
export default {
  output: 'standalone',
  images: { unoptimized: true },
  // The Vite app didn't run under StrictMode; keep effects running once in dev too.
  reactStrictMode: false,
  poweredByHeader: false,
  serverExternalPackages: ['mongodb', 'mongodb-memory-server'],
  async headers() {
    return [{ source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }, { key: 'Cache-Control', value: 'no-store' }] }]
  },
}
