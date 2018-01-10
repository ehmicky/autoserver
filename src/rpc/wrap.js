'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');
const { checkMethod } = require('./method_check');
const { transformResponse } = require('./transform');

const members = [
  'name',
  'title',
  'load',
  'parse',
];

const methods = {
  checkMethod,
  transformResponse,
};

const rpcAdapters = wrapAdapters({
  adapters,
  members,
  methods,
  reason: 'RPC',
});

module.exports = {
  rpcAdapters,
};
