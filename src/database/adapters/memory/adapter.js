'use strict';

const features = require('./features');
const { disconnect } = require('./disconnect');
const { connect } = require('./connect');
const { check } = require('./check');
const { query } = require('./query');
const defaults = require('./defaults');
const { opts } = require('./opts');

// Memory database adapter, i.e. keeps database in-memory
const adapter = {
  name: 'memory',
  title: 'In-Memory',
  description: 'In-memory database. For development purpose only.',
  features,
  connect,
  check,
  disconnect,
  query,
  defaults,
  opts,
};

module.exports = adapter;
