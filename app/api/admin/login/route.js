import { COOKIE, cookieOpts, ipOf, locked, makeSession, sameOrigin, tryLogin } from '../../../../src/server/auth.js'

export const dynamic = 'force-dynamic'
export async function POST(req) {
  if (!sameOrigin(req)) return Response.json({ error: 'Bad origin' }, { status: 403 })
  const ip = ipOf(req)
  if (locked(ip)) return Response.json({ error: 'Too many wrong tries. Wait 15 minutes and try again.' }, { status: 429 })
  let b = {}
  try { b = await req.json() } catch {}
  const user = String(b.user || '').trim().toLowerCase()
  if (!await tryLogin(ip, user, String(b.password || ''))) return Response.json({ error: 'Wrong username or password.' }, { status: 401 })
  const res = Response.json({ ok: true })
  res.headers.append('Set-Cookie', cookie(COOKIE, makeSession(user), cookieOpts()))
  return res
}
export async function DELETE(req) {
  if (!sameOrigin(req)) return Response.json({ error: 'Bad origin' }, { status: 403 })
  const res = Response.json({ ok: true })
  res.headers.append('Set-Cookie', cookie(COOKIE, '', { ...cookieOpts(), maxAge: 0 }))
  return res
}
function cookie(name, value, o) {
  return [`${name}=${value}`, `Path=${o.path}`, `Max-Age=${o.maxAge}`, 'HttpOnly', `SameSite=Strict`, o.secure && 'Secure'].filter(Boolean).join('; ')
}
