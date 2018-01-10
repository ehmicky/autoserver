'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { parse } = require('./parse');

const rpc = {
  name: 'rest',
  title: 'REST',
  routes,
  methods,
  parse,
};

module.exports = rpc;
