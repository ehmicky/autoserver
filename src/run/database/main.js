import { mapValues } from '../../utils/functional/map.js'
import { uniq } from '../../utils/functional/uniq.js'
import { getDatabase } from '../../databases/get.js'

import { startConnections } from './connect.js'

// Create database connections
export const connectToDatabases = async function({ config, measures }) {
  const dbAdapters = getDbAdapters({ config })

  const dbAdaptersA = await startConnections({ dbAdapters, config, measures })

  const dbAdaptersB = getCollDbAdapters({ dbAdapters: dbAdaptersA, config })

  return { dbAdapters: dbAdaptersB }
}

// Returns array of all database adapters that are defined in config
const getDbAdapters = function({ config: { collections } }) {
  const names = Object.values(collections).map(({ database }) => database)
  const namesA = uniq(names)

  const dbAdapters = namesA.map(getDatabase)
  return dbAdapters
}

// Returns `{ collname: adapter }` map
const getCollDbAdapters = function({ dbAdapters, config: { collections } }) {
  return mapValues(collections, ({ database }) =>
    getCollDbAdapter({ dbAdapters, database }),
  )
}

const getCollDbAdapter = function({ dbAdapters, database }) {
  return dbAdapters.find(({ name }) => name === database)
}
