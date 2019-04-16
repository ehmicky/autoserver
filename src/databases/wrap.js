import { wrapAdapters } from '../adapters/wrap.js'

import { DATABASE_ADAPTERS } from './adapters/main.js'
import { connectDatabase } from './connect.js'
import { validateStartupFeatures } from './features/startup.js'
import { validateRuntimeFeatures } from './features/runtime.js'

const members = ['name', 'title', 'idName', 'features', 'getDefaultId']

const methods = {
  connect: connectDatabase,
  validateStartupFeatures,
  validateRuntimeFeatures,
}

const databaseAdapters = wrapAdapters({
  adapters: DATABASE_ADAPTERS,
  members,
  methods,
  reason: 'DATABASE',
})

module.exports = {
  databaseAdapters,
}
