'use strict';

const { difference } = require('../../../utilities');
const { throwError } = require('../../../errors');
const { FEATURES } = require('../../../databases');
const { getFeatures } = require('../../../filter');

const { genericValidators } = require('./generic');
const { filterValidator } = require('./filter');

// Validate database supports command features
const validateFeatures = function ({
  args,
  collname,
  clientCollname,
  dbAdapters,
}) {
  const { features } = dbAdapters[collname];

  const message = getErrorMessage({ args, features });

  if (message === undefined) { return; }

  const messageA = `${message} because the collection '${clientCollname}' does not support it`;
  throwError(messageA, { reason: 'WRONG_FEATURE' });
};

// Fire the validator of each feature that is not supported by the
// database adapters
const getErrorMessage = function ({ args, args: { filter }, features }) {
  const filterFeatures = getFeatures({ filter });

  const [messageA] = difference(FEATURES, features)
    .map(feature => checkFeature({ feature, features, args, filterFeatures }))
    .filter(message => message !== undefined);
  return messageA;
};

const checkFeature = function ({ feature, features, args, filterFeatures }) {
  // Features can be namespaced, e.g. `filter:*` all fire the same validator
  const validatorName = feature.replace(/:.*/, '');

  const validator = VALIDATORS[validatorName];
  return validator({ features, args, filterFeatures });
};

const VALIDATORS = {
  ...genericValidators,
  filter: filterValidator,
};

module.exports = {
  validateFeatures,
};
