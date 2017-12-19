'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

// Return object of all database adapters, as { NAME: ADAPTER }
// Everything that is database adapter-specific is in this directory.
const databaseAdapters = keyBy(adapters);

const DEFAULT_DATABASE = databaseAdapters.memory;

module.exports = {
  databaseAdapters,
  DEFAULT_DATABASE,
};
