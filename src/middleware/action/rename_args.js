import underscoreString from 'underscore.string'

import { mapKeys } from '../../utils/functional/map.js'

// Change arguments cases to camelCase
export const renameArgs = ({ actions }) => {
  const actionsA = actions.map(renameActionArgs)
  return { actions: actionsA }
}

const renameActionArgs = ({ args, ...action }) => {
  const argsA = mapKeys(args, (arg, name) => underscoreString.camelize(name))
  return { ...action, args: argsA }
}
