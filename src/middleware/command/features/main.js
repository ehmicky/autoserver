'use strict';

const { difference } = require('lodash');

const { FEATURES } = require('../../../constants');

const { filterValidator } = require('./filter');

// Validate database supports command features
const validateFeatures = function ({ args, modelName, dbAdapters }) {
  const { features } = dbAdapters[modelName];

  // Fire the validator of each feature that is not supported
  // by the database adapters
  difference(FEATURES, features)
    .forEach(feature => validators[feature]({ args, modelName }));
};

const validators = {
  filter: filterValidator,
};

module.exports = {
  validateFeatures,
};
