'use strict';

const { getAdapters, getDbAdapters } = require('./map');
const { initAdapters } = require('./init');

// Create database connections
const connectToDatabases = async function ({ schema, measures }) {
  const adapters = getAdapters({ schema });

  const adaptersA = await initAdapters({ adapters, schema, measures });

  const dbAdapters = getDbAdapters({ adapters: adaptersA, schema });

  return { dbAdapters };
};

module.exports = {
  connectToDatabases,
};
