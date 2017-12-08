'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { handler } = require('./handler');
const { transformSuccess, transformError } = require('./response');
const { load } = require('./load');

const rpc = {
  name: 'graphql',
  title: 'GraphQL',
  routes,
  methods,
  handler,
  transformSuccess,
  transformError,
  load,
};

module.exports = rpc;
