'use strict';

const { difference } = require('lodash');

const { getWordsList } = require('../../../utilities');
const { throwError } = require('../../../error');

// Adapter feature 'filter:OPERATOR' allows for
// `args.filter: { attrName: { OPERATOR: value } }`
const filterValidator = function ({ features, filterFeatures, modelName }) {
  const ops = getOps({ features, filterFeatures });
  if (ops.length === 0) { return; }

  const message = getErrorMessage({ ops });
  const messageA = `In 'filter' argument, must not ${message} because the model '${modelName}' does not support it`;
  throwError(messageA, { reason: 'WRONG_FEATURE' });
};

const getOps = function ({ features, filterFeatures }) {
  return difference(filterFeatures, features)
    .map(feature => feature.replace(/.*:/, ''));
};

const getErrorMessage = function ({ ops }) {
  if (ops.includes('or')) {
    return 'use an array of alternatives';
  }

  const opsA = getWordsList(ops, { op: 'nor', quotes: true });
  return `use the operators: ${opsA}`;
};

module.exports = {
  filterValidator,
};
