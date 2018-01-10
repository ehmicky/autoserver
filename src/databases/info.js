'use strict';

const { getMember } = require('../adapters');

const databaseAdapters = require('./adapters');

const DATABASE_OPTS = getMember(databaseAdapters, 'opts', {});
const DATABASE_DEFAULTS = getMember(databaseAdapters, 'defaults', {});

module.exports = {
  DATABASE_OPTS,
  DATABASE_DEFAULTS,
};
