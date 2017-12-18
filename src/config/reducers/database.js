'use strict';

const { throwError } = require('../../error');
const { databaseAdapters } = require('../../database');
const { mapColls } = require('../helpers');
const { compile, validate } = require('../../validation');

const { validateFeatures } = require('./features');

// Validates `collection.database` and `databases.DATABASE.*`
const validateDatabases = function ({ config, config: { databases } }) {
  Object.entries(databases)
    .forEach(([name, opts]) => validateOpts({ name, opts }));

  const { collections } = mapColls(mapColl, { config });
  return { collections };
};

const mapColl = function ({ coll: { database }, coll, collname }) {
  const adapter = getCollAdapter({ name: database, collname });
  validateFeatures({ adapter, coll, collname });

  const { features } = adapter;
  return { features };
};

const getCollAdapter = function ({ name, collname }) {
  const adapter = databaseAdapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'collections.${collname}.database' '${name}' is unknown`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// Validates `database.DATABASE.*` according to `databaseAdapter.opts`
const validateOpts = function ({ name, opts }) {
  const { opts: jsonSchema } = getOptsAdapter({ name });
  const compiledJsonSchema = compile({ jsonSchema });

  validate({
    compiledJsonSchema,
    data: opts,
    dataVar: `databases.${name}`,
    reason: 'CONF_VALIDATION',
    message: 'Wrong configuration',
  });
};

const getOptsAdapter = function ({ name }) {
  const adapter = databaseAdapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'databases.${name}' is unknown`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  validateDatabases,
};
