'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { handler } = require('./handler');
const { transformSuccess, transformError } = require('./response');
const { compileSchema } = require('./compile');
const { startServer } = require('./startup');

const rpc = {
  name: 'graphql',
  title: 'GraphQL',
  routes,
  methods,
  handler,
  transformSuccess,
  transformError,
  compileSchema,
  startServer,
};

module.exports = rpc;