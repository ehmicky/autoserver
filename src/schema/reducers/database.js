'use strict';

const { throwError } = require('../../error');
const { databaseAdapters } = require('../../database');
const { mapColls } = require('../helpers');

const { validateFeatures } = require('./features');

// Validates `collection.database`
const mapColl = function ({ coll: { database }, coll, collname }) {
  const adapter = getAdapter({ name: database, collname });
  validateFeatures({ adapter, coll, collname });

  const { features } = adapter;
  return { features };
};

const getAdapter = function ({ name, collname }) {
  const adapter = databaseAdapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'collections.${collname}.database' '${name}' is unknown`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

const validateDatabases = mapColls.bind(null, mapColl);

module.exports = {
  validateDatabases,
};
