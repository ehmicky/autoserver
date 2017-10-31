'use strict';

const { databaseAdapters } = require('../../../database');

const { getDynamicOpts } = require('./dynamic');

// Options shared by all database adapters
const commonOpts = [];

const db = getDynamicOpts({
  name: 'db',
  title: 'Database',
  handlers: databaseAdapters,
  commonOpts,
});

module.exports = db;
