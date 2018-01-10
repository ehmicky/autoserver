'use strict';

const methods = require('./methods');
const routes = require('./routes');
const { parse } = require('./parse');

const rpc = {
  name: 'graphiql',
  title: 'GraphiQL',
  methods,
  routes,
  parse,
};

module.exports = rpc;
