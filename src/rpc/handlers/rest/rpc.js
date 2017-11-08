'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { handler } = require('./handler');

const rpc = {
  name: 'rest',
  title: 'REST',
  routes,
  methods,
  handler,
};

module.exports = rpc;
