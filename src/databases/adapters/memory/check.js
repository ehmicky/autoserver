import { getRef } from '../../../json_refs/ref_path.js'
import { isObject } from '../../../utils/functional/type.js'

// Check for data model inconsistencies, and potentially fix them
export const check = function({
  config: { collections },
  connection,
  options,
}) {
  checkConnection({ connection })

  checkSave({ options })

  Object.keys(collections).forEach(collname =>
    checkCollection({ collname, connection }),
  )
}

const checkConnection = function({ connection }) {
  if (isObject(connection)) {
    return
  }

  throw new Error("'config.databases.memory.data' must be an object")
}

const checkSave = function({ options: { save, data } }) {
  const path = getRef(data)

  if (!save || path !== undefined) {
    return
  }

  throw new Error(
    "'config.databases.memory.data' must be a JSON reference to an object when 'config.databases.memory.save' is true",
  )
}

const checkCollection = function({ collname, connection }) {
  if (Array.isArray(connection[collname])) {
    return
  }

  if (connection[collname] !== undefined) {
    const typeofColl = typeof connection[collname]
    throw new Error(
      `Collection '${collname}' must be either an array of undefined, not ${typeofColl}`,
    )
  }

  // Add empty collection if missing
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  connection[collname] = []
}
