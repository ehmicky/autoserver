'use strict';

const { connect } = require('./connect');
const { disconnect } = require('./disconnect');
const { find } = require('./find');
const { create } = require('./create');
const { replace } = require('./replace');
const { delete: deleteFunc } = require('./delete');
const opts = require('./opts');

const adapter = {
  type: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features: ['filter'],
  connect,
  disconnect,
  find,
  create,
  replace,
  delete: deleteFunc,
  opts,
  idName: '_id',
};

module.exports = adapter;
