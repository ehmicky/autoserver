import { uniq } from '../../utils/functional/uniq.js'

import { wrapCloseFunc } from './wrapper.js'

// Attempts to close database connections
// No new connections will be accepted, but we will wait for ongoing ones to end
export const closeDbAdapters = function({ dbAdapters, config, measures }) {
  const dbAdaptersA = Object.values(dbAdapters)
  // The same `dbAdapter` can be used for several models
  const dbAdaptersB = uniq(dbAdaptersA)

  return dbAdaptersB.map(adapter =>
    eCloseDbAdapter({ type: 'databases', adapter, config, measures }),
  )
}

const closeDbAdapter = function({ adapter: { disconnect } }) {
  return disconnect()
}

const eCloseDbAdapter = wrapCloseFunc(closeDbAdapter)
