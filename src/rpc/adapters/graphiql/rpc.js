'use strict';

const methods = require('./methods');
const routes = require('./routes');
const { handler } = require('./handler');

const rpc = {
  name: 'graphiql',
  title: 'GraphiQL',
  methods,
  routes,
  handler,
};

module.exports = rpc;
