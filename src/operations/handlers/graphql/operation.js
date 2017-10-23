'use strict';

const routes = require('./routes');
const methods = require('./methods');
const payload = require('./payload');
const { handler } = require('./handler');
const { transformResponse } = require('./response');
const { compileSchema } = require('./compile');
const { startServer } = require('./startup');

const operation = {
  name: 'GraphQL',
  routes,
  methods,
  payload,
  handler,
  transformResponse,
  compileSchema,
  startServer,
};

module.exports = operation;
