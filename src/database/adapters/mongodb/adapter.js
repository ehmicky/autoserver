'use strict';

const features = require('./features');
const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { query } = require('./query');
const opts = require('./opts');

const adapter = {
  name: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features,
  connect,
  disconnect,
  query,
  opts,
  idName: '_id',
};

module.exports = adapter;
