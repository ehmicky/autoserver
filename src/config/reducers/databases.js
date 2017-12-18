'use strict';

const { throwError } = require('../../error');
const { databaseAdapters } = require('../../database');
const { mapColls } = require('../helpers');

const { validateAdaptersOpts } = require('./adapter_opts');
const { validateFeatures } = require('./features');

// Validates `collection.database` and `databases.DATABASE.*`
const validateDatabases = function ({ config, config: { databases } }) {
  validateAdaptersOpts({
    opts: databases,
    adapters: databaseAdapters,
    key: 'databases',
  });

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

module.exports = {
  validateDatabases,
};
