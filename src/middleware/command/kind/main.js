'use strict';

const { difference } = require('lodash');

const { KINDS } = require('../../../constants');

const { searchValidator } = require('./search');

// Validate command conforms to `model.kind`
const validateKind = function ({ args, modelName, schema: { models } }) {
  const { kind: kinds } = models[modelName];

  // Fire the validator of each kind that is not among `model.kind`
  const nonKinds = difference(KINDS, kinds);
  nonKinds.forEach(nonKind =>
    validators[nonKind] && validators[nonKind]({ args, modelName }));
};

const validators = {
  search: searchValidator,
};

module.exports = {
  validateKind,
};
