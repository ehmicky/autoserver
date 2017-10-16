'use strict';

const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { query } = require('./query');
const opts = require('./opts');

const adapter = {
  type: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features: ['filter'],
  connect,
  disconnect,
  query,
  opts,
  idName: '_id',
};

module.exports = adapter;
