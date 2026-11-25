// Prints the env lines for the admin login. The password itself is never stored, only its hash.
//   npm run admin:password            (asks for the password)
//   npm run admin:password -- <pw>
import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline/promises'

let pw = process.argv[2]
if (!pw) { const rl = createInterface({ input: process.stdin, output: process.stdout }); pw = await rl.question('New admin password: '); rl.close() }
if (!pw || pw.length < 10) { console.error('Use at least 10 characters.'); process.exit(1) }
const salt = randomBytes(16).toString('hex')
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${scryptSync(pw, salt, 64).toString('hex')}`)
console.log(`SESSION_SECRET=${randomBytes(32).toString('hex')}`)
