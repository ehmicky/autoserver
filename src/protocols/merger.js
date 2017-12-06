'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const protocolAdapters = keyBy(adapters);

module.exports = {
  protocolAdapters,
};
