import { randomUUID } from 'node:crypto'

import { mapValues } from '../../../../utils/functional/map.js'

import { getTypeGetter } from './types/main.js'

// Builds query|mutation type
export const getTopTypes = ({ topDefs }) => {
  const graphqlSchemaId = randomUUID()
  // `getType`: recursion, while avoiding files circular dependencies
  const opts = {
    inputObjectType: 'type',
    getType,
    graphqlSchemaId,
  }

  return mapValues(topDefs, (topDef) => getType(topDef, { ...opts, topDef }))
}

// Retrieves the GraphQL type for a given config definition
const getType = (def, opts) => {
  const typeGetter = getTypeGetter(def, opts)
  const type = typeGetter.value(def, opts)
  return type
}
