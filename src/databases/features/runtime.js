import { difference } from '../../utils/functional/difference.js'
import { getFeatures } from '../../filter/features.js'

import { genericValidators } from './generic.js'
import { filterValidator } from './filter.js'

// Validate database supports command features
export const validateRuntimeFeatures = function (
  { features },
  { args, clientCollname },
) {
  const message = getErrorMessage({ args, features })

  if (message === undefined) {
    return
  }

  throw new Error(
    `${message} because the collection '${clientCollname}' does not support it`,
  )
}

// Fire the validator of each feature that is not supported by the
// database adapters
const getErrorMessage = function ({ args, args: { filter }, features }) {
  const filterFeatures = getFeatures({ filter })

  const [messageA] = difference(FEATURES, features)
    .map((feature) => checkFeature({ feature, features, args, filterFeatures }))
    .filter((message) => message !== undefined)
  return messageA
}

const FEATURES = [
  'filter:_eq',
  'filter:_neq',
  'filter:_gt',
  'filter:_lt',
  'filter:_gte',
  'filter:_lte',
  'filter:_in',
  'filter:_nin',
  'filter:_like',
  'filter:_nlike',
  'filter:_or',
  'filter:_and',
  'filter:_some',
  'filter:_all',
  'filter:sibling',
  'order',
  'offset',
]

const checkFeature = function ({ feature, features, args, filterFeatures }) {
  // Features can be namespaced, e.g. `filter:*` all fire the same validator
  const validatorName = feature.replace(/:.*/u, '')

  const validator = VALIDATORS[validatorName]
  return validator({ features, args, filterFeatures })
}

const VALIDATORS = {
  ...genericValidators,
  filter: filterValidator,
}
