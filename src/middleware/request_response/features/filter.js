'use strict';

const { getWordsList, difference } = require('../../../utilities');

// Adapter feature 'filter:OPERATOR' allows for
// `args.filter: { attrName: { OPERATOR: value } }`
const filterValidator = function ({ features, filterFeatures }) {
  const ops = getOps({ features, filterFeatures });
  if (ops.length === 0) { return; }

  if (ops.includes('or')) {
    return 'In \'filter\' argument, must not use an array of alternatives';
  }

  const opsA = getWordsList(ops, { op: 'nor', quotes: true });
  return `In 'filter' argument, must not use the operators ${opsA}`;
};

const getOps = function ({ features, filterFeatures }) {
  return difference(filterFeatures, features)
    .map(feature => feature.replace(/.*:/, ''));
};

module.exports = {
  filterValidator,
};
