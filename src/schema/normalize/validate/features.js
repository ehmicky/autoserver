'use strict';

const { getWordsList, assignArray, difference } = require('../../../utilities');
const { throwError } = require('../../../error');
const { getFeatures } = require('../../../filter');

// Compile-time adapter features validation
const validateFeatures = function ({
  adapter: { features, name },
  coll,
  collname,
}) {
  const requiredFeatures = getCollFeatures({ coll });
  const missingFeatures = difference(requiredFeatures, features);
  if (missingFeatures.length === 0) { return; }

  const missingFeaturesA = getWordsList(
    missingFeatures,
    { op: 'and', quotes: true },
  );
  const message = `'collections.${collname}.database' '${name}' cannot be used because that collection requires the features ${missingFeaturesA}, but that database does not support those features`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

// Retrieves features that the collection requires, which can determined by
// just the collection schema, i.e. compile-time.
// Some database features might only possible to be guessed runtime,
// e.g. the 'filter' feature.
const getCollFeatures = function ({ coll }) {
  return featuresCheckers
    .map(checker => checker({ coll }))
    .reduce(assignArray, []);
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
