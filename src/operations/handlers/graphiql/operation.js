'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { handler } = require('./handler');

const operation = {
  name: 'graphiql',
  title: 'GraphiQL',
  routes,
  methods,
  handler,
};

module.exports = operation;
