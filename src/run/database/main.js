'use strict';

const { databaseAdapters } = require('../../database');

const { validateDbOpts } = require('./validate');
const { getAdaptersMap } = require('./map');
const { validateFeatures } = require('./features');
const { startConnections } = require('./connect');

// Create database connections
const connectToDatabases = async function ({ runOpts, schema, measures }) {
  const adapters = getAdapters({ runOpts });

  validateDbOpts({ adapters, schema });

  const adaptersMap = getAdaptersMap({ adapters, schema });

  validateFeatures({ adaptersMap, adapters, schema });

  const dbAdapters = await startConnections({
    adapters,
    adaptersMap,
    schema,
    runOpts,
    measures,
  });
  return { dbAdapters };
};

// Transform `runOpts.db` to array of adapters, by merging with them
const getAdapters = function ({ runOpts: { db } }) {
  return Object.entries(db)
    .filter(([, { enabled }]) => enabled !== false)
    .map(([type, { models, ...options }]) =>
      ({ ...databaseAdapters[type], type, models, options }));
};

module.exports = {
  connectToDatabases,
};
