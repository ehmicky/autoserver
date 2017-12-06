'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const compressAdapters = keyBy(adapters);

const DEFAULT_COMPRESS = compressAdapters.identity;

module.exports = {
  compressAdapters,
  DEFAULT_COMPRESS,
};
