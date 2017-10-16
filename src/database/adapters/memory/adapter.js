'use strict';

const { connect } = require('./connect');
const { check } = require('./check');
const { disconnect } = require('./disconnect');
const { find } = require('./find');
const { create } = require('./create');
const { delete: deleteMany } = require('./delete');
const { replace } = require('./replace');
const { opts } = require('./opts');

// Memory database adapter, i.e. keeps database in-memory
const adapter = {
  type: 'memory',
  title: 'In-Memory',
  description: 'In-memory database. For development purpose only.',
  features: ['filter'],
  connect,
  check,
  disconnect,
  find,
  create,
  delete: deleteMany,
  replace,
  opts,
};

module.exports = adapter;
