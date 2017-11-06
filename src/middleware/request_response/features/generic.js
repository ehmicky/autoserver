'use strict';

const { assignObject } = require('../../../utilities');

// Adapter feature `featureName` allows for `args[argName]`
const getGenericValidator = function ({ argName, dbName, featureName }) {
  const validator = genericValidator.bind(null, { argName, dbName });
  return { [featureName]: validator };
};

const genericValidator = function ({ argName, dbName }, { args }) {
  if (args[dbName] === undefined) { return; }

  return `Must not use argument '${argName}'`;
};

const FEATURES = [
  { argName: 'orderby', dbName: 'orderby', featureName: 'orderby' },
  { argName: 'page', dbName: 'offset', featureName: 'offset' },
];

const genericValidators = FEATURES
  .map(getGenericValidator)
  .reduce(assignObject, {});

module.exports = {
  genericValidators,
};
