'use strict';

const { databaseAdapters } = require('../../database');

const { getAdaptersMap } = require('./map');
const { validateDbOpts, validateUnusedAdapters } = require('./validate');
const { startConnections } = require('./connect');

// Create database connections
const connectToDatabases = async function ({ runOpts, schema }) {
  const adapters = getAdapters({ runOpts });

  validateDbOpts({ adapters, schema });

  const adaptersMap = getAdaptersMap({ adapters, schema });

  validateUnusedAdapters({ adapters, adaptersMap });

  const dbAdapters = await startConnections({
    adapters,
    adaptersMap,
    schema,
    runOpts,
  });
  return { dbAdapters };
};

// Transform `runOpts.db` to array of adapters, by merging with them
const getAdapters = function ({ runOpts: { db = defaultDb } }) {
  return Object.entries(db).map(([type, { models = [], ...options }]) =>
    ({ ...databaseAdapters[type], type, models, options }));
};

// Default `runOpts.db` options if none is specified
const defaultDb = {
  memory: {},
};

module.exports = {
  connectToDatabases,
};
