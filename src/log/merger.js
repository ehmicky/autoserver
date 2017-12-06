'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const logAdapters = keyBy(adapters);

const DEFAULT_LOGGER = logAdapters.console;

module.exports = {
  logAdapters,
  DEFAULT_LOGGER,
};
