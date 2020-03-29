import { wrapAdapters } from '../adapters/wrap.js'

import { DATABASE_ADAPTERS } from './adapters/main.js'
import { connectDatabase } from './connect.js'
import { validateRuntimeFeatures } from './features/runtime.js'
import { validateStartupFeatures } from './features/startup.js'

const members = ['name', 'title', 'idName', 'features', 'getDefaultId']

const methods = {
  connect: connectDatabase,
  validateStartupFeatures,
  validateRuntimeFeatures,
}

export const databaseAdapters = wrapAdapters({
  adapters: DATABASE_ADAPTERS,
  members,
  methods,
  reason: 'DATABASE',
})
