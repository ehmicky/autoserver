'use strict';

const { mapValues, uniq } = require('../../utilities');
const { getDatabase } = require('../../databases');

const { startConnections } = require('./connect');

// Create database connections
const connectToDatabases = async function ({ config, measures }) {
  const dbAdapters = getDbAdapters({ config });

  const dbAdaptersA = await startConnections({ dbAdapters, config, measures });

  const dbAdaptersB = getCollDbAdapters({ dbAdapters: dbAdaptersA, config });

  return { dbAdapters: dbAdaptersB };
};

// Returns array of all database adapters that are defined in config
const getDbAdapters = function ({ config: { collections } }) {
  const names = Object.values(collections).map(({ database }) => database);
  const namesA = uniq(names);

  const dbAdapters = namesA.map(getDatabase);
  return dbAdapters;
};

// Returns `{ collname: adapter }` map
const getCollDbAdapters = function ({ dbAdapters, config: { collections } }) {
  return mapValues(
    collections,
    ({ database }) => getCollDbAdapter({ dbAdapters, database }),
  );
};

const getCollDbAdapter = function ({ dbAdapters, database }) {
  return dbAdapters.find(({ name }) => name === database);
};

module.exports = {
  connectToDatabases,
};
