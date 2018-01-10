'use strict';

const { keyBy } = require('../utilities');

const rpcAdapters = require('./adapters');

const rpcAdaptersA = keyBy(rpcAdapters);

const RPCS = Object.keys(rpcAdaptersA);

module.exports = {
  RPCS,
};
