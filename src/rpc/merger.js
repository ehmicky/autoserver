'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const rpcAdapters = keyBy(adapters);

module.exports = {
  rpcAdapters,
};
