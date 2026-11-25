// Static export: `npm run build` writes plain HTML/CSS/JS to out/, served by nginx like before.
export default {
  output: 'export',
  images: { unoptimized: true },
  // The Vite app didn't run under StrictMode; keep effects running once in dev too.
  reactStrictMode: false,
}
