'use strict';

const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { create } = require('./create');
const opts = require('./opts');

const adapter = {
  type: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features: ['filter'],
  connect,
  disconnect,
  create,
  opts,
  idName: '_id',
};

module.exports = adapter;
