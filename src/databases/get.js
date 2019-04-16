import { getAdapter } from '../adapters/get.js'

import { databaseAdapters } from './wrap.js'

// Retrieves database adapter
const getDatabase = function(key) {
  return getAdapter({ adapters: databaseAdapters, key, name: 'database' })
}

const DEFAULT_DATABASE = 'memory'

module.exports = {
  getDatabase,
  DEFAULT_DATABASE,
}
