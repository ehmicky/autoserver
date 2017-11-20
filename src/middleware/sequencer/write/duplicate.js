'use strict';

const { throwError } = require('../../../error');
const { isEqual, flatten, groupValuesBy } = require('../../../utilities');

// We remove duplicates for several reasons:
//  - efficiency
//  - avoid problem with idempotent commands, e.g. deleting twice the same
//    model in the same request would fail
//  - output consistency, i.e. each model has a single representation for a
//    given request
const removeDuplicates = function ({ models }) {
  const modelsA = flatten(models);
  const modelsB = groupValuesBy(modelsA, 'id');

  const modelsC = modelsB.map(getUniqueModel);
  return modelsC;
};

const getUniqueModel = function (models) {
  validateDuplicates(models);

  return models[0];
};

// If user specified two models with same id but different content, throw error
const validateDuplicates = function (models) {
  const differentModel = models
    .slice(1)
    .find(model => !isEqual(model, models[0]));
  if (differentModel === undefined) { return; }

  const message = `Two models in 'data' have the same 'id' but different attributes: '${JSON.stringify(models[0])}', '${JSON.stringify(differentModel)}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  removeDuplicates,
};
