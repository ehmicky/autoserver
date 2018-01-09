'use strict';

const { mapValues, keyBy } = require('../utilities');

const databaseAdapters = require('./adapters');

const databaseAdaptersA = keyBy(databaseAdapters);

// Retrieves database options
const getOpts = function () {
  return mapValues(databaseAdaptersA, ({ opts = {} }) => opts);
};

const DATABASE_OPTS = getOpts();

// Retrieves database defaults
const getDefaults = function () {
  return mapValues(databaseAdaptersA, ({ defaults = {} }) => defaults);
};

const DATABASE_DEFAULTS = getDefaults();

const CONSTANTS = {
  FEATURES: [
    'filter:_eq',
    'filter:_neq',
    'filter:_lt',
    'filter:_gt',
    'filter:_lte',
    'filter:_gte',
    'filter:_in',
    'filter:_nin',
    'filter:_like',
    'filter:_nlike',
    'filter:_or',
    'filter:_and',
    'filter:_some',
    'filter:_all',
    'filter:sibling',
    'order',
    'offset',
  ],
  DEFAULT_DATABASE: 'memory',

  DATABASE_OPTS,
  DATABASE_DEFAULTS,
};

module.exports = CONSTANTS;
