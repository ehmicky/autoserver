import { getDatabase } from '../../databases/get.js'
import { DATABASE_OPTS } from '../../databases/info.js'
import { addGenErrorHandler } from '../../errors/handler.js'
import { mapColls } from '../helpers.js'

import { validateAdaptersOpts } from './adapter_opts.js'

// Validates `collection.database` and `databases.DATABASE.*`
export const validateDatabases = ({ config, config: { databases } }) => {
  validateAdaptersOpts({
    opts: databases,
    adaptersOpts: DATABASE_OPTS,
    key: 'databases',
  })

  const { collections } = mapColls(mapColl, { config })
  return { collections }
}

const mapColl = ({ coll: { database }, coll, collname }) => {
  const dbAdapter = eGetDbAdapter({ database, collname })

  const features = eValidateStartupFeatures({ dbAdapter, coll, collname })
  return { features }
}

const getDbAdapter = ({ database }) => getDatabase(database)

const eGetDbAdapter = addGenErrorHandler(getDbAdapter, {
  message: ({ collname, database }) =>
    `'collections.${collname}.database' '${database}' is unknown`,
  reason: 'CONFIG_VALIDATION',
})

const validateStartupFeatures = ({ dbAdapter, coll }) =>
  dbAdapter.validateStartupFeatures({ coll })

const eValidateStartupFeatures = addGenErrorHandler(validateStartupFeatures, {
  message: ({ collname }, { message }) =>
    `'collections.${collname}.database': ${message}`,
  reason: 'CONFIG_VALIDATION',
})
