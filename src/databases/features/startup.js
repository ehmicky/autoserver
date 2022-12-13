import { getFeatures } from '../../filter/features.js'
import { difference } from '../../utils/functional/difference.js'
import { getWordsList } from '../../utils/string.js'

// Startup time adapter features validation
export const validateStartupFeatures = ({ name, features }, { coll }) => {
  const requiredFeatures = getRequiredFeatures({ coll })
  const missingFeatures = difference(requiredFeatures, features)

  if (missingFeatures.length === 0) {
    return features
  }

  const missingFeaturesA = getWordsList(missingFeatures, {
    op: 'and',
    quotes: true,
  })
  throw new Error(
    `'${name}' cannot be used because that collection requires the features ${missingFeaturesA}, but that database does not support those features`,
  )
}

// Retrieves features that the collection requires, which can determined by
// just the collection config, i.e. startup time.
// Some database features might only possible to be guessed runtime,
// e.g. the 'filter' feature.
const getRequiredFeatures = ({ coll }) =>
  featuresCheckers.flatMap((checker) => checker({ coll }))

// `collection.authorize` adds authorization filter, i.e. requires 'filter'
const filterChecker = ({ coll: { authorize } }) => {
  if (authorize === undefined) {
    return []
  }

  return getFeatures({ filter: authorize })
}

const featuresCheckers = [filterChecker]
