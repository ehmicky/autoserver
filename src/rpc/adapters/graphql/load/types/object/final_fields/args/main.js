import { getArgTypeDescription } from '../../../../description.js'

import { getDataArgument } from './data.js'
import { getFilterArgument } from './filter.js'
import { getIdArgument } from './id.js'
import { getOrderArgument } from './order.js'
import { getPaginationArgument } from './pagination.js'
import { getSilentArgument } from './silent.js'
import { getDryrunArgument } from './dryrun.js'
import { getCascadeArgument } from './cascade.js'
import { getParamsArgument } from './params.js'

// Retrieves all resolver arguments, before resolve function is fired
export const getArgs = function (def, opts) {
  // Only for top-level actions
  const isTopLevel = TOP_LEVEL_COLLS.has(opts.parentDef.clientCollname)

  if (!isTopLevel) {
    return
  }

  const optsA = getArgTypes(def, opts)

  return {
    ...getDataArgument(def, optsA),
    ...getFilterArgument(def, optsA),
    ...getIdArgument(def, optsA),
    ...getCascadeArgument(def, optsA),
    ...getOrderArgument(def, optsA),
    ...getPaginationArgument(def, optsA),
    ...getDryrunArgument(def, optsA),
    ...getSilentArgument(def, optsA),
    ...getParamsArgument(def, optsA),
  }
}

const TOP_LEVEL_COLLS = new Set(['Query', 'Mutation'])

// Builds types used for `data` and `filter` arguments
const getArgTypes = function (def, opts) {
  const dataObjectType = getArgType(def, opts, 'data')
  const filterObjectType = getArgType(def, opts, 'filter')
  return { ...opts, dataObjectType, filterObjectType }
}

const getArgType = function (def, opts, inputObjectType) {
  const description = getArgTypeDescription(def, inputObjectType)
  const defA = { ...def, arrayWrapped: true, description }

  const { getType } = opts
  const optsA = { ...opts, inputObjectType }

  return getType(defA, optsA)
}
