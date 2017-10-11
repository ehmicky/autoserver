'use strict';

const opts = require('./opts');

const kinds = ['data', 'search'];

module.exports = {
  type: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  kinds,
  opts,
};
