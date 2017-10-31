'use strict';

const { getAdapters, getDbAdapters } = require('./map');
const { initAdapters } = require('./init');

// Create database connections
const connectToDatabases = async function ({ runOpts, schema, measures }) {
  const adapters = getAdapters({ runOpts, schema });

  const adaptersA = await initAdapters({ adapters, schema, runOpts, measures });

  const dbAdapters = getDbAdapters({ adapters: adaptersA, schema });

  return { dbAdapters };
};

module.exports = {
  connectToDatabases,
};
