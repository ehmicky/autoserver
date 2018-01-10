'use strict';

const { mapValues, keyBy } = require('../utilities');

const logAdapters = require('./adapters');

const logAdaptersA = keyBy(logAdapters);

// Retrieves log options
const getOpts = function () {
  return mapValues(logAdaptersA, ({ opts = {} }) => opts);
};

const LOG_OPTS = getOpts();

module.exports = {
  LOG_OPTS,
};
