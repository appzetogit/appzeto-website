// Next's static export writes prefetch files nested (about/__next.about/__PAGE__.txt)
// but the browser asks for them flat (about/__next.about.__PAGE__.txt).
// Copy each one to the flat name so any static server finds it.
import { readdirSync, statSync, copyFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const out = 'out'
let n = 0
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) { if (f !== '_next') walk(p); continue }
    const parts = relative(out, p).split(sep), i = parts.findIndex(x => x.startsWith('__next.'))
    if (i < 0 || i === parts.length - 1) continue
    copyFileSync(p, join(out, ...parts.slice(0, i), parts.slice(i).join('.')))
    n++
  }
}
walk(out)
console.log(`flat-prefetch: ${n} files`)
