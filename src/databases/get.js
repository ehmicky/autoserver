import { getAdapter } from '../adapters/get.js'

import { databaseAdapters } from './wrap.js'

// Retrieves database adapter
export const getDatabase = (key) =>
  getAdapter({ adapters: databaseAdapters, key, name: 'database' })

export const DEFAULT_DATABASE = 'memory'
