'use strict'

const { wrapAdapters } = require('../adapters/wrap.js')

const { DATABASE_ADAPTERS } = require('./adapters/main.js')
const { connectDatabase } = require('./connect')
const { validateStartupFeatures } = require('./features/startup.js')
const { validateRuntimeFeatures } = require('./features/runtime.js')

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
