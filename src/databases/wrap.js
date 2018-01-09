'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');
const { connectDatabase } = require('./connect');
const { validateFeatures } = require('./features');

const members = [
  'name',
  'title',
  'idName',
  'features',
  'getDefaultId',
];

const methods = {
  connect: connectDatabase,
  validateFeatures,
};

const databaseAdapters = wrapAdapters({
  adapters,
  members,
  methods,
  reason: 'DATABASE',
});

module.exports = {
  databaseAdapters,
};
