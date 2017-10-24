'use strict';

const methods = require('./methods');
const routes = require('./routes');
const { handler } = require('./handler');

const operation = {
  name: 'graphiql',
  title: 'GraphiQL',
  methods,
  routes,
  handler,
};

module.exports = operation;
