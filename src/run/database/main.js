'use strict';

const { getAdapters, getDbAdapters } = require('./map');
const { initAdapters } = require('./init');

// Create database connections
const connectToDatabases = async function ({ config, measures }) {
  const adapters = getAdapters({ config });

  const adaptersA = await initAdapters({ adapters, config, measures });

  const dbAdapters = getDbAdapters({ adapters: adaptersA, config });

  return { dbAdapters };
};

module.exports = {
  connectToDatabases,
};
