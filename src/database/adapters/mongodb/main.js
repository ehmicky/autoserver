'use strict';

const opts = require('./opts');

module.exports = {
  type: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features: ['filter'],
  opts,
};
