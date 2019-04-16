const { difference } = require('../../utils/functional/difference.js')
const { getWordsList } = require('../../utils/string.js')
const { getFeatures } = require('../../filter/features.js')

// Startup time adapter features validation
const validateStartupFeatures = function({ name, features }, { coll }) {
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
const getRequiredFeatures = function({ coll }) {
  return featuresCheckers.flatMap(checker => checker({ coll }))
}

// `collection.authorize` adds authorization filter, i.e. requires 'filter'
const filterChecker = function({ coll: { authorize } }) {
  if (authorize === undefined) {
    return []
  }

  return getFeatures({ filter: authorize })
}

const featuresCheckers = [filterChecker]

module.exports = {
  validateStartupFeatures,
}
