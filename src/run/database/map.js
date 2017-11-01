'use strict';

const { mapValues, uniq } = require('../../utilities');
const { databaseAdapters } = require('../../database');

// Returns array of all adapters that are defined in schema
const getAdapters = function ({ runOpts, schema: { models } }) {
  const names = Object.values(models).map(({ database }) => database);
  const namesA = uniq(names);
  const databaseAdaptersA = namesA
    .map(name => ({ ...databaseAdapters[name], options: runOpts.db[name] }));
  return databaseAdaptersA;
};

// Returns `{ model: adapter }` map
const getDbAdapters = function ({ adapters, schema: { models } }) {
  return mapValues(
    models,
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
