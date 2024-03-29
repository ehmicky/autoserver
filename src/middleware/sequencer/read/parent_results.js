import { isDeepStrictEqual } from 'node:util'

import { getSimpleFilter } from '../../../filter/simple_id.js'
import { uniq } from '../../../utils/functional/uniq.js'

// Retrieve the results of all direct parent commands
// E.g. when firing `find_collection { child { id } }`,
// the nested `child` action needs to know `model.child` first before being
// fired.
export const getParentResults = ({ commandpath, results }) => {
  const parentPath = commandpath.slice(0, -1)
  return results.filter((result) => isParentResults({ result, parentPath }))
}

const isParentResults = ({ result: { path, promise }, parentPath }) => {
  if (promise !== undefined) {
    return false
  }

  const pathA = path.filter((index) => typeof index !== 'number')
  return isDeepStrictEqual(pathA, parentPath)
}

// Reduce parent results to only the information the child needs: the `id`s
// related to its own action.
// If the parent is an *Many command, `parentResults` will be an array.
// `nestedParentIds` keep that nesting, `parentIds` flattens it.
// `nestedParentIds` is useful to assemble results back, while `parentIds` is
// useful to build `args.filter`.
// `allIds` is like `parentIds`, but with duplicate models. It is used to
// check against `maxmodels` limit
export const getParentIds = ({ commandName, parentResults }) => {
  const nestedParentIds = parentResults.map(({ model }) => model[commandName])
  const allIds = nestedParentIds.flat().filter((ids) => ids !== undefined)
  // We remove duplicate `id`, for efficiency reasons
  const parentIds = uniq(allIds)

  return { nestedParentIds, parentIds, allIds }
}

// Make nested collections filtered by their parent model
// E.g. if a model find_parent() returns { child: 1 },
// then a nested query find_child() will be filtered by `id: 1`
// If the parent returns nothing|null, the nested query won't be performed
// and null will be returned
export const addNestedFilter = ({ args, isTopLevel, parentIds }) => {
  if (isTopLevel) {
    return args
  }

  const filter = getSimpleFilter({ ids: parentIds })
  return { ...args, filter }
}
