'use strict';

const routes = require('./routes');
const methods = require('./methods');
const payload = require('./payload');
const { handler } = require('./handler');
const { transformError } = require('./response');
const { compileSchema } = require('./compile');
const { startServer } = require('./startup');

const rpc = {
  name: 'graphql',
  title: 'GraphQL',
  routes,
  methods,
  payload,
  handler,
  transformError,
  compileSchema,
  startServer,
};

module.exports = rpc;
