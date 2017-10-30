'use strict';

const { difference } = require('lodash');

const { FEATURES } = require('../../../constants');
const { getFeatures } = require('../../../filter');

const { filterValidator } = require('./filter');

// Validate database supports command features
const validateFeatures = function ({
  args,
  args: { filter },
  modelName,
  dbAdapters,
}) {
  const { features } = dbAdapters[modelName];

  const filterFeatures = getFeatures({ filter });

  // Fire the validator of each feature that is not supported
  // by the database adapters
  difference(FEATURES, features)
    .forEach(feature => validateFeature({
      feature,
      features,
      args,
      filterFeatures,
      modelName,
    }));
};

const validateFeature = function ({
  feature,
  features,
  args,
  filterFeatures,
  modelName,
}) {
  const validatorName = feature.replace(/:.*/, '');
  const validator = validators[validatorName];
  return validator({ features, args, filterFeatures, modelName });
};

const validators = {
  filter: filterValidator,
};

module.exports = {
  validateFeatures,
};
