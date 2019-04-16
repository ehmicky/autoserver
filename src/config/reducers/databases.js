import { addGenErrorHandler } from '../../errors/handler.js'
import { getDatabase } from '../../databases/get.js'
import { DATABASE_OPTS } from '../../databases/info.js'
import { mapColls } from '../helpers.js'

import { validateAdaptersOpts } from './adapter_opts.js'

// Validates `collection.database` and `databases.DATABASE.*`
const validateDatabases = function({ config, config: { databases } }) {
  validateAdaptersOpts({
    opts: databases,
    adaptersOpts: DATABASE_OPTS,
    key: 'databases',
  })

  const { collections } = mapColls(mapColl, { config })
  return { collections }
}

const mapColl = function({ coll: { database }, coll, collname }) {
  const dbAdapter = eGetDbAdapter({ database, collname })

  const features = eValidateStartupFeatures({ dbAdapter, coll, collname })
  return { features }
}

const getDbAdapter = function({ database }) {
  return getDatabase(database)
}

const eGetDbAdapter = addGenErrorHandler(getDbAdapter, {
  message: ({ collname, database }) =>
    `'collections.${collname}.database' '${database}' is unknown`,
  reason: 'CONFIG_VALIDATION',
})

const validateStartupFeatures = function({ dbAdapter, coll }) {
  return dbAdapter.validateStartupFeatures({ coll })
}

const eValidateStartupFeatures = addGenErrorHandler(validateStartupFeatures, {
  message: ({ collname }, { message }) =>
    `'collections.${collname}.database': ${message}`,
  reason: 'CONFIG_VALIDATION',
})

module.exports = {
  validateDatabases,
}
