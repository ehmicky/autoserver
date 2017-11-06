'use strict';

const { throwError } = require('../../../error');
const { databaseAdapters } = require('../../../database');

const { validateFeatures } = require('./features');

// Validates `model.database`
const validateDatabases = function (model, { modelname }) {
  const { database } = model;

  const adapter = getAdapter({ name: database, modelname });
  validateFeatures({ adapter, model, modelname });

  const { features } = adapter;
  return { ...model, features };
};

const getAdapter = function ({ name, modelname }) {
  const adapter = databaseAdapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'models.${modelname}.database' '${name}' is unknown`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  validateDatabases,
};
