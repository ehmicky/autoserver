'use strict';

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
  { argName: 'order', dbName: 'order', featureName: 'order' },
  { argName: 'page', dbName: 'offset', featureName: 'offset' },
];

const genericValidators = FEATURES.map(getGenericValidator);
const genericValidatorsA = Object.assign({}, ...genericValidators);

module.exports = {
  genericValidators: genericValidatorsA,
};
