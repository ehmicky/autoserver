import { getArgTypeDescription } from '../../../../description.js'

// `filter` argument
export const getFilterArgument = (def, { filterObjectType }) => {
  const hasFilter = FILTER_COMMAND_TYPES.has(def.command)

  if (!hasFilter) {
    return {}
  }

  const description = getArgTypeDescription(def, 'argFilter')

  return { filter: { type: filterObjectType, description } }
}

const FILTER_COMMAND_TYPES = new Set(['find', 'delete', 'patch'])
