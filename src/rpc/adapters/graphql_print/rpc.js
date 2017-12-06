'use strict';

const routes = require('./routes');
const { handler } = require('./handler');
const methods = require('./methods');

const rpc = {
  name: 'graphqlprint',
  title: 'GraphQLPrint',
  routes,
  methods,
  handler,
};

module.exports = rpc;
