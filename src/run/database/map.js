'use strict';

const { mapValues, getWordsList } = require('../../utilities');
const { throwError } = require('../../error');

// Retrieve `{ model: 'database', ... }`
const getAdaptersMap = function ({ adapters, schema }) {
  return mapValues(
    schema.models,
    (model, modelName) => findAdapter({ adapters, modelName }).name,
  );
};

const findAdapter = function ({ adapters, modelName }) {
  if (adapters.length === 1) {
    return adapters[0];
  }

  // Find first adapter with `db.DATABASE.models` 'model'
  const adaptersA = adapters.filter(({ models }) => models.includes(modelName));

  if (adaptersA.length === 1) {
    return adaptersA[0];
  }

  validateAdapters({ adapters: adaptersA, modelName });

  // Find any adapter with `db.DATABASE.models` '...'
  const adaptersB = adapters.filter(({ models }) => models.includes('...'));

  validateRestAdapters({ adapters: adaptersB, modelName });

  return adaptersB[0];
};

const validateAdapters = function ({ adapters, modelName }) {
  if (adapters.length > 1) {
    const options = getModelsOpts({ adapters });
    const message = `Invalid options: ${options}. They all target the model '${modelName}' but each model must be targeted by only a single database`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

const validateRestAdapters = function ({ adapters, modelName }) {
  if (adapters.length === 0) {
    const message = `Invalid option 'db': model '${modelName}' does have any matching database`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  if (adapters.length > 1) {
    const options = getModelsOpts({ adapters });
    const message = `Invalid options: ${options}. They cannot both include the '...' value`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

const getModelsOpts = function ({ adapters }) {
  const options = adapters.map(({ name }) => `db.${name}.models`);
  const optionsA = getWordsList(options, { op: 'and', quotes: true });
  return optionsA;
};

module.exports = {
  getAdaptersMap,
};
