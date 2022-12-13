import { GraphQLNonNull, GraphQLList } from 'graphql'

import { getArgTypeDescription } from '../../../../description.js'

// `data` argument
export const getDataArgument = (def, opts) => {
  // Only for mutation commands, but not delete
  const hasData = DATA_COMMAND_TYPES.has(def.command)

  if (!hasData) {
    return {}
  }

  const type = getDataObjectType(def, opts)
  const description = getArgTypeDescription(def, 'argData')

  return { data: { type, description } }
}

const getDataObjectType = ({ command }, { dataObjectType }) => {
  // Only multiple with createMany or upsertMany
  const isMultiple = MANY_DATA_COMMAND_TYPES.has(command)

  // Add required and array modifiers
  if (isMultiple) {
    return new GraphQLNonNull(new GraphQLList(dataObjectType))
  }

  return new GraphQLNonNull(dataObjectType)
}

const DATA_COMMAND_TYPES = new Set(['create', 'upsert', 'patch'])
const MANY_DATA_COMMAND_TYPES = new Set(['create', 'upsert'])
