'use strict';

const { description } = require('../../../formats');

const config = {
  name: 'config',
  description: `Configuration file (${description})`,
  validate: {
    type: 'string',
  },
};

module.exports = {
  config,
};
