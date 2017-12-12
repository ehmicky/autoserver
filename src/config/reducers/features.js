'use strict';

const { getWordsList, flatten, difference } = require('../../utilities');
const { throwError } = require('../../error');
const { getFeatures } = require('../../filter');

// Startup time adapter features validation
const validateFeatures = function ({
  adapter: { features, name },
  coll,
  collname,
}) {
  const requiredFeatures = getRequiredFeatures({ coll });
  const missingFeatures = difference(requiredFeatures, features);
  if (missingFeatures.length === 0) { return; }

  const missingFeaturesA = getWordsList(
    missingFeatures,
    { op: 'and', quotes: true },
  );
  const message = `'collections.${collname}.database' '${name}' cannot be used because that collection requires the features ${missingFeaturesA}, but that database does not support those features`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// Retrieves features that the collection requires, which can determined by
// just the collection config, i.e. startup time.
// Some database features might only possible to be guessed runtime,
// e.g. the 'filter' feature.
const getRequiredFeatures = function ({ coll }) {
  const requiredFeatures = featuresCheckers.map(checker => checker({ coll }));
  const requiredFeaturesA = flatten(requiredFeatures);
  return requiredFeaturesA;
};

// `collection.authorize` adds authorization filter, i.e. requires 'filter'
const filterChecker = function ({ coll: { authorize } }) {
  if (authorize === undefined) { return []; }

  return getFeatures({ filter: authorize });
};

const featuresCheckers = [
  filterChecker,
];

module.exports = {
  validateFeatures,
};
