'use strict';

const { keyBy } = require('../utilities');

const handlers = require('./handlers');

const compressHandlers = keyBy(handlers);

const DEFAULT_COMPRESS = compressHandlers.identity;

module.exports = {
  compressHandlers,
  DEFAULT_COMPRESS,
};
