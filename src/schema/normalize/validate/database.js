'use strict';

const { throwError } = require('../../../error');
const { databaseAdapters } = require('../../../database');

const { validateFeatures } = require('./features');

// Validates `model.database`
const validateDatabases = function (model, { collname }) {
  const { database } = model;

  const adapter = getAdapter({ name: database, collname });
  validateFeatures({ adapter, model, collname });

  const { features } = adapter;
  return { ...model, features };
};

const getAdapter = function ({ name, collname }) {
  const adapter = databaseAdapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'models.${collname}.database' '${name}' is unknown`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  validateDatabases,
};
