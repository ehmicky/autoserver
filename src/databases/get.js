'use strict';

const { getAdapter } = require('../adapters');

const { databaseAdapters } = require('./wrap');

// Retrieves database adapter
const getDatabase = function (key) {
  return getAdapter({ adapters: databaseAdapters, key, name: 'database' });
};

module.exports = {
  getDatabase,
};
