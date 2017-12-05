'use strict';

const { keyBy } = require('../utilities');

const handlers = require('./handlers');

// Return object of all loggers, as { NAME: LOGGERS }
// Everything that is database logger-specific is in this directory.
const loggers = keyBy(handlers);

const DEFAULT_LOGGER = loggers.custom;

module.exports = {
  loggers,
  DEFAULT_LOGGER,
};
