'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const formatAdapters = keyBy(adapters);

// Default format for structured types, and unstructure types
const DEFAULT_FORMAT = formatAdapters.json;
const DEFAULT_RAW_FORMAT = formatAdapters.raw;

module.exports = {
  formatAdapters,
  DEFAULT_FORMAT,
  DEFAULT_RAW_FORMAT,
};
