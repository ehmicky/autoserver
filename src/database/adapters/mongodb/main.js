'use strict';

const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const opts = require('./opts');

module.exports = {
  type: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features: ['filter'],
  connect,
  disconnect,
  opts,
};
