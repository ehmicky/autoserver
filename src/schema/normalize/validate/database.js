'use strict';

const { throwError } = require('../../../error');
const { databaseAdapters } = require('../../../database');

const { validateFeatures } = require('./features');

// Validates `model.database`
const validateDatabases = function (model, { modelName }) {
  const { database } = model;

  const adapter = getAdapter({ name: database, modelName });
  validateFeatures({ adapter, model, modelName });

  const { features } = adapter;
  return { ...model, features };
};

const getAdapter = function ({ name, modelName }) {
  const adapter = databaseAdapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'models.${modelName}.database' '${name}' is unknown`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  validateDatabases,
};
