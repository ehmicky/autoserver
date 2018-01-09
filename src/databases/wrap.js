'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');
const { connectDatabase } = require('./connect');
const {
  validateStartupFeatures,
  validateRuntimeFeatures,
} = require('./features');

const members = [
  'name',
  'title',
  'idName',
  'features',
  'getDefaultId',
];

const methods = {
  connect: connectDatabase,
  validateStartupFeatures,
  validateRuntimeFeatures,
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
