'use strict';

const routes = require('./routes');
const { parse } = require('./parse');
const methods = require('./methods');

const rpc = {
  name: 'graphqlprint',
  title: 'GraphQLPrint',
  routes,
  methods,
  parse,
};

module.exports = rpc;
