// Runs once when the server starts: background jobs (retention clean-up, follow-up emails).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.MONGODB_URI) (await import('./src/server/jobs.js')).start()
}
