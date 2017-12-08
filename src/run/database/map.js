'use strict';

const { mapValues, uniq } = require('../../utilities');
const { databaseAdapters } = require('../../database');

// Returns array of all adapters that are defined in schema
const getAdapters = function ({ schema: { collections, databases } }) {
  const names = Object.values(collections).map(({ database }) => database);
  const namesA = uniq(names);
  const databaseAdaptersA = namesA
    .map(name => ({ ...databaseAdapters[name], options: databases[name] }));
  return databaseAdaptersA;
};

// Returns `{ collname: adapter }` map
const getDbAdapters = function ({ adapters, schema: { collections } }) {
  return mapValues(
    collections,
    ({ database: name }) => getDbAdapter({ adapters, name }),
  );
};

const getDbAdapter = function ({ adapters, name }) {
  return adapters.find(({ name: nameA }) => nameA === name);
};

module.exports = {
  getAdapters,
  getDbAdapters,
};
