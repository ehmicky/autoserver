'use strict';

const { mapValues, uniq } = require('../../utilities');
const { databaseAdapters } = require('../../databases');

// Returns array of all adapters that are defined in config
const getAdapters = function ({ config: { collections, databases } }) {
  const names = Object.values(collections).map(({ database }) => database);
  const namesA = uniq(names);
  const databaseAdaptersA = namesA
    .map(name => ({ ...databaseAdapters[name], options: databases[name] }));
  return databaseAdaptersA;
};

// Returns `{ collname: adapter }` map
const getDbAdapters = function ({ adapters, config: { collections } }) {
  return mapValues(
    collections,
    ({ database }) => getDbAdapter({ adapters, database }),
  );
};

const getDbAdapter = function ({ adapters, database }) {
  return adapters.find(({ name }) => name === database);
};

module.exports = {
  getAdapters,
  getDbAdapters,
};
