'use strict';

const { difference } = require('lodash');

const { getWordsList, assignArray } = require('../../utilities');
const { throwError } = require('../../error');
const { getFeatures } = require('../../filter');

// Startup-time adapter features validation
const validateFeatures = function ({ adaptersMap, adapters, schema }) {
  Object.entries(adaptersMap).forEach(([modelName, adapterName]) =>
    validateAdapter({ adapters, schema, modelName, adapterName }));
};

const validateAdapter = function ({
  adapters,
  schema: { models },
  modelName,
  adapterName,
}) {
  const model = models[modelName];
  const adapter = adapters.find(({ name }) => name === adapterName);
  validateModel({ model, modelName, adapter });
};

const validateModel = function ({
  model,
  modelName,
  adapter: { features, name },
}) {
  const modelFeatures = getModelFeatures({ model });
  const featuresA = difference(modelFeatures, features);
  if (featuresA.length === 0) { return; }

  const featuresB = getWordsList(featuresA, { op: 'and', quotes: true });
  const message = `Database '${name}' cannot target model '${modelName}' because that model requires the features ${featuresB}, but that database does not support those features`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// Retrieves features that the model requires, which can determined by
// just the model schema, i.e. startup time.
// Some database features might only possible to be guessed query-time,
// e.g. the 'filter' feature.
const getModelFeatures = function ({ model }) {
  return featuresCheckers
    .map(checker => checker({ model }))
    .reduce(assignArray, []);
};

// `model.authorize` adds authorization filter, i.e. requires 'filter'
const filterChecker = function ({ model: { authorize } }) {
  if (authorize === undefined) { return []; }

  return getFeatures({ filter: authorize });
};

const featuresCheckers = [
  filterChecker,
];

module.exports = {
  validateFeatures,
};
