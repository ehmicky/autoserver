'use strict';

const { throwError, addGenErrorHandler } = require('../../errors');
const {
  databaseExists,
  getFeatures,
  DATABASE_OPTS,
  validateFeatures,
} = require('../../databases');
const { mapColls } = require('../helpers');

const { validateAdaptersOpts } = require('./adapter_opts');

// Validates `collection.database` and `databases.DATABASE.*`
const validateDatabases = function ({ config, config: { databases } }) {
  validateAdaptersOpts({
    opts: databases,
    adaptersOpts: DATABASE_OPTS,
    key: 'databases',
  });

  const { collections } = mapColls(mapColl, { config });
  return { collections };
};

const mapColl = function ({ coll: { database }, coll, collname }) {
  validateCollAdapter({ database, collname });

  const features = getFeatures({ database });

  eValidateFeatures({ database, features, coll, collname });

  return { features };
};

const eValidateFeatures = addGenErrorHandler(validateFeatures, {
  message: ({ collname }, { message }) =>
    `'collections.${collname}.database': ${message}`,
  reason: 'CONFIG_VALIDATION',
});

const validateCollAdapter = function ({ database, collname }) {
  if (databaseExists({ database })) { return; }

  const message = `'collections.${collname}.database' '${database}' is unknown`;
  throwError(message, { reason: 'CONFIG_VALIDATION' });
};

module.exports = {
  validateDatabases,
};
