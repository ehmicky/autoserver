'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { parse } = require('./parse');
const { transformSuccess, transformError } = require('./response');
const { load } = require('./load');

const rpc = {
  name: 'graphql',
  title: 'GraphQL',
  routes,
  methods,
  parse,
  transformSuccess,
  transformError,
  load,
};

module.exports = rpc;
