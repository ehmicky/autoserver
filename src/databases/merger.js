'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const databaseAdapters = keyBy(adapters);

module.exports = {
  databaseAdapters,
};
