'use strict';

const { connect } = require('./connect');
const { check } = require('./check');
const { disconnect } = require('./disconnect');
const { query } = require('./query');
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
  query,
  opts,
};

module.exports = adapter;
