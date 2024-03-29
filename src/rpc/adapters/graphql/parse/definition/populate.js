import { uniq } from '../../../../../utils/functional/uniq.js'

// Retrieve `rpcDef.args.populate` using GraphQL selection sets
export const addPopulate = ({ args, args: { select }, commandName }) => {
  if (!commandName.startsWith('find_')) {
    return args
  }

  const selects = select
    .split(',')
    .map((selectA) => selectA.replace(PARENT_SELECT_REGEXP, ''))
    .filter((selectA) => selectA !== '')
  const selectsA = uniq(selects)

  if (selectsA.length === 0) {
    return args
  }

  const populate = selectsA.join(',')

  const argsA = { ...args, populate }
  return argsA
}

// Keep only parent path, e.g. 'parent.child' -> 'parent'
const PARENT_SELECT_REGEXP = /\.?[^.]+$/u
