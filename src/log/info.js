'use strict';

const { mapValues } = require('../utilities');

const { logAdapters } = require('./merger');

// Retrieves log options
const getOpts = function () {
  return mapValues(logAdapters, ({ opts = {} }) => opts);
};

const LOG_OPTS = getOpts();

module.exports = {
  LOG_OPTS,
};
