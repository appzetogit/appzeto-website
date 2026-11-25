// MongoDB connection, shared across requests (and across hot reloads in dev).
// Production: MONGODB_URI. Dev without it: a local MongoDB kept in .data/mongo.
import { MongoClient } from 'mongodb'
import { mkdirSync } from 'node:fs'

const g = globalThis
export function db() {
  g.__azDb ??= (async () => {
    let uri = process.env.MONGODB_URI
    if (!uri) {
      if (process.env.NODE_ENV === 'production') throw new Error('MONGODB_URI is not set')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      mkdirSync('.data/mongo', { recursive: true })
      const m = await MongoMemoryServer.create({ instance: { dbPath: '.data/mongo', storageEngine: 'wiredTiger' } })
      uri = m.getUri()
    }
    const client = await new MongoClient(uri).connect()
    const d = client.db(process.env.MONGODB_DB || 'appzeto_website')
    const leads = d.collection('leads')
    await Promise.all([leads.createIndex({ createdAt: -1 }), leads.createIndex({ status: 1, createdAt: -1 }), leads.createIndex({ kind: 1, createdAt: -1 })])
    return d
  })().catch(e => { g.__azDb = undefined; throw e })
  return g.__azDb
}
export const leads = async () => (await db()).collection('leads')
