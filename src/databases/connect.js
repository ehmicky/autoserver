import omit from 'omit.js'

import { mapValues } from '../utils/functional/map.js'

// Start database connection
// Returns a copy of the database adapter, but with fewer members and some other
// members bound
export const connectDatabase = async (
  { connect, check, ...rest },
  { options, config },
) => {
  const connection = await connect({ options, config })

  // Check for data model inconsistencies, and potentially fix them
  if (check !== undefined) {
    check({ options, config, connection })
  }

  const dbAdapterA = getDbAdapter({ options, connection, config, ...rest })
  return dbAdapterA
}

// Pass database state (e.g. connection) to some database adapter's methods
const getDbAdapter = ({
  options,
  connection,
  config,
  disconnect,
  query,
  wrapped,
}) => {
  const methods = mapValues({ disconnect, query }, (method) =>
    wrapMethod.bind(undefined, { method, options, connection, config }),
  )

  // Do not connect twice
  const dbAdapter = omit.default(wrapped, ['connect', 'check'])

  const dbAdapterA = { ...methods, ...dbAdapter }
  return dbAdapterA
}

const wrapMethod = ({ method, ...rest }, input, ...args) =>
  method({ ...rest, ...input }, ...args)
