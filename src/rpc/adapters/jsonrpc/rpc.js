'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { transformSuccess, transformError } = require('./response');
const { handler } = require('./handler');

const rpc = {
  name: 'jsonrpc',
  title: 'JSON-RPC',
  routes,
  methods,
  handler,
  transformSuccess,
  transformError,
};

module.exports = rpc;
