'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { transformSuccess, transformError } = require('./response');
const { parse } = require('./parse');

const rpc = {
  name: 'jsonrpc',
  title: 'JSON-RPC',
  routes,
  methods,
  parse,
  transformSuccess,
  transformError,
};

module.exports = rpc;
